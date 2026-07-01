import BillModel from "../models/bill.model.js";
import BillSplitModel from "../models/billSplit.model.js";
import GroupMemberModel from "../models/groupMember.model.js";

const BillService = () => {
  const billModel = BillModel();
  const billSplitModel = BillSplitModel();
  const groupMemberModel = GroupMemberModel();

  // `splits`, when provided, is a proportional/custom split: an array of
  // { userId, amountOwed } for every non-payer member, which must add up to
  // the bill's total amount. When omitted, the amount is split equally
  // among all members instead.
  const createBill = async (groupId, requestingUserId, { description, amount, splits }) => {
    const isMember = await groupMemberModel.isMember(groupId, requestingUserId);
    if (!isMember) {
      return { success: false, message: "You are not a member of this group", code: 403 };
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return { success: false, message: "The field description is required", code: 400 };
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return { success: false, message: "The field amount must be a positive number", code: 400 };
    }

    const members = await groupMemberModel.findByGroup(groupId);
    if (members.length === 0) {
      return { success: false, message: "The group has no members to split the bill with", code: 400 };
    }

    let finalSplits;
    if (Array.isArray(splits) && splits.length > 0) {
      const memberIds = new Set(members.map((member) => member.userId));
      let total = 0;

      for (const split of splits) {
        const userId = Number(split.userId);
        const amountOwed = Number(split.amountOwed);

        if (userId === requestingUserId) {
          return { success: false, message: "The payer shouldn't have a share in the splits", code: 400 };
        }
        if (!memberIds.has(userId)) {
          return { success: false, message: "All splits must belong to current group members", code: 400 };
        }
        if (!Number.isFinite(amountOwed) || amountOwed < 0) {
          return { success: false, message: "Every split amount must be a non-negative number", code: 400 };
        }

        total += amountOwed;
      }

      if (Math.abs(total - numericAmount) > 0.01) {
        return { success: false, message: "The splits must add up to the bill's total amount", code: 400 };
      }

      finalSplits = splits.map((split) => ({
        userId: Number(split.userId),
        amountOwed: Number(split.amountOwed),
      }));
    } else {
      const share = Math.round((numericAmount / members.length) * 100) / 100;
      finalSplits = members
        .filter((member) => member.userId !== requestingUserId)
        .map((member) => ({ userId: member.userId, amountOwed: share }));
    }

    const bill = await billModel.create({
      groupId,
      description: description.trim(),
      amount: numericAmount,
      paidByUserId: requestingUserId,
    });

    if (finalSplits.length > 0) {
      await billSplitModel.createMany(bill.id, finalSplits);
    }

    return { success: true, bill, message: "Bill created successfully", code: 201 };
  };

  const listByGroup = async (groupId, requestingUserId) => {
    const isMember = await groupMemberModel.isMember(groupId, requestingUserId);
    if (!isMember) {
      return { success: false, message: "You are not a member of this group", code: 403 };
    }

    const bills = await billModel.findByGroup(groupId);
    const billsWithSplits = await Promise.all(
      bills.map(async (bill) => ({
        ...bill,
        splits: await billSplitModel.findByBill(bill.id),
      }))
    );

    return { success: true, bills: billsWithSplits };
  };

  const removeBill = async (billId, requestingUserId) => {
    const bill = await billModel.findUnique(billId);
    if (!bill) {
      return { success: false, message: "Bill not found", code: 404 };
    }

    if (bill.paidbyuserid !== requestingUserId) {
      return { success: false, message: "Only the person who paid can delete this bill", code: 403 };
    }

    const removed = await billModel.delete(billId);
    return { success: removed, code: removed ? 204 : 500 };
  };

  const settleSplit = async (splitId, requestingUserId) => {
    const split = await billSplitModel.findUnique(splitId);
    if (!split) {
      return { success: false, message: "Bill split not found", code: 404 };
    }

    if (split.userid !== requestingUserId) {
      return { success: false, message: "You can only settle your own share", code: 403 };
    }

    const updated = await billSplitModel.settle(splitId);
    return { success: true, split: updated, message: "Marked as settled", code: 200 };
  };

  const getSummary = async (userId) => {
    return await billSplitModel.summaryForUser(userId);
  };

  return {
    createBill,
    listByGroup,
    removeBill,
    settleSplit,
    getSummary,
  };
};

export default BillService;

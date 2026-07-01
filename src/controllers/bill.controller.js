import BillService from "../services/bill.service.js";

const BillController = () => {
  const billService = BillService();

  const getByGroup = async (req, res) => {
    try {
      const groupId = Number(req.query.groupId);
      if (!groupId) {
        return res.status(400).json({ message: "The query param groupId is required" });
      }

      const result = await billService.listByGroup(groupId, req.user.id);
      if (!result.success) {
        return res.status(result.code).json({ message: result.message });
      }
      return res.status(200).json(result.bills);
    } catch (error) {
      console.error("Error in getByGroup bills controller:", error);
      return res.status(500).json({ message: "Error fetching bills" });
    }
  };

  const getSummary = async (req, res) => {
    try {
      const summary = await billService.getSummary(req.user.id);
      return res.status(200).json(summary);
    } catch (error) {
      console.error("Error in getSummary bills controller:", error);
      return res.status(500).json({ message: "Error fetching bill summary" });
    }
  };

  const create = async (req, res) => {
    try {
      const { groupId, description, amount } = req.body;
      if (!groupId) {
        return res.status(400).json({ message: "The field groupId is required" });
      }

      const result = await billService.createBill(Number(groupId), req.user.id, { description, amount });
      return res.status(result.code).json(
        result.success ? { bill: result.bill, message: result.message } : { message: result.message }
      );
    } catch (error) {
      console.error("Error in create bill controller:", error);
      return res.status(500).json({ message: "Error creating bill" });
    }
  };

  const removeById = async (req, res) => {
    try {
      const result = await billService.removeBill(Number(req.params.id), req.user.id);
      if (result.success) {
        return res.status(204).send();
      }
      return res.status(result.code).json({ message: result.message });
    } catch (error) {
      console.error("Error in remove bill controller:", error);
      return res.status(500).json({ message: "Error deleting bill" });
    }
  };

  const settleSplit = async (req, res) => {
    try {
      const result = await billService.settleSplit(Number(req.params.splitId), req.user.id);
      return res.status(result.code).json(
        result.success ? { split: result.split, message: result.message } : { message: result.message }
      );
    } catch (error) {
      console.error("Error in settle bill split controller:", error);
      return res.status(500).json({ message: "Error settling bill split" });
    }
  };

  return {
    getByGroup,
    getSummary,
    create,
    removeById,
    settleSplit,
  };
};

export default BillController;

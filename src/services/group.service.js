import GroupModel from "../models/group.model.js";
import GroupMemberModel from "../models/groupMember.model.js";
import UserModel from "../models/user.model.js";

const GroupService = () => {
  const groupModel = GroupModel();
  const groupMemberModel = GroupMemberModel();
  const userModel = UserModel();

  const getAll = async (sort, userId) => {
    try {
      return await groupModel.findMany(sort, userId);
    } catch (error) {
      console.error("Error in getAll service:", error);
      throw new Error("Error fetching groups");
    }
  };

  const getById = async (id) => {
    return await groupModel.findUnique(id);
  };

  const getByName = async (name) => {
    return await groupModel.findByName(name);
  };

  // newGroup: { name: string, color: string, ownerUserId: number }
  const create = async (newGroup) => {
    const { name, color, ownerUserId } = newGroup;

    if (name.length > 30) {
      return {
        newGroup: null,
        success: false,
        message: "The field name cannot be longer than 30 characters",
        code: 400,
      };
    }

    const groupFound = await groupModel.findByName(name);
    if (groupFound) {
      return {
        newGroup: null,
        success: false,
        message: "The group already exists",
        code: 400,
      };
    }

    const createdGroup = await groupModel.create({ name, color, ownerUserId });
    await groupMemberModel.add(createdGroup.id, ownerUserId);

    return {
      newGroup: createdGroup,
      success: true,
      message: "Group created successfully",
      code: 201,
    };
  };

  const editById = async (id, group) => {
    const existingGroup = await groupModel.findUnique(id);
    if (!existingGroup) {
      return {
        success: false,
        message: `Group with id ${id} does not exist`,
        code: 404,
      };
    }

    const updatedGroup = { ...existingGroup, ...group };
    const success = await groupModel.update(id, updatedGroup);

    return {
      success,
      message: success ? "Group updated successfully" : "Failed to update group",
      code: success ? 200 : 500,
    };
  };

  const removeById = async (id) => {
    const existingGroup = await groupModel.findUnique(id);
    if (!existingGroup) {
      return {
        success: false,
        message: `Group with id ${id} does not exist`,
        code: 404,
      };
    }

    const removed = await groupModel.delete(id);
    if (!removed) {
      return { success: false, message: "Failed to delete group", code: 500 };
    }

    return { success: true };
  };

  const getMembers = async (groupId, userId) => {
    const isMember = await groupMemberModel.isMember(groupId, userId);
    if (!isMember) {
      return { success: false, message: "You are not a member of this group", code: 403 };
    }

    const members = await groupMemberModel.findByGroup(groupId);
    return { success: true, members };
  };

  const addMember = async (groupId, requestingUserId, email) => {
    const isMember = await groupMemberModel.isMember(groupId, requestingUserId);
    if (!isMember) {
      return { success: false, message: "You are not a member of this group", code: 403 };
    }

    const user = await userModel.getByEmail(email);
    if (!user) {
      return { success: false, message: "User not found", code: 404 };
    }

    const alreadyMember = await groupMemberModel.isMember(groupId, user.id);
    if (alreadyMember) {
      return { success: false, message: "User is already a member of this group", code: 400 };
    }

    const member = await groupMemberModel.add(groupId, user.id);
    return { success: true, member, message: "Member added to group", code: 201 };
  };

  const removeMember = async (groupId, memberUserId, requestingUserId) => {
    const isMember = await groupMemberModel.isMember(groupId, requestingUserId);
    if (!isMember) {
      return { success: false, message: "You are not a member of this group", code: 403 };
    }

    const removed = await groupMemberModel.remove(groupId, memberUserId);
    if (!removed) {
      return { success: false, message: "Member not found in this group", code: 404 };
    }

    return { success: true };
  };

  return {
    getAll,
    getById,
    getByName,
    create,
    editById,
    removeById,
    getMembers,
    addMember,
    removeMember,
  };
};

export default GroupService;

import GroupModel from "../models/group.model.js";

const GroupService = () => {
  const groupModel = GroupModel();

  /**
   *
   * @returns
   */
  const getAll = async (sort, userId) => {
    try {
      const groups = await groupModel.findMany(sort, userId); // Llama al modelo con userId
      return groups;
    } catch (error) {
      console.error("Error in getAll service:", error);
      throw new Error("Error fetching groups");
    }
  };

  /**
   *
   * @param number id
   * @returns
   */
  const getById = async (id) => {
    return await groupModel.findUnique(id);
  };

  /**
   *
   * @param string name
   * @returns
   */
  const getByName = async (name) => {
    const groupFound = await groupModel.findByName(name);
    return groupFound;
  };

  /**
   *
   * @param newGroup of the form: {id: number, name: string, color: string}
   * @returns
   */
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
  
    const updatedGroup = {
      ...existingGroup,
      ...group,
    };
  
    const success = await groupModel.update(id, updatedGroup);
  
    return {
      success,
      message: success ? 'Group updated successfully' : 'Failed to update group',
      code: success ? 200 : 500,
    };
  };
  

  const removeById = async (id) => {
    const existingGroup = await groupModel.findUnique(id);
  
    if (!existingGroup) {
      return {
        success: false,
        message: `Group with id ${id} does not exist`,
        code: 404
      };
    }
  
    const removed = await groupModel.delete(id);
  
    if (removed) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: "Failed to delete group",
        code: 500
      };
    }
  };
  

  return {
    getAll,
    getById,
    getByName,
    create,
    editById,
    removeById,
  };
};

export default GroupService;

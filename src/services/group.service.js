import  Model  from "../lib/model.js";

const GroupService = () => {
  const groupModel = Model();

  /**
   *
   * @param string sort
   * @returns
   */
  const getAll = async () => {
  const groups = await groupModel.findMany();
 
  return groups;
};

  /**
   *
   * @param number id
   * @returns
   */
  const getById = (id) => {
    return groupModel.findUnique(id);
  };

  /**
   *
   * @param string name
   * @returns
   */
  const getByName = async (name) => {
    const groupFound = await groupModel.findByName("name", name)
    return groupFound;
  };

  /**
   *
   * @param newGroup of the form: {id: number, name: string, color: string}
   * @returns
   */
  const create = async (newGroup) => {
    const { name } = newGroup;

    if (name.length > 30) {
      return {
        newGroup: null,
        success: false,
        message: "The field name can not be longer thatn 30 characters",
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

    const createdGroup = await groupModel.create(newGroup);
    

    return {
      newGroup: createdGroup,
      success: true,
      message: "Group created successfully",
      code: 201,
    };

  };

  const editById = (id, group) => {
    const existingGroup = groupModel.findUnique(id);
  
    if (!existingGroup) {
      return false;
    }
  
    const updatedGroup = {
      ...existingGroup,
      ...group,
    };
  
    const success = groupModel.update(id, updatedGroup);
  
    return success;
  };
  
  const removeById = (id) => {
    const removed = groupModel.delete(id);
    
    if (removed) {
      return true; 
    }
    return false;
  };

  return {
    getAll,
    getById,
    getByName,
    create,
    editById,
    removeById
  };
};

export default GroupService ;

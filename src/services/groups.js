import  Model  from "../database/model.js";

const GroupService = () => {
  const groupModel = Model([
    {
      id: 1,
      name: "Group 4",
      color: "#FF0000",
    },
    {
      id: 2,
      name: "Group 6",
      color: "#0000FF",
    },
  ]);

  /**
   *
   * @param string sort
   * @returns
   */
  const getAll = (sort) => {
    const groups = groupModel.findMany();
    const sortedGroups =
      sort === "asc"
        ? groups.sort((a, b) => a.name.localeCompare(b.name))
        : groups.sort((a, b) => b.name.localeCompare(a.name));
    return sortedGroups;
   
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
  const getByName = (name) => {
    const groupFound = groupModel.findWhere("name", name)
    return groupFound;
  };

  /**
   *
   * @param newGroup of the form: {id: number, name: string, color: string}
   * @returns
   */
  const create = (newGroup) => {
    const { name } = newGroup;

    if (name.length > 30) {
      return {
        newGroup: null,
        success: false,
        message: "The field name can not be longer thatn 30 characters",
        code: 400,
      };
    }

    const groupFound = groupModel.findWhere("name", name);

    if (groupFound) {
      return {
        newGroup: null,
        success: false,
        message: "The group already exists",
        code: 400,
      };
    }

    const createdGroup = groupModel.create(newGroup);
    

    return {
      newGroup: createdGroup,
      success: true,
      message: "Group created successfully",
      code: 201,
    };
  };

  return {
    getAll,
    getById,
    getByName,
    create,
  };
};

export default GroupService ;

import  UserService  from "../services/user.service.js";

const UserController = () => {
  const userService = UserService();

  const getAll = async (req, res) => {
    const sort = req.query.sort || "desc";
    const groups = await userService.getAll(sort);

    return res.status(200).json(groups);
  };

  const getById = async (req, res) => {

    const user = await userService.getById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${req.params.id} does not exist` });
    }

    return res.status(200).json({
      user,
    });
  };

  const create = async (req, res) => {

    const response = await userService.create(req.body);

    return res.status(200).json(response);
  };

  return {
    getAll,
    getById,
    create,
  };
};

export default UserController ;
import UserService from "../services/user.service.js";
import jwt from "jsonwebtoken";

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
    const payload = { id: response.newUser.id, date: Date.now(), name: response.newUser.name };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const newResponse = {
      ...response,
      token
    }
    return res.status(200).json(newResponse);
  };

  return {
    getAll,
    getById,
    create,
  };
};

export default UserController;

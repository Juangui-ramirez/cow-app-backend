import UserService from "../services/user.service.js";
import jwt from "jsonwebtoken";

const UserController = () => {
  const userService = UserService();

  const getAll = async (req, res) => {
    try {
      const sort = req.query.sort || "desc";
      const users = await userService.getAll(sort);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error in getAll user controller:", error);
      return res.status(500).json({ message: "Error fetching users" });
    }
  };

  const getById = async (req, res) => {
    try {
      const user = await userService.getById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .json({ message: `User with id ${req.params.id} does not exist` });
      }
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error in getById user controller:", error);
      return res.status(500).json({ message: "Error fetching user" });
    }
  };

  const create = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "The fields name, email and password are required" });
      }

      const response = await userService.create({ name, email, password });
      const payload = { id: response.newUser.id, date: Date.now(), name: response.newUser.name };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.status(200).json({ ...response, token });
    } catch (error) {
      console.error("Error in create user controller:", error);
      return res.status(500).json({ message: "Error creating user" });
    }
  };

  return {
    getAll,
    getById,
    create,
  };
};

export default UserController;

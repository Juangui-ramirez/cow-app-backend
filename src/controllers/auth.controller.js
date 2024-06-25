import UserService from "../services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AuthController = () => {
  const userService = UserService();

  const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.getByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id, date: Date.now(), name: user.name };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ token });
  };

  return {login}
};

export default AuthController;



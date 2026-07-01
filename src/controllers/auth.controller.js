import UserService from "../services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AuthController = () => {
  const userService = UserService();

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "The fields email and password are required" });
      }

      const user = await userService.getByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const payload = { id: user.id, date: Date.now(), name: user.name };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.status(200).json({ token, userId: user.id });
    } catch (error) {
      console.error("Error in login controller:", error);
      return res.status(500).json({ message: "Error logging in" });
    }
  };

  return { login };
};

export default AuthController;

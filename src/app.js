import "dotenv/config";
import express from "express";
import cors from "cors";
import GroupRouter from "./router/group.router.js";
import UserRouter from "./router/user.router.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import "./utils/passport.config.js";
import UserModel from "./models/user.model.js";

//config
const app = express();
const PORT = process.env.PORT || 3000;

//config
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel().getByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user.id, date: Date.now(), name: user.name };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  res.json({ token });
});

app.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("You are authenticated");
  }
);

app.use("/groups", GroupRouter().registerRoutes());
app.use("/users", UserRouter().registerRoutes());

//main
app.listen(PORT, () => {
  console.info(`Express server running at http://localhost:${PORT} 🚀`);
});

import "dotenv/config";
import express from "express";
import cors from "cors";
import GroupRouter from "./router/group.router.js";
import UserRouter from "./router/user.router.js";
import passport from "passport";
import AuthRouter from "./router/auth.router.js";
import applyJWTAuthentication from "./middlewares/auth.middleware.js";
import "./utils/passport.config.js";

//config
const app = express();
const PORT = process.env.PORT || 3000;

//config
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

//Apply auth all routes except login and signup
app.use(applyJWTAuthentication);

app.use("/groups", GroupRouter().registerRoutes());
app.use("/users", UserRouter().registerRoutes());
app.use("/auth", AuthRouter().registerRoutes());

//main
app.listen(PORT, () => {
  console.info(`Express server running at http://localhost:${PORT} 🚀`);
});

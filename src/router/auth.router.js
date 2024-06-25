import Router from "express-promise-router";
import AuthController from "../controllers/auth.controller.js";

const AuthRouter = () => {
  const authController = AuthController();
  const registerRoutes = () => {
    const router = Router();

    router.post("/login", authController.login);

    return router;
  };

  return {
    registerRoutes,
  };
};

export default AuthRouter;

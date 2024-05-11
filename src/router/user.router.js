import Router  from "express-promise-router";
import  UserController  from "../controllers/user.contoller.js";

const UserRouter = () => {
  const userController = UserController();

  const registerRoutes = () => {
    const router = Router();

    router.get("/", userController.getAll);
    router.get("/:id", userController.getById);
    router.post("/", userController.create);

    return router;
  };

  return {
    registerRoutes,
  };
};

export default UserRouter ;
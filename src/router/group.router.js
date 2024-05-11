import Router  from "express-promise-router";
import GroupController from "../controllers/group.controller.js";

const GroupRouter = () => {
  const groupController = GroupController();

  const registerRoutes = () => {
    const router = Router();

    router.get("/", groupController.getAll);
    router.get("/:id(\\d+)", groupController.getById);
    router.get("/:name", groupController.getByName);
    router.post("/", groupController.create);
    router.put("/:id(\\d+)", groupController.editById);
    router.delete("/:id(\\d+)", groupController.removeById);

    return router;
  };

  return {
    registerRoutes,
  };
};

export default GroupRouter;

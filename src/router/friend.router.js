import Router from "express-promise-router";
import FriendController from "../controllers/friend.controller.js";

const FriendRouter = () => {
  const friendController = FriendController();

  const registerRoutes = () => {
    const router = Router();

    router.get("/", friendController.getAll);
    router.post("/", friendController.create);
    router.put("/:id(\\d+)/accept", friendController.accept);
    router.delete("/:id(\\d+)", friendController.removeById);

    return router;
  };

  return {
    registerRoutes,
  };
};

export default FriendRouter;

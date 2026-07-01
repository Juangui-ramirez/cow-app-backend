import Router from "express-promise-router";
import BillController from "../controllers/bill.controller.js";

const BillRouter = () => {
  const billController = BillController();

  const registerRoutes = () => {
    const router = Router();

    router.get("/summary", billController.getSummary);
    router.get("/", billController.getByGroup);
    router.post("/", billController.create);
    router.put("/splits/:splitId(\\d+)/settle", billController.settleSplit);
    router.delete("/:id(\\d+)", billController.removeById);

    return router;
  };

  return { registerRoutes };
};

export default BillRouter;

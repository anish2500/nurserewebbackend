import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";

const orderController = new OrderController();
const router = Router();

router.use(authorizedMiddleware);

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:orderId", orderController.getOrderById);
router.delete("/:orderId", orderController.clearOrder);

export default router;

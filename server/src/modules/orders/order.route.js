import express from "express";

import orderController from "./order.controller.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    orderController.placeOrder
);

router.delete(
    "/:id",
    authenticate,
    orderController.cancelOrder
);

router.get(
    "/",
    authenticate,
    orderController.getMyOrders
);

router.get(
    "/open",
    authenticate,
    orderController.getOpenOrders
);

router.get(
    "/history",
    authenticate,
    orderController.getOrderHistory
);

router.get(
    "/:id",
    authenticate,
    orderController.getOrderById
);


export default router;
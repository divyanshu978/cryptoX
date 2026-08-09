import express from "express";

import orderBookController
    from "./order-book.controller.js";

const router = express.Router();

router.get(
    "/:symbol",
    orderBookController.getOrderBook
);

export default router;
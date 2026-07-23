import express from "express";
import walletController from "./wallet.controller.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, walletController.getWallet);
router.post("/deposit",authenticate,walletController.deposit);
export default router;
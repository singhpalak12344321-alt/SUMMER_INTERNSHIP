import express from "express";
import { body } from "express-validator";
import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

const paymentRules = [
  body("customer").notEmpty().withMessage("Customer is required."),
  body("order").notEmpty().withMessage("Order is required."),
  body("amount").isNumeric().withMessage("Amount must be numeric."),
  body("method").isIn(["cash", "card", "upi", "bank-transfer"]).withMessage("Invalid payment method.")
];

router.use(protect);
router.route("/").get(getPayments).post(paymentRules, validateRequest, createPayment);
router.route("/:id").put(paymentRules, validateRequest, updatePayment).delete(deletePayment);

export default router;

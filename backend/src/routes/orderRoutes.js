import express from "express";
import { body } from "express-validator";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

const orderRules = [
  body("customer").notEmpty().withMessage("Customer is required."),
  body("items").isArray({ min: 1 }).withMessage("At least one order item is required."),
  body("items.*.service").notEmpty().withMessage("Service is required."),
  body("items.*.garment").notEmpty().withMessage("Garment is required."),
  body("items.*.quantity").isNumeric().withMessage("Quantity must be numeric."),
  body("items.*.unitPrice").isNumeric().withMessage("Unit price must be numeric."),
  body("dueDate").isISO8601().withMessage("Due date is required.")
];

router.use(protect);
router.route("/").get(getOrders).post(orderRules, validateRequest, createOrder);
router.route("/:id").get(getOrder).put(orderRules, validateRequest, updateOrder).delete(deleteOrder);

export default router;

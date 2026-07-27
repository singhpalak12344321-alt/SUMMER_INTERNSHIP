import express from "express";
import { body } from "express-validator";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

const customerRules = [
  body("name").trim().notEmpty().withMessage("Customer name is required."),
  body("phone").trim().notEmpty().withMessage("Phone number is required."),
  body("address").trim().notEmpty().withMessage("Address is required.")
];

router.use(protect);
router.route("/").get(getCustomers).post(customerRules, validateRequest, createCustomer);
router.route("/:id").get(getCustomer).put(customerRules, validateRequest, updateCustomer).delete(deleteCustomer);

export default router;

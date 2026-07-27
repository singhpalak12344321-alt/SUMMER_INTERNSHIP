import express from "express";
import { getOrderReport, getRevenueReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/revenue", protect, getRevenueReport);
router.get("/orders", protect, getOrderReport);

export default router;

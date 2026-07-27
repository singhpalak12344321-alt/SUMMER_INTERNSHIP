import asyncHandler from "express-async-handler";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [customers, orders, revenueResult, statusBreakdown, recentOrders] = await Promise.all([
    Customer.countDocuments(),
    Order.countDocuments(),
    Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, revenue: { $sum: "$amount" } } }
    ]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.find().populate("customer", "name phone").sort({ createdAt: -1 }).limit(5)
  ]);

  res.json({
    customers,
    orders,
    revenue: revenueResult[0]?.revenue || 0,
    statusBreakdown,
    recentOrders
  });
});

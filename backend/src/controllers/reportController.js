import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

export const getRevenueReport = asyncHandler(async (req, res) => {
  const revenueByDay = await Payment.aggregate([
    { $match: { status: "paid" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json(revenueByDay);
});

export const getOrderReport = asyncHandler(async (req, res) => {
  const ordersByService = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.service",
        quantity: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] } }
      }
    },
    { $sort: { revenue: -1 } }
  ]);

  res.json(ordersByService);
});

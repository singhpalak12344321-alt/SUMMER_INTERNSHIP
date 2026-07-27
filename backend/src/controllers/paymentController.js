import asyncHandler from "express-async-handler";
import Payment from "../models/Payment.js";

export const getPayments = asyncHandler(async (req, res) => {
  const { status, method } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (method) filter.method = method;

  const payments = await Payment.find(filter)
    .populate("customer", "name phone")
    .populate("order", "status total")
    .sort({ paidAt: -1 });

  res.json(payments);
});

export const createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);
  res.status(201).json(
    await payment.populate([
      { path: "customer", select: "name phone" },
      { path: "order", select: "status total" }
    ])
  );
});

export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found.");
  }

  res.json(payment);
});

export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found.");
  }
  res.json({ message: "Payment deleted." });
});

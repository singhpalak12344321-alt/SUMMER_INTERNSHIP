import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

const calculateTotals = (items, discount = 0, tax = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = Math.max(subtotal - Number(discount) + Number(tax), 0);
  return { subtotal, total };
};

export const getOrders = asyncHandler(async (req, res) => {
  const { status, search = "" } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .populate("customer", "name phone email")
    .sort({ createdAt: -1 });

  const filtered = search
    ? orders.filter((order) => order.customer?.name?.toLowerCase().includes(search.toLowerCase()))
    : orders;

  res.json(filtered);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("customer");
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }
  res.json(order);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items, discount = 0, tax = 0 } = req.body;
  const { subtotal, total } = calculateTotals(items, discount, tax);
  const order = await Order.create({ ...req.body, subtotal, total });
  res.status(201).json(await order.populate("customer", "name phone email"));
});

export const updateOrder = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.items) {
    const totals = calculateTotals(payload.items, payload.discount || 0, payload.tax || 0);
    payload.subtotal = totals.subtotal;
    payload.total = totals.total;
  }

  const order = await Order.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  }).populate("customer", "name phone email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  res.json(order);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }
  res.json({ message: "Order deleted." });
});

import asyncHandler from "express-async-handler";
import Customer from "../models/Customer.js";

export const getCustomers = asyncHandler(async (req, res) => {
  const { search = "", status } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  if (status) filter.status = status;

  const customers = await Customer.find(filter).sort({ createdAt: -1 });
  res.json(customers);
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found.");
  }
  res.json(customer);
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found.");
  }

  res.json(customer);
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found.");
  }
  res.json({ message: "Customer deleted." });
});

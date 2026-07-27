import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      enum: ["wash", "dry-clean", "iron", "stain-removal", "alteration"],
      required: true
    },
    garment: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    items: { type: [itemSchema], required: true },
    status: {
      type: String,
      enum: ["received", "washing", "drying", "ironing", "ready", "delivered", "cancelled"],
      default: "received"
    },
    dueDate: { type: Date, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

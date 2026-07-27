import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ["cash", "card", "upi", "bank-transfer"], required: true },
    status: { type: String, enum: ["pending", "paid", "refunded"], default: "paid" },
    paidAt: { type: Date, default: Date.now },
    reference: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);

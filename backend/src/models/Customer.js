import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

customerSchema.index({ name: "text", phone: "text", email: "text" });

export default mongoose.model("Customer", customerSchema);

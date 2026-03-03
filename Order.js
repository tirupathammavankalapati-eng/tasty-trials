import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        qty: { type: Number, default: 1 },
        priceAtPurchase: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    paymentRef: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

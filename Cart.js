import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        qty: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);

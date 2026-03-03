import mongoose from "mongoose";

const savedSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
  },
  { timestamps: true }
);

export default mongoose.model("Saved", savedSchema);

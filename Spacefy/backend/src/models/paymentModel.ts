import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  spaceId: { type: mongoose.Types.ObjectId, ref: "space", required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("payment", PaymentSchema);
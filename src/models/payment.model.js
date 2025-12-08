import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
  mealId: {
    type: Schema.Types.ObjectId,
    ref: "Meal",
  },
  mealName: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});
export const Payment = mongoose.model("Payment", paymentSchema);

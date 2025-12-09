import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  foodId: {
    type: Schema.Types.ObjectId,
    ref: "Meal",
  },
  chefId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  mealName: {
    type: String,
    required: true,
  },
  foodImage: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  userEmail: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "accepted", "delivered", "cancelled"],
    default: "pending",
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", orderSchema);

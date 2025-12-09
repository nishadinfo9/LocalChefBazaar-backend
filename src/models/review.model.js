import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  foodId: {
    type: Schema.Types.ObjectId,
    ref: "Meal",
    required: true,
  },
  reviewerName: {
    type: String,
    required: true,
  },
  reviewerImage: {
    type: String,
  },
  rating: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

export const Review = mongoose.model("Review", reviewSchema);

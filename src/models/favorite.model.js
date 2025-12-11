import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema(
  {
    chefId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    foodImage: {
      type: String,
      required: true,
    },
    mealId: {
      type: String,
      required: true,
    },
    mealName: {
      type: String,
      required: true,
    },
    chefName: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    favorited: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export const Favorite = mongoose.model("Favorite", favoriteSchema);

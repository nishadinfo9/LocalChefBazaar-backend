import { uploadOnCloudinary } from "../middlewares/uploadOnCloudinary.js";
import { Meal } from "../models/meal.model.js";
import { User } from "../models/user.model.js";

const createMeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const newMeals = req.body;

    console.log("file", req.file);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "user does not exist" });
    }

    if (!newMeals) {
      return res.status(401).json({ message: "new meals does not exist" });
    }
    newMeals.chefId = user._id;

    const foodImageLocalFile = req.file?.path;
    const foodImageUrl = await uploadOnCloudinary(foodImageLocalFile);

    console.log("foodImageUrl", foodImageUrl);
    newMeals.foodImage = foodImageUrl?.url;

    const meal = await Meal.create(newMeals);

    if (!meal) {
      return res.status(401).json({ message: "meal creating faild" });
    }

    return res.status(200).json({ message: "meal created successfully", meal });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllMeals = async (req, res) => {
  try {
    const { limit } = req.query;
    const meals = await Meal.find().sort({ createdAt: -1 }).limit(limit).lean();
    if (!meals) {
      return res.status(401).json({ message: "meals not found" });
    }

    return res
      .status(200)
      .json({ message: "all meals found successfully", meals });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMyMeals = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "user does not exist" });
    }

    const meals = await Meal.find({ userEmail: user.email })
      .sort({ createdAt: -1 })
      .lean();

    if (!meals.length) {
      return res.status(404).json({ message: "Meals not found" });
    }

    return res
      .status(200)
      .json({ message: "my meals found successfully", meals });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMealById = async (req, res) => {
  try {
    const { mealId } = req.params;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(401).json({ message: "meal not found" });
    }

    return res.status(200).json({ message: "meal found successfully", meal });
  } catch (error) {
    console.log(error);
  }
};

export { createMeal, getAllMeals, getMyMeals, getMealById };

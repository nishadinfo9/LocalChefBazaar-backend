import { uploadOnCloudinary } from "../middlewares/uploadOnCloudinary.js";
import { Meal } from "../models/meal.model.js";
import { User } from "../models/user.model.js";

const createMeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const newMeals = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "user does not exist" });
    }

    if (!newMeals) {
      return res.status(401).json({ message: "new meals does not exist" });
    }

    const foodImageLocalFile = req.file?.path;
    const foodImageUrl = await uploadOnCloudinary(foodImageLocalFile);

    newMeals.chefId = user.chefId;
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
    const { order, limit, skip } = req.query;

    const sortOptions = { price: 1 };
    if (order) {
      sortOptions["price"] = order !== "asce" ? -1 : 1;
    }

    const meals = await Meal.find()
      .sort(sortOptions)
      .skip(Number(skip || 0))
      .limit(Number(limit || 0))
      .lean();

    if (!meals.length) {
      return res.status(401).json({ message: "meals not found" });
    }

    const total = await Meal.countDocuments({});

    return res
      .status(200)
      .json({ message: "all meals found successfully", meals, total });
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
      return res.status(200).json({
        message: "No meals found",
        meals: [],
      });
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

const updateMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const updateMeals = req.body;

    if (!mealId || !updateMeals) {
      return res
        .status(409)
        .json({ message: "meal id or update data does not exist" });
    }

    const updateLocalImage = req.file?.path;

    if (updateLocalImage) {
      const uploadImageUrl = await uploadOnCloudinary(updateLocalImage);
      updateMeals.foodImage = uploadImageUrl.url;
    } else {
      const oldImage = await Meal.findById(mealId);
      updateMeals.foodImage = oldImage.foodImage;
    }

    const meal = await Meal.findByIdAndUpdate(
      mealId,
      { $set: updateMeals },
      { new: true }
    );

    if (!meal) {
      return res.status(401).json({ message: "meal updated faild" });
    }

    return res.status(200).json({ message: "meal updated successfully", meal });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMeal = async (req, res) => {
  try {
    const { mealId } = req.params;

    if (!mealId) {
      return res.status(401).json({ message: "mealId does not exist" });
    }

    const meal = await Meal.findByIdAndDelete(mealId);

    if (!meal) {
      return res.status(404).json({ message: "meal not found" });
    }

    return res.status(200).json({ message: "meal deleted successfully", meal });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createMeal,
  getAllMeals,
  getMyMeals,
  getMealById,
  updateMeal,
  deleteMeal,
};

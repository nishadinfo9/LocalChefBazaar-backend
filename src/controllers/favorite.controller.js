import { Favorite } from "../models/favorite.model.js";
import { Meal } from "../models/meal.model.js";

const addFavoriteMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const userEmail = req.user?.email;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(400).json({ message: "meal does not exist" });
    }

    const favorite = await Favorite.findOne({ mealId, userEmail });

    if (favorite) {
      favorite.favorited = !favorite.favorited;
      await favorite.save();

      return res.status(200).json({
        message: favorite.favorited
          ? "favorite meal added"
          : "favorite meal removed",
        favorited: favorite.favorited,
      });
    }

    favorite = await Favorite.create({
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
      userEmail,
      favorited: true,
    });

    return res.status(201).json({
      message: "favorite meal created successfully",
      favorited: true,
      favorite,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getFavoriteMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const userEmail = req.user.email;

    const favorite = await Favorite.findOne({ mealId, userEmail });

    if (!favorite) {
      return res.status(404).json({ message: "favorite not found" });
    }

    return res.status(200).json({
      message: "favorite favorite found successfully",
      favorited: favorite.favorited,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export { addFavoriteMeal, getFavoriteMeal };

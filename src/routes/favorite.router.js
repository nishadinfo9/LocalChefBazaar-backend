import { Router } from "express";
const router = Router();

import {
  addFavoriteMeal,
  getFavoriteMeal,
  getMyFavoriteMeals,
} from "../controllers/favorite.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router
  .route("/meal/add-favorite-meal/:mealId")
  .post(verifyJWT, addFavoriteMeal);
router.route("/meal/get-favorite-meal/:mealId").get(verifyJWT, getFavoriteMeal);
router.route("/meal/favorite-meals").get(verifyJWT, getMyFavoriteMeals);

export default router;

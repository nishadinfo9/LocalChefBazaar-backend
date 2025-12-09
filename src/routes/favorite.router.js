import { Router } from "express";
const router = Router();

import {
  addFavoriteMeal,
  getFavoriteMeal,
  getMyFavoriteMeals,
} from "../controllers/favorite.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkFraud } from "../middlewares/fraud.middleware.js";

router
  .route("/meal/add-favorite-meal/:mealId")
  .post(verifyJWT, checkFraud, addFavoriteMeal);
router
  .route("/meal/get-favorite-meal/:mealId")
  .get(verifyJWT, checkFraud, getFavoriteMeal);
router
  .route("/meal/favorite-meals")
  .get(verifyJWT, checkFraud, getMyFavoriteMeals);

export default router;

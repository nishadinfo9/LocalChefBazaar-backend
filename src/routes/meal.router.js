import { Router } from "express";
const router = Router();

import {
  createMeal,
  getAllMeals,
  getMyMeals,
  getMealById,
  updateMeal,
  deleteMeal,
} from "../controllers/meal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkFraud } from "../middlewares/fraud.middleware.js";
import { isRole } from "../middlewares/role.middleware.js";

router.route("/meals/all-meals").get(getAllMeals);
router
  .route("/meals/my-meals")
  .get(verifyJWT, isRole("chef"), checkFraud, getMyMeals);
router
  .route("/meals/single-meal/:mealId")
  .get(verifyJWT, checkFraud, getMealById);
router
  .route("/meals/delete-meals/:mealId")
  .delete(verifyJWT, isRole("chef"), checkFraud, deleteMeal);
router
  .route("/meals/create")
  .post(
    verifyJWT,
    isRole("chef"),
    checkFraud,
    upload.single("foodImage"),
    createMeal
  );
router
  .route("/meals/update-meals/:mealId")
  .patch(
    verifyJWT,
    isRole("chef"),
    checkFraud,
    upload.single("foodImage"),
    updateMeal
  );

export default router;

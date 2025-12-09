import { Router } from "express";
const router = Router();

import {
  createReview,
  getReviews,
  getAllReviews,
  getMyReviews,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkFraud } from "../middlewares/fraud.middleware.js";

router.route("/meals/review-create").post(verifyJWT, checkFraud, createReview);
router.route("/meals/reviews/:foodId").get(verifyJWT, checkFraud, getReviews);
router.route("/meals/my-reviews").get(verifyJWT, checkFraud, getMyReviews);
router.route("/meals/all-reviews").get(getAllReviews);

export default router;

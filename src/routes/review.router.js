import { Router } from "express";
const router = Router();

import {
  createReview,
  getReviews,
  getAllReviews,
  getMyReviews,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/meals/review-create").post(verifyJWT, createReview);
router.route("/meals/reviews/:foodId").get(verifyJWT, getReviews);
router.route("/meals/my-reviews").get(verifyJWT, getMyReviews);
router.route("/meals/all-reviews").get(getAllReviews);

export default router;

import { Router } from "express";
const router = Router();

import {
  createPaymentSession,
  verifyPaymentSession,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router
  .route("/payment/create-session/:mealId")
  .post(verifyJWT, createPaymentSession);
router
  .route("/payment/verify-session/:sessionId")
  .patch(verifyJWT, verifyPaymentSession);

export default router;

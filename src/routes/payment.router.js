import { Router } from "express";
const router = Router();

import {
  createPaymentSession,
  verifyPaymentSession,
  getMyPayments,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkFraud } from "../middlewares/fraud.middleware.js";

router
  .route("/payment/create-session/:mealId")
  .post(verifyJWT, checkFraud, createPaymentSession);
router
  .route("/payment/verify-session/:sessionId")
  .patch(verifyJWT, checkFraud, verifyPaymentSession);
router.route("/payment/my-payments").get(verifyJWT, checkFraud, getMyPayments);

export default router;

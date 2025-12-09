import { Router } from "express";
const router = Router();

import {
  createOrder,
  getMyOrder,
  updateOrderRequests,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkFraud } from "../middlewares/fraud.middleware.js";

router.route("/order/create/:mealId").post(verifyJWT, checkFraud, createOrder);
router.route("/order/my-orders").get(verifyJWT, checkFraud, getMyOrder);
router
  .route("/order/chef-orders")
  .get(verifyJWT, checkFraud, updateOrderRequests);

export default router;

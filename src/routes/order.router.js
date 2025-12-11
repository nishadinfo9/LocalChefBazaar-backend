import { Router } from "express";
const router = Router();

import {
  createOrder,
  getMyOrder,
  getOrderById,
  chefAllOrderRequests,
  updateOrderRequest,
  getDashboardStats,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkFraud } from "../middlewares/fraud.middleware.js";
import { isRole } from "../middlewares/role.middleware.js";

router.route("/order/create/:mealId").post(verifyJWT, checkFraud, createOrder);
router.route("/order/my-orders").get(verifyJWT, checkFraud, getMyOrder);
router
  .route("/order/single-orders/:foodId")
  .get(verifyJWT, checkFraud, getOrderById);
router
  .route("/order/chef-orders")
  .get(verifyJWT, isRole("chef"), checkFraud, chefAllOrderRequests);
router
  .route("/order/update-orders-status/:orderId")
  .patch(verifyJWT, isRole("chef"), checkFraud, updateOrderRequest);
router
  .route("/admin/dashboard-stats")
  .get(verifyJWT, checkFraud, getDashboardStats);

export default router;

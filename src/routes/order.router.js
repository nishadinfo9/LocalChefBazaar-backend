import { Router } from "express";
const router = Router();

import { createOrder, getMyOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/order/create/:mealId").post(verifyJWT, createOrder);
router.route("/order/my-orders").get(verifyJWT, getMyOrder);

export default router;

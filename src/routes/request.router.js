import { Router } from "express";
const router = Router();

import {
  createUserRequset,
  getUserRequest,
  getAllRequest,
  updateRequest,
} from "../controllers/request.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkFraud } from "../middlewares/fraud.middleware.js";

router.route("/user/user-request").get(verifyJWT, checkFraud, getUserRequest);
router
  .route("/user/create-request")
  .post(verifyJWT, checkFraud, createUserRequset);
router
  .route("/user/all-user-requests")
  .get(verifyJWT, checkFraud, getAllRequest);
router
  .route("/user/update-request/:userId")
  .patch(verifyJWT, checkFraud, updateRequest);

export default router;

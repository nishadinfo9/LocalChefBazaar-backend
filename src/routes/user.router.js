import { Router } from "express";
const router = Router();

// import
import {
  registerUser,
  loggedIn,
  logout,
  getCurrentUser,
  getUserProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
// executions
router
  .route("/user/register")
  .post(upload.single("profileImage"), registerUser);
router.route("/user/login").post(loggedIn);
router.route("/user/logout").post(verifyJWT, logout);
router.route("/user/current-user").get(verifyJWT, getCurrentUser);
router.route("/user/user-profile").get(verifyJWT, getUserProfile);

export default router;

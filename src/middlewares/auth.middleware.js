import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req?.headers?.authorization?.split(" ")[1] || req?.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "token does not exist" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Access token expired or invalid" });
    }

    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken"
    );
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

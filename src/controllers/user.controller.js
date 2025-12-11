import { uploadOnCloudinary } from "../middlewares/uploadOnCloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(404).json({ message: "all field does not exist" });
    }

    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({ message: "confirm password doesn't match" });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({ message: "user already exist" });
    }

    //file upload
    const avatarLocalFile = req.file?.path;
    const profile = await uploadOnCloudinary(avatarLocalFile);

    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      profileImage: profile?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .json({ message: "user created successfully", createdUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loggedIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "email password does not exist" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).json({ message: "user does not exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credintials" });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "10d" }
    );
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loginUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "user login successfully",
        user: { loginUser, accessToken, refreshToken },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "user does not exist" });
    }

    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ message: "user logout successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      message: "current user found succesfully",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "user does not exist" });
    }
    return res
      .status(200)
      .json({ message: "user profile found successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({ message: "Unauthorize access" });
    }
    const users = await User.find()
      .sort({ createdAt: -1 })
      .lean()
      .select("-password -refreshToken");
    if (!users.length) {
      return res
        .status(200)
        .json({ message: "user does not exist", users: [] });
    }

    return res.status(200).json({ message: "users found successfully", users });
  } catch (error) {
    console.log(error);
  }
};

const isFraudUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(409).json({ message: "user does not exist" });
    }

    const updateUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { status: "fraud" } },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json({ message: "fraud user found successfully", updateUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res
        .status(401)
        .json({ message: "incomingRefreshToken  does not exist" });
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decoded) {
      return res.status(404).json({ message: "decoded token not found" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(409).json({ message: "user does not exist" });
    }

    if (user.refreshToken !== incomingRefreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token is expired or used" });
    }

    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "10d" }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    };

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    console.log("Refresh token called for user:", user._id);

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        ...options,
        maxAge: 60 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        ...options,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Access token refreshed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  loggedIn,
  logout,
  getCurrentUser,
  getUserProfile,
  getAllUsers,
  isFraudUser,
  refreshToken,
};

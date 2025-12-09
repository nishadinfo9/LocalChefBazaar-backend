import { Request } from "../models/request.model.js";
import { User } from "../models/user.model.js";
import { generateChefId } from "../utils/generateChefId.js";

const createUserRequset = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requsetType } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "user not found" });

    const existRequest = await Request.findOne({ userEmail: user.email });

    if (existRequest) {
      await Request.findByIdAndUpdate(
        existRequest._id,
        {
          $set: { requestType: requsetType, requestStatus: "pending" },
        },
        { new: true }
      );
      return res.status(200).json({ message: "request sent again" });
      // return res.status(409).json({ message: "request already exist" });
    }

    const newRequest = {
      userId: userId,
      userName: user.name,
      userEmail: user.email,
      requestType: requsetType,
    };
    const request = await Request.create(newRequest);

    return res
      .status(200)
      .json({ message: "request sent successfully", request });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserRequest = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const request = await Request.findOne({ userEmail });

    if (!request) {
      return res.status(200).json({ message: "request not found" });
    }

    return res
      .status(200)
      .json({ message: "request found successfully", request });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorize" });
    }

    const requests = await Request.find().sort({ requestTime: -1 });

    if (!requests.length) {
      return res
        .status(200)
        .json({ message: "requests not found", requests: [] });
    }

    return res
      .status(200)
      .json({ message: "request found successfully", requests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { requestStatus, requestType } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const requestUpdateData = { requestStatus };
    if (requestStatus === "approve") {
      requestUpdateData.requestType = requestType;
    }

    const updatedRequest = await Request.findOneAndUpdate(
      { userEmail: user.email },
      { $set: requestUpdateData },
      { new: true }
    );

    const userUpdateData = {};
    if (requestStatus === "approve") {
      userUpdateData.role = requestType;
    }

    if (requestStatus === "approve" && requestType === "chef") {
      userUpdateData.chefId = generateChefId();
    }

    await User.findByIdAndUpdate(
      user._id,
      { $set: userUpdateData },
      { new: true }
    );

    return res.status(200).json({
      message: "User and request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export { createUserRequset, getUserRequest, getAllRequest, updateRequest };

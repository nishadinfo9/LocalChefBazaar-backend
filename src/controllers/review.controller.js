import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";

const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("body", req.body);
    const { rating, comment, reviewDate, foodId } = req.body;

    if (!rating || !comment || !foodId) {
      return res.status(401).json({ message: "review field does not exist" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "user does not exist" });
    }

    const newReview = {
      userId: userId,
      foodId,
      reviewerName: user.name,
      reviewerImage: user.profileImage || "",
      rating,
      comment,
      reviewDate: reviewDate || Date.now(),
    };

    const review = await Review.create(newReview);

    return res
      .status(201)
      .json({ message: "review created successfully", review });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getReviews = async (req, res) => {
  try {
    const { foodId } = req.params;

    const reviews = await Review.find({ foodId })
      .sort({ reviewDate: -1 })
      .limit(2);

    if (reviews.length === 0) {
      return res.status(200).json({ message: "No reviews yet", reviews: [] });
    }

    return res
      .status(200)
      .json({ message: "reviews found successfully", reviews });
  } catch (error) {
    console.log(error);
  }
};

const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ userId }).sort({ reviewDate: -1 });

    if (!reviews.length) {
      return res.status(200).json({ message: "review not found", reviews: [] });
    }

    return res
      .status(200)
      .json({ message: "my all review found successfully", reviews });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ reviewDate: -1 });

    if (reviews.length === 0) {
      return res.status(200).json({ message: "No reviews yet", reviews: [] });
    }

    return res
      .status(200)
      .json({ message: "reviews found successfully", reviews });
  } catch (error) {
    console.log(error);
  }
};

export { createReview, getReviews, getMyReviews, getAllReviews };

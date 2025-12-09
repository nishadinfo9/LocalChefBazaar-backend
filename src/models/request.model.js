import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
    enum: ["chef", "admin"],
    required: true,
  },
  requestStatus: {
    type: String,
    enum: ["pending", "approve", "reject"],
    default: "pending",
  },
  requestTime: {
    type: Date,
    default: Date.now,
  },
});
export const Request = mongoose.model("Request", requestSchema);

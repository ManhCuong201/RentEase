import mongoose, { Schema } from "mongoose";

const ReportSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", ReportSchema, "Reports");

export default Report;

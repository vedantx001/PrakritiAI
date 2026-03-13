import mongoose from "mongoose";

const discussionLikeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscussionPost",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

discussionLikeSchema.index({ post: 1, user: 1 }, { unique: true });

export default mongoose.model("DiscussionLike", discussionLikeSchema);

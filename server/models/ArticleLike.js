import mongoose from "mongoose";

const articleLikeSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleTopic",
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

articleLikeSchema.index({ topic: 1, user: 1 }, { unique: true });

export default mongoose.model("ArticleLike", articleLikeSchema);

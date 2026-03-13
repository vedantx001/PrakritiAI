import mongoose from "mongoose";

const discussionPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    tags: {
      type: [String],
      default: [],
    },
    reactions: {
      type: Number,
      default: 0,
      min: 0,
    },
    savesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

discussionPostSchema.index({ createdAt: -1 });

discussionPostSchema.pre("save", function () {
  if (Array.isArray(this.tags)) {
    this.tags = this.tags
      .map((t) => String(t).trim())
      .filter(Boolean)
      .slice(0, 10);
  }
});

export default mongoose.model("DiscussionPost", discussionPostSchema);

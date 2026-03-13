import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    contributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contributionType: {
      type: String,
      enum: ["new_topic", "existing_topic"],
      required: true,
    },

    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleChapter",
      default: null,
    },

    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleTopic",
      default: null,
    },

    proposedTitle: {
      type: String,
      trim: true,
    },

    proposedContent: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminFeedback: String,

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdTopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleTopic",
      default: null,
    },

    appliedTopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleTopic",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Contribution", contributionSchema);

import mongoose from "mongoose";

const articleTopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleChapter",
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    contributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    contributors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    readTime: Number,

    likesCount: {
      type: Number,
      default: 0,
    },

    savesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ArticleTopic", articleTopicSchema);

import mongoose from "mongoose";

const articleChapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleSeries",
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ArticleChapter", articleChapterSchema);

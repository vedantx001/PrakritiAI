import ArticleChapter from "../models/ArticleChapter.js";
import ArticleSeries from "../models/ArticleSeries.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET chapters of a series
export const getChaptersBySeriesSlug = asyncHandler(async (req, res) => {
  const { seriesSlug } = req.params;

  const series = await ArticleSeries.findOne({
    slug: seriesSlug,
    published: true,
  });

  if (!series) {
    return res.status(404).json({ message: "Series not found" });
  }

  const chapters = await ArticleChapter.find({
    series: series._id,
    published: true,
  }).sort({ order: 1, createdAt: 1 });

  res.json(chapters);
});

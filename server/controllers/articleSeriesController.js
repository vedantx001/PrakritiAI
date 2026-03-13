import ArticleSeries from "../models/ArticleSeries.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET all published series
export const getAllSeries = asyncHandler(async (req, res) => {
  const series = await ArticleSeries.find({ published: true })
    .sort({ order: 1, createdAt: 1 });

  res.json(series);
});

// GET single series by slug
export const getSeriesBySlug = asyncHandler(async (req, res) => {
  const { seriesSlug } = req.params;

  const series = await ArticleSeries.findOne({
    slug: seriesSlug,
    published: true,
  });

  if (!series) {
    return res.status(404).json({ message: "Series not found" });
  }

  res.json(series);
});

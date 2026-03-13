import express from "express";
import {
  getAllSeries,
  getSeriesBySlug,
} from "../controllers/articleSeriesController.js";

const router = express.Router();

router.get("/", getAllSeries);
router.get("/:seriesSlug", getSeriesBySlug);

export default router;

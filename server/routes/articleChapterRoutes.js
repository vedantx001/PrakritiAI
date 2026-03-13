import express from "express";
import { getChaptersBySeriesSlug } from "../controllers/articleChapterController.js";

const router = express.Router();

router.get("/:seriesSlug/chapters", getChaptersBySeriesSlug);

export default router;

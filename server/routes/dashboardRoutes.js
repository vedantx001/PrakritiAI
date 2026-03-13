import express from "express";
import {
  getAIHistory,
  getSavedRemedies,
  getSavedBlogs,
  getHealthSummary,
  getSavedLibrary,
} from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/ai-history", getAIHistory);
router.get("/saved-remedies", getSavedRemedies);
router.get("/saved-blogs", getSavedBlogs);
router.get("/saved-library", getSavedLibrary);
router.get("/health-summary", getHealthSummary);

export default router;

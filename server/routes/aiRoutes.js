import express from "express";
import { analyzeSymptoms } from "../controllers/aiController.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { anonymousDailyAiLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post("/analyze", optionalAuth, anonymousDailyAiLimiter, analyzeSymptoms);

export default router;

import express from "express";
import { analyzeSymptoms } from "../controllers/aiController.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const router = express.Router();

router.post("/analyze", optionalAuth, analyzeSymptoms);

export default router;

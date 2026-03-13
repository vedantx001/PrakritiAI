import express from "express";
import {
  submitContribution,
  myContributions,
} from "../controllers/contributionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitContribution);
router.get("/mine", protect, myContributions);

export default router;

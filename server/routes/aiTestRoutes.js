import express from "express";
import { testAI } from "../controllers/aiTestController.js";

const router = express.Router();

router.get("/", testAI);

export default router;
import express from "express";
import {
	createSeries,
	createChapter,
	createTopic,
	updateSeries,
	updateChapter,
	updateTopic,
	publishTopic,
	deleteSeries,
	deleteChapter,
	deleteTopic,
} from "../controllers/adminArticleController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/series", protect, authorizeRoles("admin"), createSeries);
router.post("/chapter", protect, authorizeRoles("admin"), createChapter);
router.post("/topic", protect, authorizeRoles("admin"), createTopic);
router.put("/series/:id", protect, authorizeRoles("admin"), updateSeries);
router.put("/chapter/:id", protect, authorizeRoles("admin"), updateChapter);
router.put("/topic/:id", protect, authorizeRoles("admin"), updateTopic);
router.put("/topic/:id/publish", protect, authorizeRoles("admin"), publishTopic);
router.delete("/series/:id", protect, authorizeRoles("admin"), deleteSeries);
router.delete("/chapter/:id", protect, authorizeRoles("admin"), deleteChapter);
router.delete("/topic/:id", protect, authorizeRoles("admin"), deleteTopic);


export default router;

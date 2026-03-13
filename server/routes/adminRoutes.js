import express from "express";
import {
  getPendingContributions,
  getAllContributions,
  approveContribution,
  rejectContribution,
} from "../controllers/contributionController.js";
import { getAdminDashboardSummary } from "../controllers/adminDashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/dashboard/summary", getAdminDashboardSummary);

router.get("/contributions", getPendingContributions);
router.get("/contributions/all", getAllContributions);
router.patch("/contributions/:id/approve", approveContribution);
router.patch("/contributions/:id/reject", rejectContribution);

export default router;

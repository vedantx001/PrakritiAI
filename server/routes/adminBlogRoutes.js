import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/adminBlogController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.post("/blogs", createBlog);
router.patch("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

export default router;

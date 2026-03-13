import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
} from "../controllers/blogController.js";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/commentController.js";
import { likeBlog, unlikeBlog } from "../controllers/likeController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.post("/", protect, createBlog);
router.post("/:blogId/like", protect, likeBlog);
router.delete("/:blogId/like", protect, unlikeBlog);
router.get("/:blogId/comments", getComments);
router.post("/:blogId/comments", protect, addComment);
router.delete("/:blogId/comments/:commentId", protect, deleteComment);
router.get("/:id", getBlogById);
router.delete("/:id", protect, deleteBlog);

export default router;

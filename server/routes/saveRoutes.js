import express from "express";
import {
  saveRemedy,
  unsaveRemedy,
  saveBlog,
  unsaveBlog,
  saveArticle,
  unsaveArticle,
  saveDiscussionPost,
  unsaveDiscussionPost,
} from "../controllers/saveController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Remedies
router.post("/remedy/:reportId", saveRemedy);
router.delete("/remedy/:reportId", unsaveRemedy);

// Blogs
router.post("/blog/:blogId", saveBlog);
router.delete("/blog/:blogId", unsaveBlog);

// Articles
router.post("/article/:topicId", saveArticle);
router.delete("/article/:topicId", unsaveArticle);

// Discussions
router.post("/discussion/:postId", saveDiscussionPost);
router.delete("/discussion/:postId", unsaveDiscussionPost);

export default router;

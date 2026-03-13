import express from "express";
import {
  getTopicsByChapterSlug,
  getTopicBySlug,
  getTopicEngagement,
} from "../controllers/articleTopicController.js";
import {
  addArticleComment,
  deleteArticleComment,
  getArticleComments,
  voteArticleComment,
  updateArticleComment,
} from "../controllers/commentController.js";
import {
  likeArticleTopic,
  unlikeArticleTopic,
} from "../controllers/likeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const router = express.Router();

router.get("/chapter/:chapterSlug/topics", getTopicsByChapterSlug);
router.get("/topic/:topicId/engagement", optionalAuth, getTopicEngagement);
router.post("/topic/:topicId/like", protect, likeArticleTopic);
router.delete("/topic/:topicId/like", protect, unlikeArticleTopic);
router.get("/topic/:topicId/comments", getArticleComments);
router.post("/topic/:topicId/comments", protect, addArticleComment);
router.post(
  "/topic/:topicId/comments/:commentId/vote",
  protect,
  voteArticleComment
);
router.put(
  "/topic/:topicId/comments/:commentId",
  protect,
  updateArticleComment
);
router.delete(
  "/topic/:topicId/comments/:commentId",
  protect,
  deleteArticleComment
);
router.get("/topic/:topicSlug", getTopicBySlug);

export default router;

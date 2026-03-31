import express from "express";
import {
  createDiscussionPost,
  deleteDiscussionPost,
  getDiscoverDiscussionTags,
  getDiscussionPostById,
  getDiscussionPostEngagement,
  getTopDiscussionContributors,
  getTrendingDiscussionTags,
  listDiscussionPosts,
  updateDiscussionPost,
} from "../controllers/discussionController.js";
import {
  addDiscussionComment,
  deleteDiscussionComment,
  getDiscussionComments,
  updateDiscussionComment,
  voteDiscussionComment,
} from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { likeDiscussionPost, unlikeDiscussionPost } from "../controllers/likeController.js";

const router = express.Router();

router.get("/tags/trending", getTrendingDiscussionTags);
router.get("/tags/discover", getDiscoverDiscussionTags);

router.get("/contributors/top", getTopDiscussionContributors);

router.get("/posts", optionalAuth, listDiscussionPosts);
router.get("/posts/:postId", optionalAuth, getDiscussionPostById);
router.post("/posts", protect, createDiscussionPost);
router.get("/posts/:postId/engagement", optionalAuth, getDiscussionPostEngagement);
router.post("/posts/:postId/like", protect, likeDiscussionPost);
router.delete("/posts/:postId/like", protect, unlikeDiscussionPost);
router.get("/posts/:postId/comments", getDiscussionComments);
router.post("/posts/:postId/comments", protect, addDiscussionComment);
router.post(
  "/posts/:postId/comments/:commentId/vote",
  protect,
  voteDiscussionComment
);
router.put(
  "/posts/:postId/comments/:commentId",
  protect,
  updateDiscussionComment
);
router.delete(
  "/posts/:postId/comments/:commentId",
  protect,
  deleteDiscussionComment
);
router.put("/posts/:id", protect, updateDiscussionPost);
router.delete("/posts/:id", protect, deleteDiscussionPost);

export default router;

import ArticleTopic from "../models/ArticleTopic.js";
import ArticleChapter from "../models/ArticleChapter.js";
import ArticleLike from "../models/ArticleLike.js";
import User from "../models/User.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// GET topics of a chapter
export const getTopicsByChapterSlug = asyncHandler(async (req, res) => {
  const { chapterSlug } = req.params;

  const chapter = await ArticleChapter.findOne({
    slug: chapterSlug,
    published: true,
  });

  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  const topics = await ArticleTopic.find({
    chapter: chapter._id,
    status: "published",
  })
    .populate("contributor", "name")
    .sort({ createdAt: 1 });

  res.json(topics);
});

// GET single article topic
export const getTopicBySlug = asyncHandler(async (req, res) => {
  const { topicSlug } = req.params;

  const topic = await ArticleTopic.findOne({
    slug: topicSlug,
    status: "published",
  })
    .populate("contributor", "name")
    .populate("contributors", "name")
    .populate("editedBy", "name");

  if (!topic) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.json(topic);
});

// GET topic engagement state (counts + per-user flags)
export const getTopicEngagement = asyncHandler(async (req, res) => {
  const { topicId } = req.params;

  const topic = await ArticleTopic.findById(topicId).select(
    "likesCount savesCount status"
  );

  if (!topic || topic.status !== "published") {
    return res.status(404).json({ message: "Topic not found" });
  }

  const likesCount = topic.likesCount ?? 0;
  const savesCount = topic.savesCount ?? 0;

  if (!req.user?._id) {
    return res.json({ likesCount, savesCount, liked: false, saved: false });
  }

  const [liked, saved] = await Promise.all([
    ArticleLike.exists({ topic: topicId, user: req.user._id }),
    User.exists({ _id: req.user._id, savedArticles: topicId }),
  ]);

  res.json({
    likesCount,
    savesCount,
    liked: Boolean(liked),
    saved: Boolean(saved),
  });
});

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

// GET canonical share payload for a published topic (used by client share UI)
export const getTopicSharePayload = asyncHandler(async (req, res) => {
  const { topicSlug } = req.params;

  const topic = await ArticleTopic.findOne({ slug: topicSlug, status: "published" })
    .select("title slug chapter")
    .populate({
      path: "chapter",
      select: "slug series",
      populate: {
        path: "series",
        select: "slug",
      },
    });

  if (!topic) {
    return res.status(404).json({ message: "Article not found" });
  }

  const seriesSlug = topic?.chapter?.series?.slug;
  const chapterSlug = topic?.chapter?.slug;

  if (!seriesSlug || !chapterSlug) {
    return res.status(404).json({ message: "Article not found" });
  }

  const canonicalPath = `/articles/${seriesSlug}/${chapterSlug}/${topic.slug}`;

  const envBase = (process.env.WEB_APP_URL || process.env.CLIENT_URL || "").trim();
  const headerOrigin = (req.get("origin") || "").trim();
  const baseUrl = (envBase || headerOrigin || "").replace(/\/$/, "");

  res.json({
    entityType: "article_topic",
    topic: {
      id: topic._id,
      slug: topic.slug,
      title: topic.title,
    },
    canonicalPath,
    absoluteUrl: baseUrl ? `${baseUrl}${canonicalPath}` : null,
    channels: [
      {
        id: "copy",
        label: "Copy link",
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
      },
    ],
  });
});

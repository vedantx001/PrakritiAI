import User from "../models/User.js";
import SymptomReport from "../models/SymptomReport.js";
import Blog from "../models/Blog.js";
import ArticleTopic from "../models/ArticleTopic.js";
import DiscussionPost from "../models/DiscussionPost.js";

/**
 * SAVE AI REMEDY
 */
export const saveRemedy = async (req, res) => {
  const { reportId } = req.params;

  const report = await SymptomReport.findById(reportId);
  if (!report)
    return res.status(404).json({ message: "Report not found" });

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { savedRemedies: reportId }, // prevents duplicates
  });

  res.json({ message: "Remedy saved" });
};

/**
 * UNSAVE AI REMEDY
 */
export const unsaveRemedy = async (req, res) => {
  const { reportId } = req.params;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedRemedies: reportId },
  });

  res.json({ message: "Remedy removed from saved" });
};

/**
 * SAVE BLOG
 */
export const saveBlog = async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog)
    return res.status(404).json({ message: "Blog not found" });

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { savedBlogs: blogId },
  });

  res.json({ message: "Blog saved" });
};

/**
 * UNSAVE BLOG
 */
export const unsaveBlog = async (req, res) => {
  const { blogId } = req.params;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedBlogs: blogId },
  });

  res.json({ message: "Blog removed from saved" });
};

/**
 * SAVE ARTICLE
 */
export const saveArticle = async (req, res) => {
  const { topicId } = req.params;

  const topic = await ArticleTopic.findById(topicId);
  if (!topic)
    return res.status(404).json({ message: "Topic not found" });

  const user = await User.findById(req.user._id).select("savedArticles");
  const alreadySaved = Boolean(
    user?.savedArticles?.some((id) => id.equals(topicId))
  );

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { savedArticles: topicId },
  });

  if (!alreadySaved) {
    topic.savesCount = (topic.savesCount ?? 0) + 1;
    await topic.save();
  }

  res.json({
    message: alreadySaved ? "Article already saved" : "Article saved",
    saved: true,
    savesCount: topic.savesCount ?? 0,
  });
};

/**
 * UNSAVE ARTICLE
 */
export const unsaveArticle = async (req, res) => {
  const { topicId } = req.params;

  const topic = await ArticleTopic.findById(topicId);
  if (!topic)
    return res.status(404).json({ message: "Topic not found" });

  const user = await User.findById(req.user._id).select("savedArticles");
  const wasSaved = Boolean(
    user?.savedArticles?.some((id) => id.equals(topicId))
  );

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedArticles: topicId },
  });

  if (wasSaved) {
    topic.savesCount = Math.max(0, (topic.savesCount ?? 0) - 1);
    await topic.save();
  }

  res.json({
    message: "Article removed from saved",
    saved: false,
    savesCount: topic.savesCount ?? 0,
  });
};

/**
 * SAVE DISCUSSION POST
 */
export const saveDiscussionPost = async (req, res) => {
  const { postId } = req.params;

  const post = await DiscussionPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const user = await User.findById(req.user._id).select("savedDiscussionPosts");
  const alreadySaved = Boolean(
    user?.savedDiscussionPosts?.some((id) => id.equals(postId))
  );

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { savedDiscussionPosts: postId },
  });

  if (!alreadySaved) {
    post.savesCount = (post.savesCount ?? 0) + 1;
    await post.save();
  }

  res.json({
    message: alreadySaved ? "Post already saved" : "Post saved",
    saved: true,
    isBookmarked: true,
    savesCount: post.savesCount ?? 0,
  });
};

/**
 * UNSAVE DISCUSSION POST
 */
export const unsaveDiscussionPost = async (req, res) => {
  const { postId } = req.params;

  const post = await DiscussionPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const user = await User.findById(req.user._id).select("savedDiscussionPosts");
  const wasSaved = Boolean(
    user?.savedDiscussionPosts?.some((id) => id.equals(postId))
  );

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedDiscussionPosts: postId },
  });

  if (wasSaved) {
    post.savesCount = Math.max(0, (post.savesCount ?? 0) - 1);
    await post.save();
  }

  res.json({
    message: "Post removed from saved",
    saved: false,
    isBookmarked: false,
    savesCount: post.savesCount ?? 0,
  });
};

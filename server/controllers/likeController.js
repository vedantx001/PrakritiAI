import Blog from "../models/Blog.js";
import BlogLike from "../models/Like.js";
import ArticleTopic from "../models/ArticleTopic.js";
import ArticleLike from "../models/ArticleLike.js";
import DiscussionPost from "../models/DiscussionPost.js";
import DiscussionLike from "../models/DiscussionLike.js";

export const likeBlog = async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const existing = await BlogLike.findOne({
    blog: blogId,
    user: req.user._id,
  });

  if (existing) {
    return res.status(200).json({ message: "Blog already liked" });
  }

  await BlogLike.create({ blog: blogId, user: req.user._id });

  blog.likesCount += 1;
  await blog.save();

  res.status(201).json({ message: "Blog liked" });
};

export const unlikeBlog = async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const removed = await BlogLike.findOneAndDelete({
    blog: blogId,
    user: req.user._id,
  });

  if (removed) {
    blog.likesCount = Math.max(0, blog.likesCount - 1);
    await blog.save();
  }

  res.json({ message: "Blog unliked" });
};

export const likeArticleTopic = async (req, res) => {
  const { topicId } = req.params;

  const topic = await ArticleTopic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const existing = await ArticleLike.findOne({
    topic: topicId,
    user: req.user._id,
  });

  if (existing) {
    return res.status(200).json({
      message: "Topic already liked",
      liked: true,
      likesCount: topic.likesCount ?? 0,
    });
  }

  await ArticleLike.create({ topic: topicId, user: req.user._id });

  topic.likesCount = (topic.likesCount ?? 0) + 1;
  await topic.save();

  res.status(201).json({
    message: "Topic liked",
    liked: true,
    likesCount: topic.likesCount ?? 0,
  });
};

export const unlikeArticleTopic = async (req, res) => {
  const { topicId } = req.params;

  const topic = await ArticleTopic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const removed = await ArticleLike.findOneAndDelete({
    topic: topicId,
    user: req.user._id,
  });

  if (removed) {
    topic.likesCount = Math.max(0, (topic.likesCount ?? 0) - 1);
    await topic.save();
  }

  res.json({
    message: "Topic unliked",
    liked: false,
    likesCount: topic.likesCount ?? 0,
  });
};

export const likeDiscussionPost = async (req, res) => {
  const { postId } = req.params;

  const post = await DiscussionPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const existing = await DiscussionLike.findOne({
    post: postId,
    user: req.user._id,
  });

  if (existing) {
    return res.status(200).json({
      message: "Post already liked",
      liked: true,
      reactions: post.reactions ?? 0,
      likesCount: post.reactions ?? 0,
    });
  }

  await DiscussionLike.create({ post: postId, user: req.user._id });

  post.reactions = (post.reactions ?? 0) + 1;
  await post.save();

  res.status(201).json({
    message: "Post liked",
    liked: true,
    reactions: post.reactions ?? 0,
    likesCount: post.reactions ?? 0,
  });
};

export const unlikeDiscussionPost = async (req, res) => {
  const { postId } = req.params;

  const post = await DiscussionPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const removed = await DiscussionLike.findOneAndDelete({
    post: postId,
    user: req.user._id,
  });

  if (removed) {
    post.reactions = Math.max(0, (post.reactions ?? 0) - 1);
    await post.save();
  }

  res.json({
    message: "Post unliked",
    liked: false,
    reactions: post.reactions ?? 0,
    likesCount: post.reactions ?? 0,
  });
};

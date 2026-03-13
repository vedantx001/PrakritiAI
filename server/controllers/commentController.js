import Blog from "../models/Blog.js";
import BlogComment from "../models/Comment.js";
import ArticleTopic from "../models/ArticleTopic.js";
import ArticleComment from "../models/ArticleComment.js";
import DiscussionPost from "../models/DiscussionPost.js";
import DiscussionComment from "../models/DiscussionComment.js";

export const getComments = async (req, res) => {
  const { blogId } = req.params;

  const comments = await BlogComment.find({ blog: blogId })
    .populate("user", "name")
    .sort({ createdAt: 1 });

  res.json(comments);
};

export const addComment = async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const blog = await Blog.findById(blogId);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const comment = await BlogComment.create({
    blog: blogId,
    user: req.user._id,
    content,
  });

  blog.commentsCount += 1;
  await blog.save();

  res.status(201).json({ message: "Comment added", comment });
};

export const deleteComment = async (req, res) => {
  const { blogId, commentId } = req.params;

  const comment = await BlogComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  const isOwner = comment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not allowed to delete this comment" });
  }

  await comment.deleteOne();

  const blog = await Blog.findById(blogId);
  if (blog) {
    blog.commentsCount = Math.max(0, blog.commentsCount - 1);
    await blog.save();
  }

  res.json({ message: "Comment deleted" });
};

export const getArticleComments = async (req, res) => {
  const { topicId } = req.params;

  const comments = await ArticleComment.find({ topic: topicId })
    .populate("user", "name")
    .sort({ createdAt: 1 });

  res.json(comments);
};

export const addArticleComment = async (req, res) => {
  const { topicId } = req.params;
  const { content, parentId } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const topic = await ArticleTopic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  let parent = null;
  if (parentId) {
    const parentComment = await ArticleComment.findById(parentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }
    if (parentComment.topic.toString() !== topicId.toString()) {
      return res.status(400).json({ message: "Parent comment topic mismatch" });
    }
    parent = parentComment._id;
  }

  const comment = await ArticleComment.create({
    topic: topicId,
    parent,
    user: req.user._id,
    content,
  });

  topic.commentsCount += 1;
  await topic.save();

  const populated = await ArticleComment.findById(comment._id).populate("user", "name");
  res.status(201).json({ message: "Comment added", comment: populated });
};

export const voteArticleComment = async (req, res) => {
  const { topicId, commentId } = req.params;
  const { direction } = req.body;

  if (direction !== "up" && direction !== "down") {
    return res.status(400).json({ message: "direction must be 'up' or 'down'" });
  }

  const comment = await ArticleComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.topic.toString() !== topicId.toString()) {
    return res.status(400).json({ message: "Comment topic mismatch" });
  }

  const userId = req.user._id;

  const hasUpvoted = (comment.upvoters || []).some((id) => id.toString() === userId.toString());
  const hasDownvoted = (comment.downvoters || []).some((id) => id.toString() === userId.toString());

  if (direction === "up") {
    if (!hasUpvoted) {
      comment.upvoters = [...(comment.upvoters || []), userId];
      comment.upvotes = (comment.upvotes || 0) + 1;
    }
    if (hasDownvoted) {
      comment.downvoters = (comment.downvoters || []).filter((id) => id.toString() !== userId.toString());
      comment.downvotes = Math.max(0, (comment.downvotes || 0) - 1);
    }
  }

  if (direction === "down") {
    if (!hasDownvoted) {
      comment.downvoters = [...(comment.downvoters || []), userId];
      comment.downvotes = (comment.downvotes || 0) + 1;
    }
    if (hasUpvoted) {
      comment.upvoters = (comment.upvoters || []).filter((id) => id.toString() !== userId.toString());
      comment.upvotes = Math.max(0, (comment.upvotes || 0) - 1);
    }
  }

  await comment.save();

  const populated = await ArticleComment.findById(comment._id).populate("user", "name");
  res.json({ message: "Vote recorded", comment: populated });
};

export const updateArticleComment = async (req, res) => {
  const { topicId, commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const comment = await ArticleComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.topic.toString() !== topicId.toString()) {
    return res.status(400).json({ message: "Comment topic mismatch" });
  }

  const isOwner = comment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not allowed to edit this comment" });
  }

  comment.content = content;
  await comment.save();

  const populated = await ArticleComment.findById(comment._id).populate("user", "name");
  res.json({ message: "Comment updated", comment: populated });
};

export const deleteArticleComment = async (req, res) => {
  const { topicId, commentId } = req.params;

  const comment = await ArticleComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  const isOwner = comment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not allowed to delete this comment" });
  }

  // Cascade delete: remove the comment and its replies (up to 2 levels).
  const directReplies = await ArticleComment.find({ parent: commentId }, { _id: 1 });
  const directReplyIds = directReplies.map((r) => r._id);

  const deleteFilter = {
    $or: [{ _id: commentId }, { parent: commentId }, { parent: { $in: directReplyIds } }],
  };

  const deleteResult = await ArticleComment.deleteMany(deleteFilter);
  const deletedCount = deleteResult?.deletedCount || 1;

  const topic = await ArticleTopic.findById(topicId);
  if (topic) {
    topic.commentsCount = Math.max(0, topic.commentsCount - deletedCount);
    await topic.save();
  }

  res.json({ message: "Comment deleted" });
};

export const getDiscussionComments = async (req, res) => {
  const { postId } = req.params;

  const comments = await DiscussionComment.find({ post: postId })
    .populate("user", "name")
    .sort({ createdAt: 1 });

  res.json(comments);
};

export const addDiscussionComment = async (req, res) => {
  const { postId } = req.params;
  const { content, parentId } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const post = await DiscussionPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  let parent = null;
  if (parentId) {
    const parentComment = await DiscussionComment.findById(parentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }
    if (parentComment.post.toString() !== postId.toString()) {
      return res.status(400).json({ message: "Parent comment post mismatch" });
    }
    parent = parentComment._id;
  }

  const comment = await DiscussionComment.create({
    post: postId,
    parent,
    user: req.user._id,
    content,
  });

  post.comments = (post.comments ?? 0) + 1;
  await post.save();

  const populated = await DiscussionComment.findById(comment._id).populate(
    "user",
    "name"
  );
  res.status(201).json({ message: "Comment added", comment: populated });
};

export const voteDiscussionComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { direction } = req.body;

  if (direction !== "up" && direction !== "down") {
    return res.status(400).json({ message: "direction must be 'up' or 'down'" });
  }

  const comment = await DiscussionComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.post.toString() !== postId.toString()) {
    return res.status(400).json({ message: "Comment post mismatch" });
  }

  const userId = req.user._id;

  const hasUpvoted = (comment.upvoters || []).some(
    (id) => id.toString() === userId.toString()
  );
  const hasDownvoted = (comment.downvoters || []).some(
    (id) => id.toString() === userId.toString()
  );

  if (direction === "up") {
    if (!hasUpvoted) {
      comment.upvoters = [...(comment.upvoters || []), userId];
      comment.upvotes = (comment.upvotes || 0) + 1;
    }
    if (hasDownvoted) {
      comment.downvoters = (comment.downvoters || []).filter(
        (id) => id.toString() !== userId.toString()
      );
      comment.downvotes = Math.max(0, (comment.downvotes || 0) - 1);
    }
  }

  if (direction === "down") {
    if (!hasDownvoted) {
      comment.downvoters = [...(comment.downvoters || []), userId];
      comment.downvotes = (comment.downvotes || 0) + 1;
    }
    if (hasUpvoted) {
      comment.upvoters = (comment.upvoters || []).filter(
        (id) => id.toString() !== userId.toString()
      );
      comment.upvotes = Math.max(0, (comment.upvotes || 0) - 1);
    }
  }

  await comment.save();

  const populated = await DiscussionComment.findById(comment._id).populate(
    "user",
    "name"
  );
  res.json({ message: "Vote recorded", comment: populated });
};

export const updateDiscussionComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const comment = await DiscussionComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.post.toString() !== postId.toString()) {
    return res.status(400).json({ message: "Comment post mismatch" });
  }

  const isOwner = comment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not allowed to edit this comment" });
  }

  comment.content = content;
  await comment.save();

  const populated = await DiscussionComment.findById(comment._id).populate(
    "user",
    "name"
  );
  res.json({ message: "Comment updated", comment: populated });
};

export const deleteDiscussionComment = async (req, res) => {
  const { postId, commentId } = req.params;

  const comment = await DiscussionComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.post.toString() !== postId.toString()) {
    return res.status(400).json({ message: "Comment post mismatch" });
  }

  const isOwner = comment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not allowed to delete this comment" });
  }

  const directReplies = await DiscussionComment.find(
    { parent: commentId },
    { _id: 1 }
  );
  const directReplyIds = directReplies.map((r) => r._id);

  const deleteFilter = {
    $or: [{ _id: commentId }, { parent: commentId }, { parent: { $in: directReplyIds } }],
  };

  const deleteResult = await DiscussionComment.deleteMany(deleteFilter);
  const deletedCount = deleteResult?.deletedCount || 1;

  const post = await DiscussionPost.findById(postId);
  if (post) {
    post.comments = Math.max(0, (post.comments ?? 0) - deletedCount);
    await post.save();
  }

  res.json({ message: "Comment deleted" });
};

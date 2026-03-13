import Contribution from "../models/Contribution.js";
import ArticleTopic from "../models/ArticleTopic.js";
import ArticleChapter from "../models/ArticleChapter.js";
import { generateSlug } from "../utils/articleSlug.js";
import { sanitizeArticleHtml } from "../utils/sanitizeArticleHtml.js";

/**
 * USER: Submit contribution
 */
export const submitContribution = async (req, res) => {
  const { contributionType, chapterId, topicId, title, content, tags } =
    req.body;

  if (!contributionType || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["new_topic", "existing_topic"].includes(contributionType)) {
    return res.status(400).json({ message: "Invalid contribution type" });
  }

  let chapter = null;
  let topic = null;

  if (contributionType === "new_topic") {
    if (!title || !chapterId) {
      return res.status(400).json({ message: "Title and chapter are required" });
    }

    chapter = await ArticleChapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
  }

  if (contributionType === "existing_topic") {
    if (!topicId) {
      return res.status(400).json({ message: "Topic is required" });
    }

    topic = await ArticleTopic.findById(topicId);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
  }

  const contribution = await Contribution.create({
    contributor: req.user._id,
    contributionType,
    chapter: chapter ? chapter._id : null,
    topic: topic ? topic._id : null,
    proposedTitle: title,
    proposedContent: sanitizeArticleHtml(content),
    tags,
  });

  res.status(201).json({
    message: "Contribution submitted for review",
    contribution,
  });
};

/**
 * USER: View own contributions
 */
export const myContributions = async (req, res) => {
  const contributions = await Contribution.find({
    contributor: req.user._id,
  })
    .populate({
      path: "chapter",
      select: "title slug series",
      populate: { path: "series", select: "title slug" },
    })
    .populate({
      path: "topic",
      select: "title slug chapter",
      populate: {
        path: "chapter",
        select: "title slug series",
        populate: { path: "series", select: "title slug" },
      },
    })
    .populate("createdTopic", "title slug")
    .populate("appliedTopic", "title slug")
    .sort({ createdAt: -1 });

  res.json(contributions);
};

/**
 * ADMIN: View all pending contributions
 */
export const getPendingContributions = async (req, res) => {
  const contributions = await Contribution.find({ status: "pending" })
    .populate("contributor", "name email")
    .populate({
      path: "chapter",
      select: "title slug series",
      populate: { path: "series", select: "title slug" },
    })
    .populate({
      path: "topic",
      select: "title slug content chapter",
      populate: {
        path: "chapter",
        select: "title slug series",
        populate: { path: "series", select: "title slug" },
      },
    })
    .sort({ createdAt: -1 });

  res.json(contributions);
};

/**
 * ADMIN: View contributions (optional status filter)
 */
export const getAllContributions = async (req, res) => {
  const { status } = req.query;
  const query = {};

  if (status) {
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }
    query.status = status;
  }

  const contributions = await Contribution.find(query)
    .populate("contributor", "name email")
    .populate("chapter", "title slug")
    .populate("topic", "title slug")
    .populate("createdTopic", "title slug")
    .populate("appliedTopic", "title slug")
    .sort({ createdAt: -1 });

  res.json(contributions);
};

/**
 * ADMIN: Approve contribution
 */
export const approveContribution = async (req, res) => {
  const contribution = await Contribution.findById(req.params.id).populate(
    "contributor",
    "name"
  );

  if (!contribution)
    return res.status(404).json({ message: "Contribution not found" });

  if (contribution.status !== "pending") {
    return res.status(400).json({ message: "Contribution already reviewed" });
  }

  contribution.status = "approved";
  contribution.reviewedBy = req.user._id;

  let topicId = null;

  if (contribution.contributionType === "new_topic") {
    const topic = await ArticleTopic.create({
      title: contribution.proposedTitle,
      slug: generateSlug(contribution.proposedTitle),
      chapter: contribution.chapter,
      content: sanitizeArticleHtml(contribution.proposedContent),
      tags: contribution.tags,
      contributor: contribution.contributor._id,
      contributors: [contribution.contributor._id],
      editedBy: req.user._id,
      status: "published",
    });

    contribution.createdTopic = topic._id;
    topicId = topic._id;
  }

  if (contribution.contributionType === "existing_topic") {
    const topic = await ArticleTopic.findById(contribution.topic);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    topic.content = sanitizeArticleHtml(contribution.proposedContent);
    if (contribution.tags && contribution.tags.length > 0) {
      topic.tags = contribution.tags;
    }

    topic.editedBy = req.user._id;
    if (!topic.contributor) {
      topic.contributor = contribution.contributor._id;
    }
    if (!topic.contributors) {
      topic.contributors = [];
    }

    if (!topic.contributors.find((id) => id.equals(contribution.contributor._id))) {
      topic.contributors.push(contribution.contributor._id);
    }

    await topic.save();
    contribution.appliedTopic = topic._id;
    topicId = topic._id;
  }

  await contribution.save();

  res.json({ message: "Contribution approved", topicId });
};

/**
 * ADMIN: Reject contribution
 */
export const rejectContribution = async (req, res) => {
  const { feedback } = req.body;

  const contribution = await Contribution.findById(req.params.id);

  if (!contribution)
    return res.status(404).json({ message: "Contribution not found" });

  contribution.status = "rejected";
  contribution.adminFeedback = feedback || "Not suitable at this time";
  contribution.reviewedBy = req.user._id;

  await contribution.save();

  res.json({ message: "Contribution rejected" });
};
    
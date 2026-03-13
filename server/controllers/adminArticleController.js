import ArticleTopic from "../models/ArticleTopic.js";
import ArticleChapter from "../models/ArticleChapter.js";
import ArticleSeries from "../models/ArticleSeries.js";
import { generateSlug } from "../utils/articleSlug.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sanitizeArticleHtml } from "../utils/sanitizeArticleHtml.js";

export const createSeries = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;

  const slug = generateSlug(title);

  const series = await ArticleSeries.create({
    title,
    description,
    slug,
    order,
  });

  res.status(201).json(series);
});

export const createChapter = asyncHandler(async (req, res) => {
  const { title, seriesId, order } = req.body;

  const slug = generateSlug(title);

  const chapter = await ArticleChapter.create({
    title,
    slug,
    series: seriesId,
    order,
  });

  res.status(201).json(chapter);
});

export const createTopic = asyncHandler(async (req, res) => {
  const { title, chapterId, content, tags, contributor } = req.body;

  const slug = generateSlug(title);
  const contributors = contributor ? [contributor] : [];

  const topic = await ArticleTopic.create({
    title,
    slug,
    chapter: chapterId,
    content: sanitizeArticleHtml(content),
    tags,
    contributor,
    contributors,
    editedBy: req.user._id,
  });

  res.status(201).json(topic);
});

export const updateSeries = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, order, published } = req.body;

  const series = await ArticleSeries.findById(id);

  if (!series) {
    return res.status(404).json({ message: "Series not found" });
  }

  if (title) {
    series.title = title;
    series.slug = generateSlug(title);
  }

  if (description !== undefined) {
    series.description = description;
  }

  if (order !== undefined) {
    series.order = order;
  }

  if (published !== undefined) {
    series.published = published;
  }

  await series.save();

  res.json(series);
});

export const updateChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, seriesId, order, published } = req.body;

  const chapter = await ArticleChapter.findById(id);

  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  if (title) {
    chapter.title = title;
    chapter.slug = generateSlug(title);
  }

  if (seriesId) {
    chapter.series = seriesId;
  }

  if (order !== undefined) {
    chapter.order = order;
  }

  if (published !== undefined) {
    chapter.published = published;
  }

  await chapter.save();

  res.json(chapter);
});

export const updateTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, chapterId, content, tags } = req.body;

  const topic = await ArticleTopic.findById(id);

  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }

  if (title) {
    topic.title = title;
    topic.slug = generateSlug(title);
  }

  if (chapterId) {
    topic.chapter = chapterId;
  }

  if (content !== undefined) {
    topic.content = sanitizeArticleHtml(content);
  }

  if (tags !== undefined) {
    topic.tags = tags;
  }

  topic.editedBy = req.user._id;

  await topic.save();

  res.json(topic);
});

export const publishTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const topic = await ArticleTopic.findById(id);

  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }

  topic.status = "published";
  topic.editedBy = req.user._id;

  await topic.save();

  res.json(topic);
});

export const deleteSeries = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const series = await ArticleSeries.findById(id);

  if (!series) {
    return res.status(404).json({ message: "Series not found" });
  }

  const chapters = await ArticleChapter.find({ series: id }).select("_id");
  const chapterIds = chapters.map((chapter) => chapter._id);

  if (chapterIds.length > 0) {
    await ArticleTopic.deleteMany({ chapter: { $in: chapterIds } });
    await ArticleChapter.deleteMany({ series: id });
  }

  await series.deleteOne();

  res.json({ message: "Series deleted" });
});

export const deleteChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const chapter = await ArticleChapter.findById(id);

  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  await ArticleTopic.deleteMany({ chapter: id });
  await chapter.deleteOne();

  res.json({ message: "Chapter deleted" });
});

export const deleteTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const topic = await ArticleTopic.findById(id);

  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }

  await topic.deleteOne();

  res.json({ message: "Topic deleted" });
});
import SymptomReport from "../models/SymptomReport.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import ArticleTopic from "../models/ArticleTopic.js";
import DiscussionPost from "../models/DiscussionPost.js";

const isMeaningfulSymptomsText = (text) => {
  if (!text || typeof text !== "string") return false;
  const s = text.trim();
  if (s.length < 3) return false;

  const letters = (s.match(/[a-z]/gi) || []).length;
  if (letters === 0) return false;

  // Reject obvious keyboard-mash / repeating characters.
  if (/(.)\1{3,}/i.test(s)) return false;

  // If it's a single long token, require some vowel presence.
  const hasSpace = /\s/.test(s);
  if (!hasSpace && s.length > 10) {
    const vowels = (s.match(/[aeiou]/gi) || []).length;
    const vowelRatio = vowels / Math.max(1, letters);
    if (vowelRatio < 0.2) return false;
  }

  return true;
};

const extractMainSymptom = (text) => {
  if (!text || typeof text !== "string") return "";

  // Keep the first clause, then strip common context fragments.
  const firstClause = text.split(/[;,|/]+/)[0]?.trim() || "";
  if (!firstClause) return "";

  // Split on context connectors (case-insensitive). Intentionally do NOT split on "in/on"
  // because body location can be part of the symptom (e.g., "pain in chest").
  const connector = /\b(with|and|after|before|during|when|while|for|since|because|due to|at)\b/i;
  const match = firstClause.match(connector);
  const base = (match ? firstClause.slice(0, match.index) : firstClause).trim();

  const cleaned = base.replace(/^(a|an|the)\s+/i, "").replace(/\s{2,}/g, " ").trim();
  if (!cleaned) return "";

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

/**
 * GET: AI analysis history
 */
export const getAIHistory = async (req, res) => {
  const reports = await SymptomReport.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  const filtered = (Array.isArray(reports) ? reports : []).filter((r) =>
    isMeaningfulSymptomsText(r?.symptoms)
  );

  res.json(filtered);
};

/**
 * GET: Saved remedies
 */
export const getSavedRemedies = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("savedRemedies");

  res.json(user.savedRemedies || []);
};

/**
 * GET: Saved blogs
 */
export const getSavedBlogs = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("savedBlogs");

  res.json(user.savedBlogs || []);
};

/**
 * GET: Health summary
 */
export const getHealthSummary = async (req, res) => {
  const reports = await SymptomReport.find({ user: req.user._id })
    .select("symptoms dosha createdAt")
    .sort({ createdAt: -1 });

  const meaningfulReports = (Array.isArray(reports) ? reports : []).filter((r) =>
    isMeaningfulSymptomsText(r?.symptoms)
  );

  const doshaCount = {};
  const symptomCounts = new Map();

  for (const report of meaningfulReports) {
    doshaCount[report.dosha] = (doshaCount[report.dosha] || 0) + 1;

    const rawSymptom = typeof report.symptoms === "string" ? report.symptoms.trim() : "";
    const mainSymptom = extractMainSymptom(rawSymptom);
    if (!mainSymptom) continue;

    const key = mainSymptom.toLowerCase();
    const existing = symptomCounts.get(key) || { count: 0, label: mainSymptom };
    symptomCounts.set(key, { count: existing.count + 1, label: existing.label });
  }

  let mostCommonSymptom = null;
  let maxCount = 0;
  for (const entry of symptomCounts.values()) {
    if (entry.count > maxCount) {
      maxCount = entry.count;
      mostCommonSymptom = entry.label;
    }
  }

  res.json({
    totalAnalyses: meaningfulReports.length,
    doshaTrend: doshaCount,
    lastAnalysis: meaningfulReports.length > 0 ? meaningfulReports[0].createdAt : null,
    mostCommonSymptom,
  });
};

/**
 * GET: Saved library (articles + discussion posts)
 */
export const getSavedLibrary = async (req, res) => {
  // Ensure refs are registered for nested populate.
  // (Imported models are not used directly but are required by Mongoose.)
  void ArticleTopic;
  void DiscussionPost;

  const user = await User.findById(req.user._id)
    .select("savedArticles savedDiscussionPosts")
    .populate({
      path: "savedArticles",
      select: "title slug chapter createdAt updatedAt",
      populate: {
        path: "chapter",
        select: "slug series",
        populate: {
          path: "series",
          select: "slug",
        },
      },
    })
    .populate({
      path: "savedDiscussionPosts",
      select: "title createdAt updatedAt author",
      populate: {
        path: "author",
        select: "name role",
      },
    });

  const articles = (user?.savedArticles || [])
    .map((topic) => ({
      id: topic?._id,
      title: topic?.title,
      topicSlug: topic?.slug,
      chapterSlug: topic?.chapter?.slug || null,
      seriesSlug: topic?.chapter?.series?.slug || null,
      updatedAt: topic?.updatedAt || topic?.createdAt || null,
    }))
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  const discussionPosts = (user?.savedDiscussionPosts || [])
    .map((post) => ({
      id: post?._id,
      title: post?.title,
      author: post?.author
        ? { id: post.author._id, name: post.author.name, role: post.author.role }
        : null,
      updatedAt: post?.updatedAt || post?.createdAt || null,
    }))
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  res.json({
    articles,
    discussionPosts,
  });
};

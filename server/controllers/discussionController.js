import DiscussionPost from "../models/DiscussionPost.js";
import DiscussionLike from "../models/DiscussionLike.js";
import DiscussionComment from "../models/DiscussionComment.js";
import User from "../models/User.js";

const roleToDisplayRole = (role) => {
  if (role === "admin") return "Vaidya";
  if (role === "moderator") return "Practitioner";
  return "Member";
};

const avatarForUserId = (userId) => `https://i.pravatar.cc/150?u=${userId}`;

const formatRelativeTime = (date) => {
  const then = new Date(date).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const toClientPost = (post, viewerUserId, viewerState = {}) => {
  const author = post.author;
  const authorId = author?._id?.toString?.() || author?.id?.toString?.();
  const viewerId = viewerUserId?.toString?.();

  const postId = post._id?.toString?.();
  const likedPosts = viewerState?.likedPosts;
  const savedPosts = viewerState?.savedPosts;
  const isLiked = Boolean(postId && likedPosts?.has?.(postId));
  const isBookmarked = Boolean(postId && savedPosts?.has?.(postId));

  return {
    id: post._id,
    author: {
      id: authorId,
      name: author?.name,
      avatar: avatarForUserId(authorId || post._id),
      role: roleToDisplayRole(author?.role),
    },
    title: post.title,
    preview: post.content,
    tags: Array.isArray(post.tags) && post.tags.length ? post.tags : ["General"],
    timestamp: formatRelativeTime(post.createdAt),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    reactions: post.reactions || 0,
    savesCount: post.savesCount || 0,
    comments: post.comments || 0,
    isLiked,
    isBookmarked,
    isOwner: Boolean(viewerId && authorId && viewerId === authorId),
  };
};

export const listDiscussionPosts = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const [total, posts] = await Promise.all([
    DiscussionPost.countDocuments({}),
    DiscussionPost.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name role"),
  ]);

  const viewerId = req.user?._id;

  let viewerState = {};
  if (viewerId) {
    const postIds = posts.map((p) => p._id);

    const [user, likedRows] = await Promise.all([
      User.findById(viewerId).select("savedDiscussionPosts"),
      DiscussionLike.find({ user: viewerId, post: { $in: postIds } }).select(
        "post"
      ),
    ]);

    const savedPosts = new Set(
      (user?.savedDiscussionPosts || []).map((id) => id.toString())
    );
    const likedPosts = new Set((likedRows || []).map((row) => row.post.toString()));

    viewerState = { savedPosts, likedPosts };
  }

  res.json({
    page,
    limit,
    total,
    hasMore: skip + posts.length < total,
    posts: posts.map((p) => toClientPost(p, viewerId, viewerState)),
  });
};

export const getDiscussionPostById = async (req, res) => {
  const { postId } = req.params;

  const post = await DiscussionPost.findById(postId).populate(
    "author",
    "name role"
  );

  if (!post) return res.status(404).json({ message: "Post not found" });

  const viewerId = req.user?._id;
  let viewerState = {};

  if (viewerId) {
    const [liked, saved] = await Promise.all([
      DiscussionLike.exists({ post: postId, user: viewerId }),
      User.exists({ _id: viewerId, savedDiscussionPosts: postId }),
    ]);

    viewerState = {
      likedPosts: new Set(liked ? [post._id.toString()] : []),
      savedPosts: new Set(saved ? [post._id.toString()] : []),
    };
  }

  res.json({ post: toClientPost(post, viewerId, viewerState) });
};

export const getDiscussionPostEngagement = async (req, res) => {
  const { postId } = req.params;

  const post = await DiscussionPost.findById(postId).select(
    "reactions savesCount"
  );

  if (!post) return res.status(404).json({ message: "Post not found" });

  const reactions = post.reactions ?? 0;
  const likesCount = reactions;
  const savesCount = post.savesCount ?? 0;

  if (!req.user?._id) {
    return res.json({ likesCount, reactions, savesCount, liked: false, saved: false });
  }

  const [liked, saved] = await Promise.all([
    DiscussionLike.exists({ post: postId, user: req.user._id }),
    User.exists({ _id: req.user._id, savedDiscussionPosts: postId }),
  ]);

  res.json({
    likesCount,
    reactions,
    savesCount,
    liked: Boolean(liked),
    saved: Boolean(saved),
  });
};

const dayNumberUtc = (date = new Date()) => {
  const now = date;
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000
  );
};

const hashString = (value) => {
  // deterministic, fast, non-crypto hash for ordering
  let hash = 5381;
  const str = String(value || "");
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
};

export const getTrendingDiscussionTags = async (req, res) => {
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 7));

  const rows = await DiscussionPost.aggregate([
    { $unwind: "$tags" },
    {
      $match: {
        tags: { $type: "string", $ne: "" },
      },
    },
    {
      $group: {
        _id: "$tags",
        score: { $sum: { $ifNull: ["$reactions", 0] } },
        posts: { $sum: 1 },
      },
    },
    { $sort: { score: -1, posts: -1, _id: 1 } },
    { $limit: limit },
  ]);

  res.json({
    tags: rows.map((r) => ({
      tag: r._id,
      score: r.score ?? 0,
      posts: r.posts ?? 0,
    })),
  });
};

export const getDiscoverDiscussionTags = async (req, res) => {
  const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 10));
  const day = dayNumberUtc();

  const rows = await DiscussionPost.aggregate([
    { $unwind: "$tags" },
    {
      $match: {
        tags: { $type: "string", $ne: "" },
      },
    },
    { $group: { _id: "$tags" } },
  ]);

  const tags = rows
    .map((r) => r._id)
    .filter(Boolean)
    .map((t) => String(t).trim())
    .filter(Boolean);

  tags.sort((a, b) => {
    const ha = hashString(`${day}:${a.toLowerCase()}`);
    const hb = hashString(`${day}:${b.toLowerCase()}`);
    if (ha !== hb) return ha - hb;
    return a.localeCompare(b);
  });

  res.json({
    day,
    tags: tags.slice(0, limit),
  });
};

export const getTopDiscussionContributors = async (req, res) => {
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 3));

  const [postRows, commentRows] = await Promise.all([
    DiscussionPost.aggregate([
      {
        $group: {
          _id: "$author",
          posts: { $sum: 1 },
          reactions: { $sum: { $ifNull: ["$reactions", 0] } },
        },
      },
    ]),
    DiscussionComment.aggregate([
      {
        $group: {
          _id: "$user",
          comments: { $sum: 1 },
          upvotes: { $sum: { $ifNull: ["$upvotes", 0] } },
          downvotes: { $sum: { $ifNull: ["$downvotes", 0] } },
        },
      },
    ]),
  ]);

  const byUserId = new Map();

  for (const row of postRows || []) {
    const userId = row?._id?.toString?.();
    if (!userId) continue;
    byUserId.set(userId, {
      userId,
      posts: row?.posts ?? 0,
      reactions: row?.reactions ?? 0,
      comments: 0,
      upvotes: 0,
      downvotes: 0,
    });
  }

  for (const row of commentRows || []) {
    const userId = row?._id?.toString?.();
    if (!userId) continue;
    const existing = byUserId.get(userId) || {
      userId,
      posts: 0,
      reactions: 0,
      comments: 0,
      upvotes: 0,
      downvotes: 0,
    };

    existing.comments = row?.comments ?? 0;
    existing.upvotes = row?.upvotes ?? 0;
    existing.downvotes = row?.downvotes ?? 0;
    byUserId.set(userId, existing);
  }

  const userIds = Array.from(byUserId.keys());
  if (userIds.length === 0) {
    return res.json({ contributors: [] });
  }

  const users = await User.find({ _id: { $in: userIds } }).select("name role");
  const metaById = new Map(
    (users || []).map((u) => [u._id.toString(), { name: u.name, role: u.role }])
  );

  // Simple points model (kept server-side so UI stays unchanged):
  // - reactions received on posts carry the most weight
  // - publishing posts and leaving comments adds baseline points
  // - comment upvotes add extra signal (downvotes reduce it)
  const rows = userIds
    .map((id) => {
      const meta = metaById.get(id);
      const stats = byUserId.get(id);
      const reactions = Number(stats?.reactions || 0);
      const posts = Number(stats?.posts || 0);
      const comments = Number(stats?.comments || 0);
      const upvotes = Number(stats?.upvotes || 0);
      const downvotes = Number(stats?.downvotes || 0);

      const commentScore = Math.max(0, upvotes - downvotes);
      const points = Math.round(reactions + posts * 5 + comments * 2 + commentScore);

      return {
        id,
        name: meta?.name || "Unknown",
        points,
        role: meta?.role,
      };
    })
    .filter((row) => row.role === 'user')
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ role, ...rest }) => rest);

  res.json({ contributors: rows });
};

export const createDiscussionPost = async (req, res) => {
  const title = String(req.body?.title || "").trim();
  const content = String(req.body?.content || "").trim();

  let tags = req.body?.tags;
  if (typeof tags === "string") {
    tags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(tags)) tags = [];

  if (!title) return res.status(400).json({ message: "Title is required" });
  if (!content) return res.status(400).json({ message: "Content is required" });

  const post = await DiscussionPost.create({
    author: req.user._id,
    title,
    content,
    tags,
  });

  const populated = await DiscussionPost.findById(post._id).populate(
    "author",
    "name role"
  );

  res.status(201).json({ post: toClientPost(populated, req.user._id) });
};

export const updateDiscussionPost = async (req, res) => {
  const { id } = req.params;

  const post = await DiscussionPost.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner) {
    return res.status(403).json({ message: "Not allowed to edit this post" });
  }

  const title = req.body?.title;
  const content = req.body?.content;
  let tags = req.body?.tags;

  if (typeof title !== "undefined") {
    const nextTitle = String(title).trim();
    if (!nextTitle) return res.status(400).json({ message: "Title is required" });
    post.title = nextTitle;
  }

  if (typeof content !== "undefined") {
    const nextContent = String(content).trim();
    if (!nextContent) return res.status(400).json({ message: "Content is required" });
    post.content = nextContent;
  }

  if (typeof tags !== "undefined") {
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    post.tags = Array.isArray(tags) ? tags : [];
  }

  await post.save();

  const populated = await DiscussionPost.findById(post._id).populate(
    "author",
    "name role"
  );

  res.json({ post: toClientPost(populated, req.user._id) });
};

export const deleteDiscussionPost = async (req, res) => {
  const { id } = req.params;

  const post = await DiscussionPost.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner) {
    return res.status(403).json({ message: "Not allowed to delete this post" });
  }

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};

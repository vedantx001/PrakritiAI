import Blog from "../models/Blog.js";

/**
 * CREATE blog (logged-in users)
 */
export const createBlog = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const blog = await Blog.create({
      content,
      author: req.user._id,
      status: "published",
    });

    res.status(201).json({ message: "Blog created", blog });
  } catch (err) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      return res.status(409).json({
        message: "Duplicate blog detected.",
        details: err.keyValue || undefined,
      });
    }

    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    console.error("createBlog error:", err);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

/**
 * GET all published blogs (with optional search)
 */
export const getBlogs = async (req, res) => {
  const { search } = req.query;

  const query = { status: "published" };

  if (search) {
    query.content = { $regex: search, $options: "i" };
  }

  const blogs = await Blog.find(query)
    .populate("author", "name")
    .sort({ createdAt: -1 });

  res.json(blogs);
};

/**
 * GET single blog by id
 */
export const getBlogById = async (req, res) => {
  const blog = await Blog.findOne({
    _id: req.params.id,
    status: "published",
  }).populate("author", "name");

  if (!blog)
    return res.status(404).json({ message: "Blog not found" });

  blog.views += 1;
  await blog.save();

  res.json(blog);
};

/**
 * DELETE blog (owner or admin)
 */
export const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const isOwner = blog.author && blog.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not allowed to delete this blog" });
  }

  await blog.deleteOne();
  res.json({ message: "Blog deleted" });
};

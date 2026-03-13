import Blog from "../models/Blog.js";

/**
 * ADMIN: Create blog directly
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

    res.status(201).json({
      message: "Blog published successfully",
      blog,
    });
  } catch (err) {
    // Duplicate key error
    if (err && (err.code === 11000 || err.code === 11001)) {
      return res.status(409).json({
        message: "Duplicate blog detected.",
        details: err.keyValue || undefined,
      });
    }

    // Mongoose validation errors
    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    console.error("createBlog error:", err);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

/**
 * ADMIN: Update blog
 */
export const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  Object.assign(blog, req.body);
  await blog.save();

  res.json({ message: "Blog updated", blog });
};

/**
 * ADMIN: Delete blog
 */
export const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  await blog.deleteOne();
  res.json({ message: "Blog deleted" });
};

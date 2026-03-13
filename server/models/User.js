import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
      trim: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },

    savedRemedies: [{ type: mongoose.Schema.Types.ObjectId, ref: "SymptomReport" }],
    savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "ArticleTopic" }],
    savedDiscussionPosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "DiscussionPost" },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

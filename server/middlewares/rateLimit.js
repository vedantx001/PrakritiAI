import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // per IP
  message: {
    message: "Too many AI requests. Please try again later.",
  },
});

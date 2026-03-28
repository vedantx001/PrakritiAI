import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // per IP
  message: {
    message: "Too many AI requests. Please try again later.",
  },
});

// Anonymous demo limit: 1 AI analysis per 24 hours per IP.
// Logged-in users are not restricted by this limiter.
export const anonymousDailyAiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !!req.user,
  message: {
    message: "Demo limit reached: you can analyze once a day without login. Please log in for unlimited access.",
    code: "DEMO_DAILY_LIMIT",
  },
});

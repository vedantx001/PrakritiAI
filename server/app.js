import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { createRequire } from "module";
import authRoutes from "./routes/authRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";
import articleSeriesRoutes from "./routes/articleSeriesRoutes.js";
import adminArticleRoutes from "./routes/adminArticleRoutes.js";
import articleChapterRoutes from "./routes/articleChapterRoutes.js";
import articleTopicRoutes from "./routes/articleTopicRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import saveRoutes from "./routes/saveRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import { aiLimiter } from "./middlewares/rateLimit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const clientUrl = (process.env.CLIENT_URL || "").trim().replace(/\/+$/, "");

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no Origin header).
    if (!origin) return callback(null, true);

    if (!clientUrl) return callback(null, false);

    const normalizedOrigin = String(origin).trim().replace(/\/+$/, "");
    return callback(null, normalizedOrigin === clientUrl);
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// If deployed behind a reverse proxy (Render/NGINX/etc), set TRUST_PROXY=1
// so req.ip reflects the real client IP for rate limiting.
if (process.env.TRUST_PROXY) {
  const trustValue = Number(process.env.TRUST_PROXY);
  app.set("trust proxy", Number.isFinite(trustValue) ? trustValue : true);
}

const require = createRequire(import.meta.url);
const { clean: xssClean } = require("xss-clean/lib/xss");

app.use(express.json({ limit: "1mb" }));

app.use(helmet());
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  if (req.headers) req.headers = mongoSanitize.sanitize(req.headers);
  next();
});
app.use((req, res, next) => {
  // Preserve rich-text HTML fields so we can sanitize them explicitly later.
  // (Global xss-clean will strip HTML tags otherwise.)
  const preservedHtmlFields = {};
  const htmlKeys = ["content", "proposedContent"];

  if (req.body && typeof req.body === "object") {
    for (const key of htmlKeys) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        preservedHtmlFields[key] = req.body[key];
        req.body[key] = "__HTML_FIELD__";
      }
    }

    req.body = xssClean(req.body);

    for (const [key, value] of Object.entries(preservedHtmlFields)) {
      req.body[key] = value;
    }
  }
  if (req.params) req.params = xssClean(req.params);
  if (req.headers) req.headers = xssClean(req.headers);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminBlogRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/save", saveRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/articles/series", articleSeriesRoutes);
app.use("/api/admin/articles", adminArticleRoutes);
app.use("/api/articles", articleChapterRoutes);
app.use("/api/articles", articleTopicRoutes);

import { errorHandler } from "./middlewares/errorMiddleware.js";

app.use(errorHandler);


export default app;

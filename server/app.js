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

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/+$/, "");

const isProduction = process.env.NODE_ENV === "production";

// Production should be locked down to the deployed frontend origin(s).
// Development should allow localhost so local work keeps functioning even if
// CLIENT_URL is set to a production domain.
const envOrigins = [
  ...(process.env.CLIENT_URLS
    ? process.env.CLIENT_URLS.split(",").map((entry) => normalizeOrigin(entry)).filter(Boolean)
    : []),
  ...(process.env.CLIENT_URL ? [normalizeOrigin(process.env.CLIENT_URL)] : []),
].filter(Boolean);

const devFallbackOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const allowedOrigins = isProduction
  ? envOrigins
  : Array.from(new Set([...devFallbackOrigins, ...envOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no Origin header).
    if (!origin) return callback(null, true);

    // In dev, if nothing is configured, don't block all browser traffic.
    if (!isProduction && allowedOrigins.length === 0) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);
    return callback(null, allowedOrigins.includes(normalizedOrigin));
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

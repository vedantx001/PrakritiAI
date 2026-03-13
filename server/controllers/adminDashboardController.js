import User from "../models/User.js";
import Blog from "../models/Blog.js";
import ArticleTopic from "../models/ArticleTopic.js";
import SymptomReport from "../models/SymptomReport.js";
import Contribution from "../models/Contribution.js";

const DAYS_WINDOW = 30;

const getWindowBounds = () => {
  const now = new Date();
  const ms = DAYS_WINDOW * 24 * 60 * 60 * 1000;
  const startCurrent = new Date(now.getTime() - ms);
  const startPrevious = new Date(now.getTime() - 2 * ms);
  return { now, startCurrent, startPrevious };
};

const percentChange = (current, previous) => {
  const curr = Number(current || 0);
  const prev = Number(previous || 0);
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
};

const buildTrend = ({ current, previous }) => {
  const pct = percentChange(current, previous);
  const rounded = Math.round(pct);
  return {
    percent: rounded,
    label: `${rounded >= 0 ? "+" : ""}${rounded}%`,
    up: rounded >= 0,
    windowDays: DAYS_WINDOW,
  };
};

const metricCounts = async (Model, { startCurrent, startPrevious }) => {
  const [total, current, previous] = await Promise.all([
    Model.countDocuments(),
    Model.countDocuments({ createdAt: { $gte: startCurrent } }),
    Model.countDocuments({ createdAt: { $gte: startPrevious, $lt: startCurrent } }),
  ]);

  return {
    total,
    recent: current,
    previous,
    trend: buildTrend({ current, previous }),
  };
};

export const getAdminDashboardSummary = async (req, res, next) => {
  try {
    const { startCurrent, startPrevious } = getWindowBounds();

    const [
      users,
      articles,
      blogs,
      symptomsSolved,
      pendingContributionsTotal,
      pendingContributionsRecent,
      pendingContributionsPrevious,
    ] = await Promise.all([
      metricCounts(User, { startCurrent, startPrevious }),
      metricCounts(ArticleTopic, { startCurrent, startPrevious }),
      metricCounts(Blog, { startCurrent, startPrevious }),
      metricCounts(SymptomReport, { startCurrent, startPrevious }),
      Contribution.countDocuments({ status: "pending" }),
      Contribution.countDocuments({ status: "pending", createdAt: { $gte: startCurrent } }),
      Contribution.countDocuments({
        status: "pending",
        createdAt: { $gte: startPrevious, $lt: startCurrent },
      }),
    ]);

    const pendingContributions = {
      total: pendingContributionsTotal,
      recent: pendingContributionsRecent,
      previous: pendingContributionsPrevious,
      trend: buildTrend({
        current: pendingContributionsRecent,
        previous: pendingContributionsPrevious,
      }),
    };

    res.json({
      users,
      articles,
      blogs,
      symptomsSolved,
      pendingContributions,
    });
  } catch (error) {
    next(error);
  }
};

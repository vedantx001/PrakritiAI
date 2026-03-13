import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, FileText, MessageSquare, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import { useAuth } from '../../../context/useAuth';
import { getAdminDashboardSummary } from '../../../services/adminDashboardService';

const formatCompact = (value) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
};

const AdminOverview = ({ onSelectTab }) => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (!isAuthenticated || !token) {
      setSummary(null);
      return () => {
        mounted = false;
      };
    }

    getAdminDashboardSummary({ token })
      .then((data) => {
        if (!mounted) return;
        setSummary(data && typeof data === 'object' ? data : null);
      })
      .catch(() => {
        if (!mounted) return;
        setSummary(null);
      });

    return () => {
      mounted = false;
    };
  }, [token, isAuthenticated]);

  const statsData = useMemo(() => {
    const users = summary?.users;
    const articles = summary?.articles;
    const blogs = summary?.blogs;
    const symptomsSolved = summary?.symptomsSolved;

    return [
      {
        id: 1,
        title: 'Total Users',
        value: formatCompact(users?.total ?? 0),
        icon: Users,
        trend: users?.trend?.label ?? '+0%',
        trendUp: users?.trend?.up ?? true,
      },
      {
        id: 2,
        title: 'Total Articles',
        value: formatCompact(articles?.total ?? 0),
        icon: FileText,
        trend: articles?.trend?.label ?? '+0%',
        trendUp: articles?.trend?.up ?? true,
      },
      {
        id: 3,
        title: 'Total Blogs',
        value: formatCompact(blogs?.total ?? 0),
        icon: MessageSquare,
        trend: blogs?.trend?.label ?? '+0%',
        trendUp: blogs?.trend?.up ?? true,
      },
      {
        id: 4,
        title: 'Symptoms Solved',
        value: formatCompact(symptomsSolved?.total ?? 0),
        icon: CheckCircle,
        trend: symptomsSolved?.trend?.label ?? '+0%',
        trendUp: symptomsSolved?.trend?.up ?? true,
      },
    ];
  }, [summary]);

  const pendingCount = summary?.pendingContributions?.total;
  const pendingLabel = Number.isFinite(Number(pendingCount)) ? `${pendingCount} pending articles` : '— pending articles';

  const goReviewContributions = () => {
    if (onSelectTab) onSelectTab('Contributions');
    else navigate('/dashboard/admin/contribution-handle');
  };

  const goWriteArticle = () => {
    navigate('/articles');
  };

  return (
    <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">Overview</h1>
        <p className="text-[var(--text-muted)]">Here is the latest data for your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsData.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <div
              role="button"
              tabIndex={0}
              onClick={goReviewContributions}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') goReviewContributions();
              }}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--text-brand)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-main)] text-sm">Review Contributions</h4>
                  <p className="text-xs text-[var(--text-muted)]">{pendingLabel}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={goReviewContributions}
                className="text-xs font-medium text-[var(--btn-text)] bg-[var(--btn-primary)] px-3 py-1.5 rounded-md hover:opacity-90"
              >
                Review
              </button>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={goWriteArticle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') goWriteArticle();
              }}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--text-brand)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-lg">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-main)] text-sm">Write New Article</h4>
                  <p className="text-xs text-[var(--text-muted)]">Publish to GFG section</p>
                </div>
              </div>
              <button
                type="button"
                onClick={goWriteArticle}
                className="text-xs font-medium text-[var(--btn-text)] bg-[var(--btn-primary)] px-3 py-1.5 rounded-md hover:opacity-90"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">System Status</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--text-brand)] h-full w-[85%]"></div>
            </div>
            <span className="text-sm font-bold text-[var(--text-main)]">85% Capacity</span>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Server Uptime</span>
              <span className="text-[var(--text-main)] font-medium">99.9%</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Pending Approvals</span>
              <span className="text-[var(--text-main)] font-medium">12 Items</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Active Sessions</span>
              <span className="text-[var(--text-main)] font-medium">1,240</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default AdminOverview;
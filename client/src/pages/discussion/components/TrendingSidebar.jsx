import { useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { Award, Hash, Leaf, Sun, TrendingUp } from 'lucide-react';

import wisdomData from '../../../data/wisdom.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizedBaseUrl = String(API_BASE_URL || '').trim().replace(/\/+$/, '');

const buildUrl = (path) => {
  const normalizedPath = String(path || '');
  if (!normalizedBaseUrl) return normalizedPath;
  return `${normalizedBaseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

const readJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export default function TrendingSidebar({ onSelectTag }) {
  const MotionDiv = motion.div;

  const [dayNumber, setDayNumber] = useState(() => {
    const now = new Date();
    return Math.floor(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000
    );
  });

  const [trendingTags, setTrendingTags] = useState([]);
  const [discoverTags, setDiscoverTags] = useState([]);
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1
    );
    const msUntilNext = nextMidnight.getTime() - now.getTime();
    const timeoutId = setTimeout(() => {
      const refreshed = new Date();
      setDayNumber(
        Math.floor(
          Date.UTC(
            refreshed.getFullYear(),
            refreshed.getMonth(),
            refreshed.getDate()
          ) / 86400000
        )
      );
    }, Math.max(0, msUntilNext));

    return () => clearTimeout(timeoutId);
  }, [dayNumber]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(buildUrl('/api/discussions/tags/trending?limit=7'));
        const payload = await readJsonSafely(response);
        if (!response.ok) return;
        if (cancelled) return;
        const tags = Array.isArray(payload?.tags) ? payload.tags : [];
        setTrendingTags(tags);
      } catch {
        if (!cancelled) setTrendingTags([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(buildUrl('/api/discussions/tags/discover?limit=10'));
        const payload = await readJsonSafely(response);
        if (!response.ok) return;
        if (cancelled) return;
        const tags = Array.isArray(payload?.tags) ? payload.tags : [];
        setDiscoverTags(tags);
      } catch {
        if (!cancelled) setDiscoverTags([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dayNumber]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(buildUrl('/api/discussions/contributors/top?limit=3'));
        const payload = await readJsonSafely(response);
        if (!response.ok) return;
        if (cancelled) return;
        const contributors = Array.isArray(payload?.contributors) ? payload.contributors : [];
        setTopContributors(
          contributors.map((c) => ({
            name:
              typeof c?.name === 'string' && c.name.trim()
                ? c.name
                : 'Unknown',
            points: Number.isFinite(Number(c?.points)) ? Number(c.points) : 0,
          }))
        );
      } catch {
        if (!cancelled) setTopContributors([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dailyWisdomText = useMemo(() => {
    const wisdoms = wisdomData?.wisdoms ?? [];
    if (!Array.isArray(wisdoms) || wisdoms.length === 0) return '';
    const index = ((dayNumber % wisdoms.length) + wisdoms.length) % wisdoms.length;
    return wisdoms[index]?.text ?? '';
  }, [dayNumber]);

  return (
    <aside className="sticky top-28 space-y-6">
      <MotionDiv
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-color)] shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Leaf className="w-24 h-24 text-[var(--text-brand)]" />
        </div>
        <div className="flex items-center space-x-2 mb-3 text-[var(--text-brand)] font-semibold">
          <Sun className="w-5 h-5" />
          <span>Daily Wisdom</span>
        </div>
        <p className="text-[var(--text-main)] text-sm leading-relaxed relative z-10">
          {dailyWisdomText ? `"${dailyWisdomText}"` : null}
        </p>
      </MotionDiv>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-color)] shadow-sm">
        <h3 className="flex items-center text-[var(--text-main)] font-semibold mb-4 gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--text-brand)]" />
          Trending Topics
        </h3>
        <ul className="space-y-3">
          {trendingTags.map((row) => (
            <li key={row?.tag}>
              <button
                type="button"
                onClick={() => onSelectTag?.(row?.tag)}
                className="text-[var(--text-muted)] hover:text-[var(--text-brand)] text-sm font-medium transition-colors text-left w-full truncate"
                title={row?.tag}
              >
                {row?.tag}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-color)] shadow-sm">
        <h3 className="flex items-center text-[var(--text-main)] font-semibold mb-4 gap-2">
          <Hash className="w-4 h-4 text-[var(--text-brand)]" />
          Discover
        </h3>
        <div className="flex flex-wrap gap-2">
          {discoverTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => onSelectTag?.(tag)}
              className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-main)] text-xs rounded-full font-medium hover:bg-[var(--border-color)] cursor-pointer transition-colors border border-transparent hover:border-[var(--text-muted)]"
              title={tag}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-color)] shadow-sm">
        <h3 className="flex items-center text-[var(--text-main)] font-semibold mb-4 gap-2">
          <Award className="w-4 h-4 text-[var(--text-brand)]" />
          Top Contributors
          <span className="relative inline-flex items-center group">
            <button
              type="button"
              aria-label="How points are calculated"
              className="w-4 h-4 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] text-[10px] leading-none font-semibold flex items-center justify-center"
              title="Points = reactions + 5×posts + 2×comments + max(0, upvotes − downvotes)"
            >
              ⓘ
            </button>
            <span className="pointer-events-none absolute left-0 top-full z-20 hidden group-hover:block group-focus-within:block">
              <span className="mt-2 inline-block max-w-[260px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-[11px] leading-snug text-[var(--text-muted)] shadow-sm">
                Points = reactions + 5×posts + 2×comments + max(0, upvotes − downvotes)
              </span>
            </span>
          </span>
        </h3>
        <div className="text-[var(--text-muted)] text-xs opacity-80">
          Ranked by activity score
        </div>
        <ul className="space-y-4">
          {topContributors.map((contributor, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-main)] font-bold text-xs border border-[var(--border-color)]">
                  {contributor.name.charAt(0)}
                </div>
                <span className="text-[var(--text-main)] text-sm font-medium">
                  {contributor.name}
                </span>
              </div>
              <span className="text-[var(--text-brand)] text-xs font-semibold bg-[var(--bg-secondary)] px-2 py-1 rounded-md">
                {contributor.points} pts
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

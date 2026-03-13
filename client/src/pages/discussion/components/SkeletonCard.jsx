import { motion } from 'framer-motion';

export default function SkeletonCard() {
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] mb-4"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/4 animate-pulse" />
          <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/6 animate-pulse" />
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-5 bg-[var(--bg-secondary)] rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-full animate-pulse" />
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-5/6 animate-pulse" />
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-16 bg-[var(--bg-secondary)] rounded-full animate-pulse"
          />
        ))}
      </div>
      <div className="flex space-x-6 border-t border-[var(--border-color)] pt-4">
        <div className="h-5 w-12 bg-[var(--bg-secondary)] rounded animate-pulse" />
        <div className="h-5 w-12 bg-[var(--bg-secondary)] rounded animate-pulse" />
      </div>
    </MotionDiv>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bookmark,
  Clock,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PencilLine,
  Share2,
  Trash2,
  User,
} from 'lucide-react';

function DiscussionCard({
  post,
  isOwner,
  onEdit,
  onDelete,
  onToggleLike,
  onToggleBookmark,
  onOpenComments,
  onShare,
  likeDisabled,
  bookmarkDisabled,
}) {
  const MotionArticle = motion.article;
  const MotionDiv = motion.div;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 border border-[var(--border-color)] mb-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)]"
            aria-label="User"
            title={post?.author?.name || 'User'}
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-main)] flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              {post.author.name}
            </h3>
            <div className="flex items-center text-xs text-[var(--text-muted)] mt-0.5">
              <Clock className="w-3 h-3 mr-1 inline" />
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Post actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            disabled={!isOwner}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {menuOpen && isOwner ? (
              <MotionDiv
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-40 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden z-10"
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit?.(post);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <PencilLine className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(post);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </MotionDiv>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="cursor-pointer group">
        <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-main)] mb-2 group-hover:text-[var(--text-brand)] transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
          {post.preview}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 sm:px-3 sm:py-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs sm:text-sm rounded-full font-medium hover:bg-[var(--border-color)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button
            type="button"
            disabled={Boolean(likeDisabled)}
            onClick={() => onToggleLike?.(post)}
            className="flex items-center space-x-1.5 text-[var(--text-muted)] hover:text-[var(--text-brand)] transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="p-1.5 rounded-full group-hover:bg-[var(--bg-secondary)] transition-colors">
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${post.isLiked ? 'text-[var(--text-brand)]' : ''}`}
                fill={post.isLiked ? 'currentColor' : 'none'}
              />
            </div>
            <span
              className={`text-sm font-medium ${post.isLiked ? 'text-[var(--text-brand)]' : ''}`}
            >
              {post.reactions}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenComments?.(post)}
            className="flex items-center space-x-1.5 text-[var(--text-muted)] hover:text-blue-500 transition-colors group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-[var(--bg-secondary)] transition-colors">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          <button
            type="button"
            onClick={() => onShare?.(post)}
            disabled={!onShare}
            className="flex items-center space-x-1.5 text-[var(--text-muted)] hover:text-emerald-500 transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Share"
          >
            <div className="p-1.5 rounded-full group-hover:bg-[var(--bg-secondary)] transition-colors">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </button>
        </div>

        <button
          type="button"
          disabled={Boolean(bookmarkDisabled)}
          onClick={() => onToggleBookmark?.(post)}
          className={`p-2 rounded-full transition-colors ${
            post.isBookmarked
              ? 'text-[var(--text-brand)] bg-[var(--bg-secondary)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <Bookmark
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill={post.isBookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>
    </MotionArticle>
  );
}

export default React.memo(DiscussionCard);

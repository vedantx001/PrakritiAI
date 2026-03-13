import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  CheckCircle,
  Clock,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
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
  likeDisabled,
  bookmarkDisabled,
}) {
  const MotionArticle = motion.article;
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
              {post.author.role === 'Vaidya' && (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--text-brand)]" />
              )}
            </h3>
            <div className="flex items-center text-xs text-[var(--text-muted)] mt-0.5">
              <span>{post.author.role}</span>
              <span className="mx-2">•</span>
              <Clock className="w-3 h-3 mr-1 inline" />
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
            aria-label="Post actions"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {menuOpen && isOwner && (
            <div className="absolute right-0 mt-2 w-36 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden z-10">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(post);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(post);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Delete
              </button>
            </div>
          )}
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

          <button className="flex items-center space-x-1.5 text-[var(--text-muted)] hover:text-emerald-500 transition-colors group hidden sm:flex">
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

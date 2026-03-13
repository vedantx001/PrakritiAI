import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  mode = 'create',
  initialPost = null,
}) {
  const MotionDiv = motion.div;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!initialPost) {
      setTitle('');
      setContent('');
      setTags('');
      return;
    }

    setTitle(initialPost?.title || '');
    setContent(initialPost?.preview || '');
    setTags(Array.isArray(initialPost?.tags) ? initialPost.tags.join(', ') : '');
  }, [isOpen, initialPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      await onSubmit?.({
        title: title.trim(),
        content: content.trim(),
        tags: parsedTags.length ? parsedTags : ['General'],
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
            className="relative w-full max-w-2xl bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
              <h2 className="text-xl font-bold text-[var(--text-main)]">
                {mode === 'edit' ? 'Edit Post' : 'Start a Discussion'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="create-post-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[var(--text-main)] mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    placeholder="E.g., How to balance Vata in winter?"
                    className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] transition-shadow"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-[var(--text-main)] mb-1"
                  >
                    Tags{' '}
                    <span className="text-[var(--text-muted)] font-normal">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="tags"
                    placeholder="Vata, Diet, Routine"
                    className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] transition-shadow"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-[var(--text-main)] mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    required
                    rows={6}
                    placeholder="Share your insights, questions, or experiences..."
                    className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] transition-shadow resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-[var(--text-main)] font-medium hover:bg-[var(--bg-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-post-form"
                disabled={!title.trim() || !content.trim() || submitting}
                className="px-5 py-2.5 rounded-xl bg-[var(--btn-primary)] text-[var(--btn-text)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-brand)]"
              >
                {submitting
                  ? mode === 'edit'
                    ? 'Saving...'
                    : 'Publishing...'
                  : mode === 'edit'
                    ? 'Save Changes'
                    : 'Publish Post'}
              </button>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
}

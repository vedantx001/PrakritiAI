import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import CreatePostModal from './components/CreatePostModal.jsx';
import DiscussionCard from './components/DiscussionCard.jsx';
import DiscussionCommentsModal from './components/DiscussionCommentsModal.jsx';
import SearchHeader from './components/SearchHeader.jsx';
import SkeletonCard from './components/SkeletonCard.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import TrendingSidebar from './components/TrendingSidebar.jsx';
import AuthModal from '../../components/auth/AuthModal.jsx';
import ShareModal from '../../components/articles/shared/ShareModal.jsx';
import useDebounce from './hooks/useDebounce';
import {
  createDiscussionPost,
  deleteDiscussionPost,
  fetchDiscussionPosts,
  fetchDiscussionPostById,
  likeDiscussionPost,
  saveDiscussionPost,
  unlikeDiscussionPost,
  unsaveDiscussionPost,
  updateDiscussionPost,
} from '../../services/discussionService.js';
import { useAuth } from '../../context/useAuth.js';

export default function DiscussionsPageContent() {
  const MotionDiv = motion.div;

  const location = useLocation();

  const { token, user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const [deletePostConfirm, setDeletePostConfirm] = useState({
    isOpen: false,
    post: null,
  });

  const [shareState, setShareState] = useState({
    isOpen: false,
    title: '',
    url: '',
    text: '',
    channels: [
      { id: 'copy', label: 'Copy link' },
      { id: 'whatsapp', label: 'WhatsApp' },
    ],
  });

  const resolveAbsoluteUrl = (canonicalPath) => {
    if (!canonicalPath) return '';
    if (typeof window === 'undefined') return canonicalPath;
    return `${window.location.origin}${canonicalPath}`;
  };

  const openShareForPost = (post) => {
    if (!post?.id) return;
    const canonicalPath = `/discussions?postId=${encodeURIComponent(post.id)}`;
    setShareState((previous) => ({
      ...previous,
      isOpen: true,
      title: post?.title || '',
      text: post?.title || '',
      url: resolveAbsoluteUrl(canonicalPath),
      channels: [
        { id: 'copy', label: 'Copy link' },
        { id: 'whatsapp', label: 'WhatsApp' },
      ],
    }));
  };

  const requestDeletePost = (post) => {
    if (!isAuthenticated) {
      alert('Please log in to delete a post');
      return;
    }
    if (!post?.id) return;
    setDeletePostConfirm({ isOpen: true, post });
  };

  const confirmDeletePost = async () => {
    const target = deletePostConfirm.post;
    if (!target?.id) {
      setDeletePostConfirm({ isOpen: false, post: null });
      return;
    }

    try {
      await deleteDiscussionPost(target.id, { token });
      setPosts((prev) => prev.filter((p) => p.id !== target.id));
    } catch (err) {
      alert(err?.message || 'Failed to delete post');
    } finally {
      setDeletePostConfirm({ isOpen: false, post: null });
    }
  };

  const patchPost = (postId, updater) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return typeof updater === 'function' ? updater(p) : { ...p, ...updater };
      }),
    );
  };

  const handleToggleLike = async (post) => {
    if (!post?.id) return;
    if (!token) {
      alert('Please log in to like a post');
      return;
    }

    const previous = post;
    const nextLiked = !post.isLiked;
    const delta = nextLiked ? 1 : -1;

    patchPost(post.id, (p) => ({
      ...p,
      isLiked: nextLiked,
      reactions: Math.max(0, (p.reactions ?? 0) + delta),
    }));

    try {
      const payload = nextLiked
        ? await likeDiscussionPost({ postId: post.id, token })
        : await unlikeDiscussionPost({ postId: post.id, token });

      patchPost(post.id, (p) => ({
        ...p,
        isLiked: typeof payload?.liked === 'boolean' ? payload.liked : nextLiked,
        reactions:
          typeof payload?.reactions === 'number'
            ? payload.reactions
            : typeof payload?.likesCount === 'number'
              ? payload.likesCount
              : p.reactions,
      }));
    } catch (err) {
      patchPost(post.id, previous);
      alert(err?.message || 'Failed to update like');
    }
  };

  const handleToggleBookmark = async (post) => {
    if (!post?.id) return;
    if (!token) {
      alert('Please log in to save a post');
      return;
    }

    const previous = post;
    const nextSaved = !post.isBookmarked;

    patchPost(post.id, (p) => ({
      ...p,
      isBookmarked: nextSaved,
    }));

    try {
      const payload = nextSaved
        ? await saveDiscussionPost({ postId: post.id, token })
        : await unsaveDiscussionPost({ postId: post.id, token });

      patchPost(post.id, (p) => ({
        ...p,
        isBookmarked:
          typeof payload?.isBookmarked === 'boolean'
            ? payload.isBookmarked
            : typeof payload?.saved === 'boolean'
              ? payload.saved
              : nextSaved,
      }));
    } catch (err) {
      patchPost(post.id, previous);
      alert(err?.message || 'Failed to update save');
    }
  };

  const upsertPost = (post) => {
    setPosts((prev) => {
      const index = prev.findIndex((p) => p.id === post.id);
      if (index === -1) return [post, ...prev];

      const next = [...prev];
      next[index] = post;
      return next;
    });
  };

  const debouncedSearch = useDebounce(searchTerm, 300);
  const loaderRef = useRef(null);
  const handledSharedPostRef = useRef(false);

  const sharedPostId = useMemo(() => {
    const params = new URLSearchParams(location.search || '');
    return params.get('postId') || '';
  }, [location.search]);

  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      setLoading(true);
      try {
        const payload = await fetchDiscussionPosts({ page: 1, limit: 10, token });
        if (cancelled) return;
        setPosts(Array.isArray(payload?.posts) ? payload.posts : []);
        setPage(payload?.page || 1);
        setHasMore(Boolean(payload?.hasMore));
      } catch {
        if (!cancelled) {
          setPosts([]);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!sharedPostId) return;
    if (handledSharedPostRef.current) return;
    if (loading) return;

    const existing = posts.find((p) => String(p?.id) === String(sharedPostId));
    if (existing) {
      handledSharedPostRef.current = true;
      setActiveCommentPost(existing);
      setIsCommentsOpen(true);
      return;
    }

    handledSharedPostRef.current = true;

    fetchDiscussionPostById({ postId: sharedPostId, token })
      .then((post) => {
        if (!post?.id) return;
        setPosts((prev) => {
          const already = prev.some((p) => String(p?.id) === String(post.id));
          if (already) return prev;
          return [post, ...prev];
        });
        setActiveCommentPost(post);
        setIsCommentsOpen(true);
      })
      .catch(() => {
        // ignore
      });
  }, [sharedPostId, loading, posts, token]);

  const filteredPosts = useMemo(() => {
    if (!debouncedSearch) return posts;
    const lower = debouncedSearch.toLowerCase();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lower) ||
        post.tags.some((t) => t.toLowerCase().includes(lower)) ||
        post.preview.toLowerCase().includes(lower),
    );
  }, [posts, debouncedSearch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !loadingMore &&
          !debouncedSearch &&
          hasMore
        ) {
          setLoadingMore(true);

          const nextPage = page + 1;
          fetchDiscussionPosts({ page: nextPage, limit: 10, token })
            .then((payload) => {
              const newPosts = Array.isArray(payload?.posts) ? payload.posts : [];
              setPosts((prev) => [...prev, ...newPosts]);
              setPage(payload?.page || nextPage);
              setHasMore(Boolean(payload?.hasMore));
            })
            .catch(() => {
              setHasMore(false);
            })
            .finally(() => {
              setLoadingMore(false);
            });
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, loadingMore, debouncedSearch]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenModal={() => setIsModalOpen(true)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 sm:gap-8 pb-12">
          <main className="min-w-0 w-full">
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-on-mobile sm:hidden">
              <button className="flex items-center gap-1 bg-[var(--bg-secondary)] text-[var(--text-main)] px-4 py-1.5 rounded-full text-sm font-medium border border-[var(--border-color)] whitespace-nowrap">
                <Filter className="w-3.5 h-3.5" /> All Topics
              </button>
              {['Vata', 'Pitta', 'Kapha'].map((t) => (
                <button
                  key={t}
                  className="bg-[var(--bg-card)] text-[var(--text-muted)] px-4 py-1.5 rounded-full text-sm font-medium border border-[var(--border-color)] whitespace-nowrap hover:bg-[var(--bg-secondary)]"
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <MotionDiv key="skeletons" exit={{ opacity: 0 }}>
                  {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </MotionDiv>
              ) : filteredPosts.length > 0 ? (
                <MotionDiv
                  key="feed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {filteredPosts.map((post) => (
                    <DiscussionCard
                      key={post.id}
                      post={post}
                      isOwner={Boolean(
                        post?.isOwner ||
                          (user?.id && post?.author?.id && user.id === post.author.id)
                      )}
                      onOpenComments={(selected) => {
                        if (!selected?.id) return;
                        setActiveCommentPost(selected);
                        setIsCommentsOpen(true);
                      }}
                      onEdit={() => {
                        setEditingPost(post);
                        setIsModalOpen(true);
                      }}
                      onDelete={requestDeletePost}
                      onToggleLike={handleToggleLike}
                      onToggleBookmark={handleToggleBookmark}
                      onShare={openShareForPost}
                    />
                  ))}

                  {!debouncedSearch && (
                    <div ref={loaderRef} className="py-6 flex justify-center">
                      {loadingMore && (
                        <div className="flex gap-1.5 items-center text-[var(--text-brand)]">
                          <span
                            className="w-2 h-2 rounded-full bg-current animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-current animate-bounce"
                            style={{ animationDelay: '150ms' }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-current animate-bounce"
                            style={{ animationDelay: '300ms' }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </MotionDiv>
              ) : (
                <MotionDiv
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]"
                >
                  <div className="w-16 h-16 bg-[var(--bg-secondary)] text-[var(--text-muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">
                    No discussions found
                  </h3>
                  <p className="text-[var(--text-muted)] max-w-sm mx-auto">
                    We couldn't find anything matching "{searchTerm}". Try
                    adjusting your search or start a new discussion!
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 text-[var(--text-brand)] font-medium hover:underline"
                  >
                    Create a new post
                  </button>
                </MotionDiv>
              )}
            </AnimatePresence>
          </main>

          <div className="mt-8 md:mt-0">
            <TrendingSidebar onSelectTag={(tag) => setSearchTerm(String(tag || ''))} />
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        mode={editingPost ? 'edit' : 'create'}
        initialPost={editingPost}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={async ({ title, content, tags }) => {
          if (!isAuthenticated) {
            alert('Please log in to publish a post');
            return;
          }

          try {
            if (editingPost) {
              const updated = await updateDiscussionPost(
                editingPost.id,
                { title, content, tags },
                { token },
              );
              if (updated) upsertPost(updated);
            } else {
              const created = await createDiscussionPost(
                { title, content, tags },
                { token },
              );
              if (created) upsertPost(created);
            }
            setIsModalOpen(false);
            setEditingPost(null);
          } catch (err) {
            alert(err?.message || 'Failed to publish post');
          }
        }}
      />

      <DiscussionCommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        threadKey={activeCommentPost?.id || ''}
        threadTitle={activeCommentPost?.title || ''}
        currentUser={user}
        token={token}
        onRequireAuth={() => {
          setAuthMode('login');
          setIsAuthOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={() => setIsAuthOpen(false)}
      />

      <ShareModal
        isOpen={shareState.isOpen}
        onClose={() => setShareState((previous) => ({ ...previous, isOpen: false }))}
        title={shareState.title}
        shareUrl={shareState.url}
        shareText={shareState.text}
        channels={shareState.channels}
      />

      <ConfirmDialog
        isOpen={deletePostConfirm.isOpen}
        title="Delete post?"
        message="This action can’t be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setDeletePostConfirm({ isOpen: false, post: null })}
        onConfirm={confirmDeletePost}
      />
    </div>
  );
}

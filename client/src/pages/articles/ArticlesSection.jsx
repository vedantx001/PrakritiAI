// Purpose: Full separate articles section shared by admin and user; admin can publish updates.

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ArticleLayout from '../../components/articles/ArticleLayout';
import ArticleFormShell from '../../components/articles/admin/ArticleFormShell';
import ThemeStyles from '../../components/dashboard/admin/ThemeStyles';
import ArticleTree from '../../components/articles/public/ArticleTree';
import ArticleContentSwitcher from '../../components/articles/public/ArticleContentSwitcher';
import TopicPagination from '../../components/articles/public/TopicPagination';
import ArticleCommentsModal from '../../components/articles/public/ArticleCommentsModal';
import ArticleLoadingState from '../../components/articles/shared/ArticleLoadingState';
import ArticleEmptyState from '../../components/articles/shared/ArticleEmptyState';
import ShareModal from '../../components/articles/shared/ShareModal';
import AuthModal from '../../components/auth/AuthModal';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/ThemeContext';
import {
  createChapterAdmin,
  createSeriesAdmin,
  deleteChapterAdmin,
  deleteSeriesAdmin,
  deleteTopicAdmin,
  createTopicAdmin,
  getPublishedArticleTree,
  getArticleTopicEngagement,
  likeArticleTopic,
  unlikeArticleTopic,
  saveArticleTopic,
  unsaveArticleTopic,
  publishTopicAdmin,
  submitContribution,
  updateChapterAdmin,
  updateSeriesAdmin,
  updateTopicAdmin,
  fetchTopicSharePayload,
  peekTopicSharePayloadCache,
} from '../../services/articleService';
import { getDefaultSelection } from '../../utils/articles/mapArticleTree';

const getSelectionDetails = (articleTree, selected) => {
  const series = articleTree.find((item) => item.id === selected.seriesId);
  const chapter = series?.chapters.find((item) => item.id === selected.chapterId) || series?.chapters[0];
  const topic = chapter?.topics.find((item) => item.id === selected.topicId) || chapter?.topics[0];

  return { series, chapter, topic };
};

const flattenTopics = (articleTree) =>
  articleTree.flatMap((series) =>
    series.chapters.flatMap((chapter) =>
      chapter.topics.map((topic) => ({
        ...topic,
        seriesId: series.id,
        chapterId: chapter.id,
      }))
    )
  );

const normalizeText = (value = '') => value.trim().toLowerCase();

const areSelectionsEqual = (a, b) => a?.seriesId === b?.seriesId && a?.chapterId === b?.chapterId && a?.topicId === b?.topicId;

const resolveSelectionFromIds = (articleTree, selection) => {
  const fallbackSeries = articleTree?.[0];
  const series = articleTree.find((item) => item.id === selection.seriesId) || fallbackSeries;
  const fallbackChapter = series?.chapters?.[0];
  const chapter = (series?.chapters || []).find((item) => item.id === selection.chapterId) || fallbackChapter;
  const fallbackTopic = chapter?.topics?.[0];
  const topic = (chapter?.topics || []).find((item) => item.id === selection.topicId) || fallbackTopic;

  return {
    series,
    chapter,
    topic,
    selection: {
      seriesId: series?.id || '',
      chapterId: chapter?.id || '',
      topicId: topic?.id || '',
    },
  };
};

const resolveSelectionFromSlugs = (articleTree, { seriesSlug, chapterSlug, topicSlug }) => {
  const fallbackSeries = articleTree?.[0];
  const series = articleTree.find((item) => item.slug === seriesSlug) || fallbackSeries;
  const fallbackChapter = series?.chapters?.[0];
  const chapter = (series?.chapters || []).find((item) => item.slug === chapterSlug) || fallbackChapter;
  const fallbackTopic = chapter?.topics?.[0];
  const topic = (chapter?.topics || []).find((item) => item.slug === topicSlug) || fallbackTopic;

  return {
    series,
    chapter,
    topic,
    selection: {
      seriesId: series?.id || '',
      chapterId: chapter?.id || '',
      topicId: topic?.id || '',
    },
  };
};

const buildArticlePath = ({ series, chapter, topic }) => {
  if (!series?.slug || !chapter?.slug || !topic?.slug) return null;
  return `/articles/${series.slug}/${chapter.slug}/${topic.slug}`;
};

const EMPTY_DRAFT = {
  seriesTitle: '',
  chapterTitle: '',
  topicTitle: '',
  tags: '',
  content: '',
};

export default function ArticlesSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { seriesSlug, chapterSlug, topicSlug } = useParams();
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isUserPOV = !isAdmin;

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [articleTree, setArticleTree] = useState([]);
  const [selected, setSelected] = useState({ seriesId: '', chapterId: '', topicId: '' });
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ ...EMPTY_DRAFT });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [pendingEngagementAction, setPendingEngagementAction] = useState(null);

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

  const [engagement, setEngagement] = useState({
    topicId: '',
    likesCount: 0,
    savesCount: 0,
    liked: false,
    saved: false,
    loading: false,
  });

  const engagementRef = useRef(engagement);

  useEffect(() => {
    engagementRef.current = engagement;
  }, [engagement]);

  const resolveAbsoluteUrl = (canonicalPath, absoluteUrlFromServer) => {
    if (absoluteUrlFromServer) return absoluteUrlFromServer;
    if (!canonicalPath) return '';
    if (typeof window === 'undefined') return canonicalPath;
    return `${window.location.origin}${canonicalPath}`;
  };

  const openShareForTopicSlug = async ({ topicSlug: nextTopicSlug, fallbackTitle = '', fallbackPath = '' }) => {
    if (!nextTopicSlug && !fallbackPath) return;

    const fallbackUrl = fallbackPath ? resolveAbsoluteUrl(fallbackPath, null) : '';
    const cached = nextTopicSlug ? peekTopicSharePayloadCache(nextTopicSlug) : null;

    setShareState({
      isOpen: true,
      title: cached?.topic?.title || fallbackTitle || '',
      url: resolveAbsoluteUrl(cached?.canonicalPath || fallbackPath, cached?.absoluteUrl) || fallbackUrl,
      text: cached?.topic?.title || fallbackTitle || '',
      channels: Array.isArray(cached?.channels) && cached.channels.length > 0
        ? cached.channels
        : [
            { id: 'copy', label: 'Copy link' },
            { id: 'whatsapp', label: 'WhatsApp' },
          ],
    });

    if (!nextTopicSlug) return;

    try {
      const payload = await fetchTopicSharePayload({ topicSlug: nextTopicSlug });
      const absoluteUrl = resolveAbsoluteUrl(payload?.canonicalPath || fallbackPath, payload?.absoluteUrl);
      setShareState((previous) => {
        if (!previous.isOpen) return previous;
        return {
          ...previous,
          title: payload?.topic?.title || previous.title,
          text: payload?.topic?.title || previous.text,
          url: absoluteUrl || previous.url,
          channels: Array.isArray(payload?.channels) && payload.channels.length > 0 ? payload.channels : previous.channels,
        };
      });
    } catch {
      // If share payload fails, keep fallback URL.
    }
  };

  const openShareForTopicEntity = async (topicEntity) => {
    if (!topicEntity?.id && !topicEntity?.slug) return;

    let fallbackPath = '';
    if (topicEntity?.id) {
      for (const series of articleTree) {
        for (const chapter of series.chapters || []) {
          const matching = (chapter.topics || []).find((item) => item.id === topicEntity.id);
          if (matching) {
            fallbackPath = buildArticlePath({ series, chapter, topic: matching }) || '';
            break;
          }
        }
        if (fallbackPath) break;
      }
    }

    await openShareForTopicSlug({
      topicSlug: topicEntity?.slug || '',
      fallbackTitle: topicEntity?.title || '',
      fallbackPath,
    });
  };

  // Theme is handled globally by ThemeProvider.

  const loadArticles = async (preservedSelection = null) => {
    setLoading(true);

    try {
      const tree = await getPublishedArticleTree();
      setArticleTree(tree);

      if (tree.length === 0) {
        setSelected({ seriesId: '', chapterId: '', topicId: '' });
      } else if (preservedSelection) {
        const hasSeries = tree.some((series) => series.id === preservedSelection.seriesId);
        if (hasSeries) {
          setSelected(preservedSelection);
        } else {
          setSelected(getDefaultSelection(tree));
        }
      } else {
        setSelected(getDefaultSelection(tree));
      }
    } catch (error) {
      setMessage(error.message || 'Failed to load articles.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const urlResolvedSelection = useMemo(() => {
    if (!articleTree.length) return null;
    if (!(seriesSlug && chapterSlug && topicSlug)) return null;
    return resolveSelectionFromSlugs(articleTree, { seriesSlug, chapterSlug, topicSlug });
  }, [articleTree, seriesSlug, chapterSlug, topicSlug]);

  // URL -> selection (deep-linking / refresh)
  useEffect(() => {
    if (loading) return;
    if (!articleTree.length) return;

    if (!urlResolvedSelection) return;

    if (!areSelectionsEqual(urlResolvedSelection.selection, selected)) {
      setSelected(urlResolvedSelection.selection);
      return;
    }

    const canonicalPath = buildArticlePath(urlResolvedSelection);
    if (canonicalPath && location.pathname !== canonicalPath) {
      navigate(canonicalPath, { replace: true });
    }
  }, [loading, articleTree, urlResolvedSelection, selected, location.pathname, navigate]);

  // selection -> URL (canonical routing)
  useEffect(() => {
    if (loading) return;
    if (!articleTree.length) return;

    // If the URL already specifies slugs, do not override it until we've hydrated
    // the selection from that URL.
    if (urlResolvedSelection && !areSelectionsEqual(urlResolvedSelection.selection, selected)) {
      return;
    }

    const resolved = resolveSelectionFromIds(articleTree, selected);
    if (!areSelectionsEqual(resolved.selection, selected)) {
      setSelected(resolved.selection);
      return;
    }

    const canonicalPath = buildArticlePath(resolved);
    if (!canonicalPath) return;

    if (location.pathname === '/articles' || (seriesSlug && chapterSlug && topicSlug)) {
      if (location.pathname !== canonicalPath) {
        navigate(canonicalPath, { replace: location.pathname === '/articles' });
      }
    }
  }, [loading, articleTree, selected, location.pathname, seriesSlug, chapterSlug, topicSlug, navigate, urlResolvedSelection]);

  const { topic } = useMemo(() => getSelectionDetails(articleTree, selected), [articleTree, selected]);

  useEffect(() => {
    if (!topic?.id) {
      setEngagement((prev) => ({
        ...prev,
        topicId: '',
        likesCount: 0,
        savesCount: 0,
        liked: false,
        saved: false,
        loading: false,
      }));
      return;
    }

    let cancelled = false;
    setEngagement((prev) => ({
      ...prev,
      topicId: topic.id,
      loading: true,
    }));

    (async () => {
      try {
        const data = await getArticleTopicEngagement({ topicId: topic.id, token });
        if (cancelled) return;

        setEngagement({
          topicId: topic.id,
          likesCount: typeof data?.likesCount === 'number' ? data.likesCount : 0,
          savesCount: typeof data?.savesCount === 'number' ? data.savesCount : 0,
          liked: Boolean(data?.liked),
          saved: Boolean(data?.saved),
          loading: false,
        });
      } catch {
        if (cancelled) return;
        setEngagement((prev) => ({ ...prev, loading: false }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [topic?.id, token]);

  const performToggleLike = async ({ currentTopicId, currentToken }) => {
    const previous = engagementRef.current;
    if (previous.topicId !== currentTopicId) return;

    const nextLiked = !previous.liked;
    const delta = nextLiked ? 1 : -1;

    setEngagement((prev) => {
      if (prev.topicId !== currentTopicId) return prev;
      return {
        ...prev,
        liked: nextLiked,
        likesCount: Math.max(0, (prev.likesCount ?? 0) + delta),
      };
    });

    try {
      const payload = nextLiked
        ? await likeArticleTopic({ topicId: currentTopicId, token: currentToken })
        : await unlikeArticleTopic({ topicId: currentTopicId, token: currentToken });

      setEngagement((prev) => {
        if (prev.topicId !== currentTopicId) return prev;
        return {
          ...prev,
          liked: typeof payload?.liked === 'boolean' ? payload.liked : nextLiked,
          likesCount: typeof payload?.likesCount === 'number' ? payload.likesCount : prev.likesCount,
        };
      });
    } catch {
      setEngagement((prev) => (prev.topicId === currentTopicId ? previous : prev));
    }
  };

  const handleToggleLike = async () => {
    if (!topic?.id) return;

    if (!token) {
      setPendingEngagementAction('like');
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }

    await performToggleLike({ currentTopicId: topic.id, currentToken: token });
  };

  const performToggleSave = async ({ currentTopicId, currentToken }) => {
    const previous = engagementRef.current;
    if (previous.topicId !== currentTopicId) return;

    const nextSaved = !previous.saved;
    const delta = nextSaved ? 1 : -1;

    setEngagement((prev) => {
      if (prev.topicId !== currentTopicId) return prev;
      return {
        ...prev,
        saved: nextSaved,
        savesCount: Math.max(0, (prev.savesCount ?? 0) + delta),
      };
    });

    try {
      const payload = nextSaved
        ? await saveArticleTopic({ topicId: currentTopicId, token: currentToken })
        : await unsaveArticleTopic({ topicId: currentTopicId, token: currentToken });

      setEngagement((prev) => {
        if (prev.topicId !== currentTopicId) return prev;
        return {
          ...prev,
          saved: typeof payload?.saved === 'boolean' ? payload.saved : nextSaved,
          savesCount: typeof payload?.savesCount === 'number' ? payload.savesCount : prev.savesCount,
        };
      });
    } catch {
      setEngagement((prev) => (prev.topicId === currentTopicId ? previous : prev));
    }
  };

  const handleToggleSave = async () => {
    if (!topic?.id) return;

    if (!token) {
      setPendingEngagementAction('save');
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }

    await performToggleSave({ currentTopicId: topic.id, currentToken: token });
  };

  useEffect(() => {
    if (!token) return;
    if (!pendingEngagementAction) return;
    if (!topic?.id) return;

    const action = pendingEngagementAction;
    setPendingEngagementAction(null);
    setIsAuthOpen(false);

    if (action === 'like') {
      performToggleLike({ currentTopicId: topic.id, currentToken: token });
    }
    if (action === 'save') {
      performToggleSave({ currentTopicId: topic.id, currentToken: token });
    }
  }, [token, pendingEngagementAction, topic?.id]);

  useEffect(() => {
    // Avoid showing a stale thread if the user navigates topics.
    setIsCommentsOpen(false);
  }, [selected.topicId]);

  const selectedSeriesForDraft = useMemo(
    () => articleTree.find((item) => normalizeText(item.title) === normalizeText(draft.seriesTitle)),
    [articleTree, draft.seriesTitle]
  );

  const selectedChapterForDraft = useMemo(
    () => selectedSeriesForDraft?.chapters.find((item) => normalizeText(item.title) === normalizeText(draft.chapterTitle)),
    [selectedSeriesForDraft, draft.chapterTitle]
  );

  const seriesOptions = useMemo(() => articleTree.map((item) => item.title), [articleTree]);
  const chapterOptions = useMemo(() => (selectedSeriesForDraft?.chapters || []).map((item) => item.title), [selectedSeriesForDraft]);
  const topicOptions = useMemo(() => (selectedChapterForDraft?.topics || []).map((item) => item.title), [selectedChapterForDraft]);

  const orderedTopics = useMemo(() => flattenTopics(articleTree), [articleTree]);

  const activeTopicIndex = orderedTopics.findIndex((item) => item.id === topic?.id);
  const previousTopic = activeTopicIndex > 0 ? orderedTopics[activeTopicIndex - 1] : null;
  const nextTopic = activeTopicIndex >= 0 ? orderedTopics[activeTopicIndex + 1] : null;

  const handleDraftChange = (field, value) => {
  setDraft((previous) => {
    const next = { ...previous, [field]: value };

    if (field === 'seriesTitle') {
      next.chapterTitle = '';
      next.topicTitle = '';
    }

    if (field === 'chapterTitle') {
      next.topicTitle = '';
    }

    if (field === 'topicTitle') {
      const matchingSeries = articleTree.find(
        (item) => normalizeText(item.title) === normalizeText(next.seriesTitle)
      );
      const matchingChapter = matchingSeries?.chapters.find(
        (item) => normalizeText(item.title) === normalizeText(next.chapterTitle)
      );
      const matchingTopic = matchingChapter?.topics.find(
        (item) => normalizeText(item.title) === normalizeText(next.topicTitle)
      );

      if (matchingTopic) {
        next.content = matchingTopic.content || '';
        next.tags = (matchingTopic.tags || []).join(', ');
      }
    }

    return next;
  });
  };

  const handlePublish = () => {
    (async () => {
      try {
        const seriesTitle = draft.seriesTitle.trim();
        const chapterTitle = draft.chapterTitle.trim();
        const topicTitle = draft.topicTitle.trim();
        const content = draft.content.trim();
        const tags = (draft.tags || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        if (!seriesTitle || !chapterTitle || !topicTitle || !content) {
          setMessage('Series, chapter, topic, and content are required to publish.');
          setMessageType('error');
          return;
        }

        let seriesEntity = articleTree.find((item) => normalizeText(item.title) === normalizeText(seriesTitle));
        if (!seriesEntity) {
          const createdSeries = await createSeriesAdmin({ title: seriesTitle, token });
          seriesEntity = {
            id: createdSeries._id,
            title: createdSeries.title,
            slug: createdSeries.slug,
            chapters: [],
          };
        }

        let chapterEntity = seriesEntity.chapters.find((item) => normalizeText(item.title) === normalizeText(chapterTitle));
        if (!chapterEntity) {
          const createdChapter = await createChapterAdmin({
            title: chapterTitle,
            seriesId: seriesEntity.id,
            token,
          });

          chapterEntity = {
            id: createdChapter._id,
            title: createdChapter.title,
            slug: createdChapter.slug,
            topics: [],
          };
        }

        const existingTopic = chapterEntity.topics.find((item) => normalizeText(item.title) === normalizeText(topicTitle));
        let topicId = existingTopic?.id;

        if (existingTopic) {
          const updatedTopic = await updateTopicAdmin({
            topicId: existingTopic.id,
            title: topicTitle,
            chapterId: chapterEntity.id,
            content,
            tags,
            token,
          });
          topicId = updatedTopic._id;
        } else {
          const createdTopic = await createTopicAdmin({
            title: topicTitle,
            chapterId: chapterEntity.id,
            content,
            tags,
            token,
          });
          topicId = createdTopic._id;
        }

        await publishTopicAdmin({ topicId, token });
        await loadArticles({
          seriesId: seriesEntity.id,
          chapterId: chapterEntity.id,
          topicId,
        });

        setMessage(`Published "${topicTitle}" under ${seriesTitle} > ${chapterTitle}.`);
        setMessageType('success');
        setDraft({ seriesTitle: '', chapterTitle: '', topicTitle: '', tags: '', content: '' });
        setIsPublishOpen(false);
      } catch (error) {
        setMessage(error.message || 'Publish failed.');
        setMessageType('error');
      }
    })();
  };

  const handleContribute = () => {
    (async () => {
      try {
        const seriesTitle = draft.seriesTitle.trim();
        const chapterTitle = draft.chapterTitle.trim();
        const topicTitle = draft.topicTitle.trim();
        const content = draft.content.trim();
        const tags = (draft.tags || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        if (!seriesTitle || !chapterTitle || !topicTitle || !content) {
          setMessage('Series, chapter, topic, and content are required to contribute.');
          setMessageType('error');
          return;
        }

        const seriesEntity = articleTree.find((item) => normalizeText(item.title) === normalizeText(seriesTitle));
        const chapterEntity = seriesEntity?.chapters.find((item) => normalizeText(item.title) === normalizeText(chapterTitle));
        const topicEntity = chapterEntity?.topics.find((item) => normalizeText(item.title) === normalizeText(topicTitle));

        if (topicEntity) {
          await submitContribution({
            contributionType: 'existing_topic',
            topicId: topicEntity.id,
            content,
            tags,
            token,
          });
        } else {
          if (!chapterEntity?.id) {
            setMessage('Backend currently allows new topic contribution only inside an existing chapter.');
            setMessageType('error');
            return;
          }

          await submitContribution({
            contributionType: 'new_topic',
            chapterId: chapterEntity.id,
            title: topicTitle,
            content,
            tags,
            token,
          });
        }

        setMessage('Contribution submitted successfully for admin review.');
        setMessageType('success');
        setDraft({ seriesTitle: '', chapterTitle: '', topicTitle: '', tags: '', content: '' });
        setIsPublishOpen(false);
      } catch (error) {
        setMessage(error.message || 'Contribution failed.');
        setMessageType('error');
      }
    })();
  };

  const handleTopicChange = (topicItem) => {
    const nextSelection = {
      seriesId: topicItem.seriesId,
      chapterId: topicItem.chapterId,
      topicId: topicItem.id,
    };

    const resolved = resolveSelectionFromIds(articleTree, nextSelection);
    const canonicalPath = buildArticlePath(resolved);
    setSelected(resolved.selection);
    if (canonicalPath && location.pathname !== canonicalPath) {
      navigate(canonicalPath);
    }
  };

  const handleSelect = (nextSelection) => {
    const resolved = resolveSelectionFromIds(articleTree, nextSelection);
    const canonicalPath = buildArticlePath(resolved);
    setSelected(resolved.selection);
    if (canonicalPath && location.pathname !== canonicalPath) {
      navigate(canonicalPath);
    }
  };

  const getSeriesById = (seriesId) => articleTree.find((item) => item.id === seriesId);

  const handleManageAction = async (action, payload) => {
    if (action === 'share') {
      const series = getSeriesById(payload.seriesId);
      const chapter = series?.chapters.find((item) => item.id === payload.chapterId);
      const topicEntity = chapter?.topics.find((item) => item.id === payload.topicId);

      const shareTarget =
        payload.entityType === 'topic'
          ? topicEntity
          : payload.entityType === 'chapter'
          ? chapter?.topics?.[0]
          : series?.chapters?.[0]?.topics?.[0];

      if (!shareTarget) return;

      await openShareForTopicSlug({
        topicSlug: shareTarget.slug,
        fallbackTitle: shareTarget.title,
        fallbackPath: buildArticlePath({
          series: series || urlResolvedSelection?.series,
          chapter: payload.entityType === 'series' ? series?.chapters?.[0] : chapter,
          topic: shareTarget,
        }),
      });

      return;
    }

    if (!isAdmin) {
      return;
    }

    if (action === 'rename') {
      try {
      if (payload.entityType === 'series') {
        const series = articleTree.find((item) => item.id === payload.seriesId);
        if (!series) {
        return;
        }

        const nextName = window.prompt('Rename series', series.title)?.trim();
        if (!nextName) {
        return;
        }

        await updateSeriesAdmin({
        seriesId: series.id,
        title: nextName,
        description: '',
        token,
        });

        await loadArticles({ seriesId: series.id, chapterId: selected.chapterId, topicId: selected.topicId });
        setMessage('Series renamed successfully.');
        setMessageType('success');
        return;
      }

      if (payload.entityType === 'chapter') {
        const series = articleTree.find((item) => item.id === payload.seriesId);
        const chapter = series?.chapters.find((item) => item.id === payload.chapterId);
        if (!chapter) {
        return;
        }

        const nextName = window.prompt('Rename chapter', chapter.title)?.trim();
        if (!nextName) {
        return;
        }

        await updateChapterAdmin({
        chapterId: chapter.id,
        seriesId: series.id,
        title: nextName,
        token,
        });

        await loadArticles({ seriesId: series.id, chapterId: chapter.id, topicId: selected.topicId });
        setMessage('Chapter renamed successfully.');
        setMessageType('success');
        return;
      }

      const series = articleTree.find((item) => item.id === payload.seriesId);
      const chapter = series?.chapters.find((item) => item.id === payload.chapterId);
      const topicEntity = chapter?.topics.find((item) => item.id === payload.topicId);
      if (!topicEntity) {
        return;
      }

      const nextName = window.prompt('Rename topic', topicEntity.title)?.trim();
      if (!nextName) {
        return;
      }

      await updateTopicAdmin({
        topicId: topicEntity.id,
        title: nextName,
        chapterId: chapter.id,
        content: topicEntity.content,
        tags: topicEntity.tags || [],
        token,
      });
      await publishTopicAdmin({ topicId: topicEntity.id, token });
      await loadArticles({ seriesId: series.id, chapterId: chapter.id, topicId: topicEntity.id });
      setMessage('Topic renamed successfully.');
      setMessageType('success');
      } catch (error) {
      setMessage(error.message || 'Rename failed.');
      setMessageType('error');
      }
      return;
    }

    if (action === 'delete') {
      try {
      if (payload.entityType === 'series') {
        const shouldDelete = window.confirm('Delete this series and all its chapters/topics?');
        if (!shouldDelete) {
        return;
        }

        await deleteSeriesAdmin({ seriesId: payload.seriesId, token });
        await loadArticles();
        setMessage('Series deleted successfully.');
        setMessageType('success');
        return;
      }

      if (payload.entityType === 'chapter') {
        const shouldDelete = window.confirm('Delete this chapter and all its topics?');
        if (!shouldDelete) {
        return;
        }

        await deleteChapterAdmin({ chapterId: payload.chapterId, token });
        await loadArticles({ seriesId: payload.seriesId, chapterId: '', topicId: '' });
        setMessage('Chapter deleted successfully.');
        setMessageType('success');
        return;
      }

      const shouldDelete = window.confirm('Delete this topic?');
      if (!shouldDelete) {
        return;
      }

      await deleteTopicAdmin({ topicId: payload.topicId, token });
      await loadArticles({ seriesId: payload.seriesId, chapterId: payload.chapterId, topicId: '' });
      setMessage('Topic deleted successfully.');
      setMessageType('success');
      } catch (error) {
      setMessage(error.message || 'Delete failed.');
      setMessageType('error');
      }
    }
  };

  const backPath = user ? (isAdmin ? '/dashboard/admin' : '/dashboard/user') : '/';

  const closeComposer = () => {
    setIsPublishOpen(false);
    if (!isAdmin) {
      setDraft({ ...EMPTY_DRAFT });
    }
  };

  const openComposer = () => {
    setMessage('');
    setMessageType('info');
    if (!isAdmin) {
      setDraft({ ...EMPTY_DRAFT });
    }
    setIsPublishOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)]">
      <ThemeStyles />

      <header className="sticky top-0 z-30 bg-[var(--bg-card)]/90 backdrop-blur border-b border-[var(--border-color)]">
        <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(backPath)}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Articles</h1>
              <p className="text-xs md:text-sm text-[var(--text-muted)]">
                {isAdmin
                  ? 'Create, update and publish structured article content.'
                  : 'Read structured article content curated by admin.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-brand)] transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {(isAdmin || isUserPOV) && (
            <button
            type="button"
            onClick={openComposer}
            className="px-4 py-2 rounded-lg bg-[var(--btn-primary)] text-[var(--btn-text)] text-sm font-semibold hover:opacity-90 transition-opacity"
            >
            {isAdmin ? 'Publish Article' : 'Contribute'}
            </button>
          )}
          </div>
        </div>
      </header>

        <main className="w-full h-[calc(100vh-4rem)] min-h-0 overflow-hidden py-4 md:py-8 pr-4 md:pr-8">
        {loading ? (
          <ArticleLoadingState />
        ) : articleTree.length === 0 ? (
          <ArticleEmptyState message="No published articles yet." />
        ) : (
          <ArticleLayout
            sidebar={
              <ArticleTree
                articleTree={articleTree}
                selected={selected}
                onSelect={handleSelect}
                canManage={isAdmin}
                canShare={!isAdmin}
                onManageAction={handleManageAction}
              />
            }
          >
            <div className="p-6 md:p-8 h-full min-h-0">
              <ArticleContentSwitcher
                topicSlug={topic?.slug || ''}
                fallbackTopic={topic}
                onShareRequested={openShareForTopicEntity}
                likesCount={engagement.topicId === topic?.id ? engagement.likesCount : 0}
                savesCount={engagement.topicId === topic?.id ? engagement.savesCount : 0}
                isLiked={engagement.topicId === topic?.id ? engagement.liked : false}
                isSaved={engagement.topicId === topic?.id ? engagement.saved : false}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
                likeDisabled={engagement.loading}
                saveDisabled={engagement.loading}
                onOpenComments={() => {
                  if (!topic?.id) return;
                  setIsCommentsOpen(true);
                }}
              />
              <TopicPagination previousTopic={previousTopic} nextTopic={nextTopic} onTopicChange={handleTopicChange} />
            </div>
          </ArticleLayout>
        )}
      </main>

      <ArticleCommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        threadKey={topic?.id || ''}
        threadTitle={topic?.title || ''}
        currentUser={user}
        token={token}
        onRequireAuth={() => {
          setAuthMode('login');
          setIsAuthOpen(true);
        }}
      />

      {isPublishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/35 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closeComposer} aria-hidden="true" />
          <div className="relative w-full max-w-2xl">
            <ArticleFormShell
              draft={draft}
              onDraftChange={handleDraftChange}
              onPublish={isAdmin ? handlePublish : handleContribute}
              onClose={closeComposer}
              message={message}
              messageType={messageType}
              seriesOptions={seriesOptions}
              chapterOptions={chapterOptions}
              topicOptions={topicOptions}
              mode={isAdmin ? 'publish' : 'contribute'}
              actionLabel={isAdmin ? 'Publish Article' : 'Contribute'}
              title={isAdmin ? 'Create & Publish Article' : 'Contribute to Articles'}
              description={isAdmin ? 'Select existing or create new series, chapter, and topic.' : 'Share improvements or new content for admin review.'}
            />
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingEngagementAction(null);
        }}
        onAuthenticated={() => {
          setIsAuthOpen(false);
        }}
      />

      <ShareModal
        isOpen={shareState.isOpen}
        onClose={() => setShareState((previous) => ({ ...previous, isOpen: false }))}
        title={shareState.title}
        shareUrl={shareState.url}
        shareText={shareState.text}
        channels={shareState.channels}
      />
    </div>
  );
}

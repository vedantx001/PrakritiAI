// Purpose: Smooth, production-grade article switching (no flicker, skeleton loader, cached fetch, motion transitions).

import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	fetchPublishedTopicBySlug,
	peekPublishedTopicCache,
} from '../../../services/articleService';
import ArticleContent from '../ArticleContent';
import ArticleContentSkeleton from '../shared/ArticleContentSkeleton';

const contentVariants = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -10 },
};

const overlayVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export default function ArticleContentSwitcher({
	topicSlug,
	fallbackTopic,
	onShareRequested,
	onRetry,
	...articleContentProps
}) {
	const [renderedTopic, setRenderedTopic] = useState(() => {
		if (!topicSlug) return null;
		return peekPublishedTopicCache(topicSlug) || null;
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [retryNonce, setRetryNonce] = useState(0);
	const requestIdRef = useRef(0);

	const targetTitle = useMemo(() => {
		if (fallbackTopic?.title) return fallbackTopic.title;
		if (renderedTopic?.title) return renderedTopic.title;
		return 'Loading…';
	}, [fallbackTopic?.title, renderedTopic?.title]);

	useEffect(() => {
		let cancelled = false;

		if (!topicSlug) {
			queueMicrotask(() => {
				if (cancelled) return;
				setRenderedTopic(null);
				setIsLoading(false);
				setError('');
			});
			return () => {
				cancelled = true;
			};
		}

		const cached = peekPublishedTopicCache(topicSlug);
		if (cached) {
			queueMicrotask(() => {
				if (cancelled) return;
				setRenderedTopic(cached);
				setIsLoading(false);
				setError('');
			});
			return () => {
				cancelled = true;
			};
		}

		const controller = new AbortController();
		const currentRequestId = requestIdRef.current + 1;
		requestIdRef.current = currentRequestId;

		queueMicrotask(() => {
			if (cancelled) return;
			setIsLoading(true);
			setError('');
		});

		(async () => {
			try {
				const topic = await fetchPublishedTopicBySlug({ topicSlug, signal: controller.signal });
				if (requestIdRef.current !== currentRequestId) return;
				setRenderedTopic(topic);
				setIsLoading(false);
			} catch (e) {
				if (controller.signal.aborted) return;
				if (requestIdRef.current !== currentRequestId) return;
				setIsLoading(false);
				setError(e?.message || 'Failed to load article.');
			}
		})();

		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [topicSlug, retryNonce]);

	const showBlockingOverlay =
		(Boolean(renderedTopic) && Boolean(topicSlug) && isLoading) ||
		(Boolean(topicSlug) && Boolean(error) && renderedTopic?.slug !== topicSlug);

	const handleRetry = () => {
		setRetryNonce((value) => value + 1);
		onRetry?.();
	};

	return (
		<div className="relative" aria-busy={showBlockingOverlay} aria-live="polite">
			<AnimatePresence initial={false} mode="popLayout">
				<Motion.div
					key={renderedTopic?.slug || 'empty'}
					variants={contentVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.2, ease: 'easeOut' }}
					className="relative"
				>
					{renderedTopic ? (
						<ArticleContent
							title={renderedTopic.title}
							content={renderedTopic.content}
							tags={renderedTopic.tags || []}
							publishedAt={renderedTopic.publishedAt}
							contributorName={renderedTopic.contributorName}
							onShare={onShareRequested ? () => onShareRequested(renderedTopic) : undefined}
							{...articleContentProps}
						/>
					) : (
						<ArticleContentSkeleton title={targetTitle} />
					)}
				</Motion.div>
			</AnimatePresence>

			<AnimatePresence>
				{showBlockingOverlay ? (
					<Motion.div
						key="overlay"
						variants={overlayVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ duration: 0.15, ease: 'easeOut' }}
						className="absolute inset-0 bg-[var(--bg-primary)]"
					>
						{error ? (
							<div className="h-full w-full flex items-center justify-center p-6 md:p-8">
								<div className="max-w-md w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-center">
									<p className="text-sm text-[var(--text-main)] font-medium">Unable to load article</p>
									<p className="mt-1 text-xs text-[var(--text-muted)]">{error}</p>
									<button
										type="button"
											onClick={handleRetry}
										className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--btn-primary)] text-[var(--btn-text)] px-4 py-2 text-sm font-semibold hover:opacity-90"
									>
										Retry
									</button>
								</div>
							</div>
						) : (
							<ArticleContentSkeleton title={targetTitle} />
						)}
					</Motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}

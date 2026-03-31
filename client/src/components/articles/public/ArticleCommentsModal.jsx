import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ArrowDown, List, ListOrdered, MessageCircle, PencilLine, Send, Trash2, Type, User, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ConfirmDialog from '../../shared/ConfirmDialog';
import {
	addTopicComment,
	deleteTopicComment,
	getTopicComments,
	updateTopicComment,
	voteTopicComment,
} from '../../../services/articles/articleCommentsService';

const formatRelativeTime = (timestamp) => {
	const diffMs = Date.now() - Number(timestamp || 0);
	if (!Number.isFinite(diffMs)) return '';
	if (diffMs < 15_000) return 'Just now';

	const minutes = Math.floor(diffMs / 60_000);
	if (minutes < 60) return `${minutes} min ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hr ago`;

	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

	const weeks = Math.floor(days / 7);
	if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

	const years = Math.floor(days / 365);
	return `${years} year${years === 1 ? '' : 's'} ago`;
};

const buildThreadRows = (comments, { sortMode }) => {
	const byParent = new Map();
	for (const comment of comments) {
		const key = comment.parentId || '__root__';
		const list = byParent.get(key) || [];
		list.push(comment);
		byParent.set(key, list);
	}

	const score = (c) => (c.upvotes || 0) - (c.downvotes || 0);
	const sortFn = (a, b) => {
		if (sortMode === 'top') {
			const d = score(b) - score(a);
			if (d !== 0) return d;
		}
		return (b.createdAt || 0) - (a.createdAt || 0);
	};

	const rows = [];
	const visit = (parentId, depth) => {
		const key = parentId || '__root__';
		const children = [...(byParent.get(key) || [])].sort(sortFn);
		for (const child of children) {
			rows.push({ comment: child, depth });
			visit(child.id, Math.min(depth + 1, 2));
		}
	};

	visit(null, 0);
	return rows;
};

export default function ArticleCommentsModal({
	isOpen,
	onClose,
	threadKey,
	threadTitle,
	currentUser,
	token,
	onRequireAuth,
}) {
	const MotionDiv = motion.div;

	const [sortMode, setSortMode] = useState('recent');
	const [comments, setComments] = useState([]);
	const [draft, setDraft] = useState('');
	const [replyTo, setReplyTo] = useState(null);
	const [isIncomingPulse, setIsIncomingPulse] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editDraft, setEditDraft] = useState('');
	const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, comment: null });

	const listRef = useRef(null);
	const textareaRef = useRef(null);
	const incomingPulseTimeoutRef = useRef(null);
	const refreshIntervalRef = useRef(null);

	useEffect(() => {
		if (!isOpen) return;
		if (!threadKey) return;

		let cancelled = false;
		const refresh = async () => {
			setError('');
			setLoading(true);
			try {
				const next = await getTopicComments({ topicId: threadKey });
				if (cancelled) return;
				setComments((prev) => {
					if ((next?.length || 0) > (prev?.length || 0)) {
						setIsIncomingPulse(true);
						window.clearTimeout(incomingPulseTimeoutRef.current);
						incomingPulseTimeoutRef.current = window.setTimeout(() => setIsIncomingPulse(false), 800);
					}
					return next;
				});
			} catch (e) {
				if (!cancelled) setError(e?.message || 'Failed to load comments');
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		refresh();
		window.clearInterval(refreshIntervalRef.current);
		refreshIntervalRef.current = window.setInterval(refresh, 15_000);

		return () => {
			cancelled = true;
			window.clearInterval(refreshIntervalRef.current);
			window.clearTimeout(incomingPulseTimeoutRef.current);
		};
	}, [isOpen, threadKey]);

	useEffect(() => {
		if (isOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = 'unset';

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (e) => {
			if (e.key === 'Escape') onClose?.();
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [isOpen, onClose]);

	// Polling is handled in the main fetch effect above.

	useEffect(() => {
		if (!isOpen) return;
		// Scroll to top for Most Recent
		if (listRef.current) listRef.current.scrollTop = 0;
	}, [isOpen, sortMode, threadKey]);

	const rows = useMemo(() => buildThreadRows(comments, { sortMode }), [comments, sortMode]);
	const threadCount = useMemo(() => comments.filter((c) => !c.parentId).length, [comments]);

	const isAuthed = Boolean(token);
	const currentUserId = currentUser?.id || currentUser?._id || null;
	const isAdmin = currentUser?.role === 'admin';
	const resolvedUserName = isAuthed ? currentUser?.name || currentUser?.fullName || 'Anonymous_Geek' : 'Guest';

	const activeReply = useMemo(() => {
		if (!replyTo) return null;
		return comments.find((c) => c.id === replyTo) || null;
	}, [replyTo, comments]);

	const canManageComment = (comment) => {
		if (!isAuthed) return false;
		if (isAdmin) return true;
		if (!currentUserId) return false;
		return String(comment?.authorId || '') === String(currentUserId);
	};

	const removeCommentThread = (commentId) => {
		const toRemove = new Set([commentId]);
		let changed = true;
		while (changed) {
			changed = false;
			for (const c of comments) {
				if (!c?.parentId) continue;
				if (toRemove.has(c.parentId) && !toRemove.has(c.id)) {
					toRemove.add(c.id);
					changed = true;
				}
			}
		}
		setComments((prev) => (prev || []).filter((c) => !toRemove.has(c.id)));
		if (replyTo && toRemove.has(replyTo)) setReplyTo(null);
		if (editingId && toRemove.has(editingId)) {
			setEditingId(null);
			setEditDraft('');
		}
	};

	const handleSubmit = (e) => {
		e?.preventDefault?.();
		if (!threadKey) return;
		if (!isAuthed) {
			onRequireAuth?.();
			return;
		}

		const trimmed = draft.trim();
		if (!trimmed) return;

		setError('');
		setLoading(true);
		addTopicComment({
			topicId: threadKey,
			content: trimmed,
			parentId: replyTo,
			token,
		})
			.then((created) => {
				setComments((prev) => [...(prev || []), created]);
				setDraft('');
				setReplyTo(null);
				textareaRef.current?.focus?.();
			})
			.catch((e2) => setError(e2?.message || 'Failed to add comment'))
			.finally(() => setLoading(false));
	};

	const handleReply = (commentId) => {
		if (!isAuthed) {
			onRequireAuth?.();
			return;
		}
		setReplyTo(commentId);
		textareaRef.current?.focus?.();
	};

	const startEdit = (comment) => {
		if (!canManageComment(comment)) return;
		setEditingId(comment.id);
		setEditDraft(comment.content || '');
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditDraft('');
	};

	const saveEdit = (comment) => {
		if (!threadKey) return;
		if (!isAuthed) {
			onRequireAuth?.();
			return;
		}
		if (!canManageComment(comment)) return;
		const trimmed = (editDraft || '').trim();
		if (!trimmed) return;

		setError('');
		setLoading(true);
		updateTopicComment({ topicId: threadKey, commentId: comment.id, content: trimmed, token })
			.then((updated) => {
				setComments((prev) => (prev || []).map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
				cancelEdit();
			})
			.catch((e2) => setError(e2?.message || 'Failed to update comment'))
			.finally(() => setLoading(false));
	};

	const handleDelete = (comment) => {
		if (!threadKey) return;
		if (!isAuthed) {
			onRequireAuth?.();
			return;
		}
		if (!canManageComment(comment)) return;
		setDeleteConfirm({ isOpen: true, comment });
	};

	const confirmDeleteComment = () => {
		const comment = deleteConfirm.comment;
		if (!threadKey || !comment?.id) return;
		if (!isAuthed) {
			onRequireAuth?.();
			return;
		}
		if (!canManageComment(comment)) return;

		setError('');
		setLoading(true);
		deleteTopicComment({ topicId: threadKey, commentId: comment.id, token })
			.then(() => removeCommentThread(comment.id))
			.catch((e2) => setError(e2?.message || 'Failed to delete comment'))
			.finally(() => {
				setLoading(false);
				setDeleteConfirm({ isOpen: false, comment: null });
			});
	};

	const handleVote = (commentId, direction) => {
		if (!threadKey) return;
		if (!isAuthed) {
			onRequireAuth?.();
			return;
		}
		setError('');
		voteTopicComment({ topicId: threadKey, commentId, direction, token })
			.then((updated) => {
				setComments((prev) => (prev || []).map((c) => (c.id === updated.id ? updated : c)));
			})
			.catch((e2) => setError(e2?.message || 'Failed to vote'));
	};

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
					<MotionDiv
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={onClose}
					/>

					<MotionDiv
						initial={{ opacity: 0, y: 30, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 30, scale: 0.98 }}
						transition={{ duration: 0.35, type: 'spring', bounce: 0.18 }}
						className="relative w-full sm:max-w-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-2xl sm:rounded-2xl rounded-t-2xl overflow-hidden max-h-[90vh] flex flex-col"
						role="dialog"
						aria-modal="true"
						aria-label="Article comments"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
							<div className="min-w-0">
								<div className="flex items-center gap-2">
									<h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] truncate">
										Discussions
									</h2>
									<span
										className={`text-xs px-2 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-transform ${
											isIncomingPulse ? 'scale-[1.03]' : 'scale-100'
										}`}
									>
										{threadCount} Thread{threadCount === 1 ? '' : 's'}
									</span>
								</div>
								{threadTitle ? (
									<p className="text-xs sm:text-sm text-[var(--text-muted)] truncate">
										<MessageCircle className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
										{threadTitle}
									</p>
								) : null}
							</div>

							<div className="flex items-center gap-2">
								<select
									value={sortMode}
									onChange={(e) => setSortMode(e.target.value)}
									className="text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)]"
									aria-label="Sort comments"
								>
									<option value="recent">Most Recent</option>
									<option value="top">Top</option>
								</select>
								<button
									onClick={onClose}
									className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
									aria-label="Close"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
						</div>

						<div className="p-4 sm:p-5 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
							<div className="flex items-center gap-2 mb-3">
								<button
									type="button"
									className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
									aria-label="Text"
								>
									<Type size={16} />
								</button>
								<button
									type="button"
									className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
									aria-label="Bulleted list"
								>
									<List size={16} />
								</button>
								<button
									type="button"
									className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
									aria-label="Numbered list"
								>
									<ListOrdered size={16} />
								</button>
							</div>

							{activeReply ? (
								<div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2">
									<p className="text-xs sm:text-sm text-[var(--text-muted)] truncate">
										Replying to <span className="text-[var(--text-main)] font-medium">{activeReply.authorName}</span>
									</p>
									<button
										type="button"
										onClick={() => setReplyTo(null)}
										className="text-xs sm:text-sm text-[var(--text-brand)] font-medium hover:underline"
									>
										Cancel
									</button>
								</div>
							) : null}

							{error ? (
								<div className="mb-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3">
									<p className="text-sm text-[var(--text-muted)]">{error}</p>
								</div>
							) : null}

								{!isAuthed ? (
								<div className="mb-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3">
										<p className="text-sm text-[var(--text-muted)]">
											Login / Register to comment, reply, or vote.{' '}
											<button
												type="button"
												onClick={() => onRequireAuth?.()}
												className="text-[var(--text-brand)] font-semibold hover:underline"
											>
												Login
											</button>
										</p>
								</div>
							) : null}

							<form onSubmit={handleSubmit} className="flex flex-col gap-3">
								<textarea
									ref={textareaRef}
									value={draft}
									onChange={(e) => setDraft(e.target.value)}
									rows={3}
									placeholder={
										isAuthed
											? 'You can use @ to mention any user and # to add tags in the comment.'
											: 'Login / Register to write a comment.'
									}
										disabled={!isAuthed || loading}
									className="w-full resize-none rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-3 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] transition-shadow"
								/>

								<div className="flex items-center justify-between gap-3">
									<p className="text-xs text-[var(--text-muted)] truncate">
										Commenting as <span className="font-semibold text-[var(--text-main)]">{resolvedUserName}</span>
									</p>

									<button
										type="submit"
										disabled={!isAuthed || loading || !draft.trim()}
										className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--btn-primary)] text-[var(--btn-text)] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Submit <Send className="w-4 h-4" />
									</button>
								</div>
							</form>
						</div>

						<div ref={listRef} className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
							<div className="p-4 sm:p-5 space-y-4">
								{loading && comments.length === 0 ? (
									<div className="text-center py-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
										<p className="text-[var(--text-muted)]">Loading comments…</p>
									</div>
								) : rows.length === 0 ? (
									<div className="text-center py-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
										<p className="text-[var(--text-muted)]">No comments yet. Be the first to start the discussion.</p>
									</div>
								) : (
									<AnimatePresence initial={false}>
										{rows.map(({ comment, depth }) => (
											<MotionDiv
												key={comment.id}
												layout
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												transition={{ duration: 0.18 }}
												className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4"
												style={{ marginLeft: depth === 0 ? 0 : depth === 1 ? 18 : 34 }}
											>
												<div className="flex items-start gap-3">
													<div
														className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)]"
														aria-label="User"
														title={comment?.authorName || 'User'}
													>
														<User className="w-5 h-5" />
													</div>
													<div className="min-w-0 flex-1">
														<div className="flex items-center gap-2">
															<p className="font-semibold text-[var(--text-main)] truncate">{comment.authorName}</p>
															<span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(comment.createdAt)}</span>
														</div>
														<p className="mt-1 text-sm text-[var(--text-main)] whitespace-pre-wrap break-words">{comment.content}</p>
																	{editingId === comment.id ? (
																		<div className="mt-2">
																			<textarea
																				value={editDraft}
																				onChange={(e) => setEditDraft(e.target.value)}
																				rows={3}
																				disabled={loading}
																				className="mt-2 w-full resize-none rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-3 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] transition-shadow"
																			/>
																			<div className="mt-2 flex items-center gap-3">
																				<button
																					type="button"
																					onClick={() => saveEdit(comment)}
																					disabled={loading || !editDraft.trim()}
																					className="inline-flex items-center rounded-xl border border-[var(--border-color)] px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
																				>
																					Save
																				</button>
																				<button
																					type="button"
																					onClick={cancelEdit}
																					disabled={loading}
																					className="inline-flex items-center rounded-xl border border-[var(--border-color)] px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
																				>
																					Cancel
																				</button>
																			</div>
																		</div>
																	) : null}

														<div className="mt-3 flex items-center gap-4 text-sm">
															<button
																type="button"
																onClick={() => (!isAuthed ? onRequireAuth?.() : handleVote(comment.id, 'up'))}
																className={`inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] ${
																	!isAuthed ? 'opacity-60' : ''
																}`}
																aria-label="Upvote"
															>
																<ArrowUp className="w-4 h-4" />
																<span className="text-xs">{comment.upvotes || 0}</span>
															</button>
															<button
																type="button"
																onClick={() => (!isAuthed ? onRequireAuth?.() : handleVote(comment.id, 'down'))}
																className={`inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] ${
																	!isAuthed ? 'opacity-60' : ''
																}`}
																aria-label="Downvote"
															>
																<ArrowDown className="w-4 h-4" />
																<span className="text-xs">{comment.downvotes || 0}</span>
															</button>

															<button
																type="button"
																onClick={() => (!isAuthed ? onRequireAuth?.() : handleReply(comment.id))}
																className={`text-[var(--text-brand)] font-medium hover:underline ${!isAuthed ? 'opacity-60' : ''}`}
															>
																Reply
															</button>

																		{canManageComment(comment) ? (
																			<div className="flex items-center gap-2">
																				<button
																					type="button"
																					onClick={() => (editingId === comment.id ? cancelEdit() : startEdit(comment))}
																					disabled={loading}
																					className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
																					aria-label="Edit comment"
																					title="Edit"
																				>
																					<PencilLine className="w-3.5 h-3.5" />
																					Edit
																				</button>
																				<button
																					type="button"
																					onClick={() => handleDelete(comment)}
																					disabled={loading}
																					className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
																					aria-label="Delete comment"
																					title="Delete"
																				>
																					<Trash2 className="w-3.5 h-3.5" />
																					Delete
																				</button>
																			</div>
																		) : null}
														</div>
													</div>
												</div>
											</MotionDiv>
										))}
									</AnimatePresence>
								)}
							</div>
						</div>
					</MotionDiv>
					</div>
				)}
			</AnimatePresence>

			<ConfirmDialog
				isOpen={deleteConfirm.isOpen}
				onClose={() => setDeleteConfirm({ isOpen: false, comment: null })}
				onConfirm={confirmDeleteComment}
				title="Delete comment?"
				message="This will also delete its replies."
				confirmLabel="Delete"
				cancelLabel="Cancel"
			/>
		</>
	);
}

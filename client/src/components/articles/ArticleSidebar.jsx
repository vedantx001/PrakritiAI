// Purpose: Display hierarchical article navigation (series, chapter, topic links).

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Ellipsis, Pencil, Share2, Trash2 } from 'lucide-react';

const EXPANDED_SERIES_STORAGE_KEY = 'prakritiai.articleIndex.expandedSeries';
const EXPANDED_CHAPTERS_STORAGE_KEY = 'prakritiai.articleIndex.expandedChapters';

const readJsonObject = (key) => {
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
};

const writeJsonObject = (key, value) => {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// ignore storage errors (private mode / quota)
	}
};

const buildSeriesExpansionMap = (articleTree, stored) => {
	const next = {};
	for (const series of articleTree) {
		const existing = stored?.[series.id];
		next[series.id] = typeof existing === 'boolean' ? existing : true;
	}
	return next;
};

const buildChapterExpansionMap = (articleTree, stored) => {
	const next = {};
	const chapterIds = articleTree.flatMap((series) => (series.chapters || []).map((chapter) => chapter.id));
	for (const chapterId of chapterIds) {
		const existing = stored?.[chapterId];
		next[chapterId] = typeof existing === 'boolean' ? existing : false;
	}
	return next;
};

const ArticleSidebar = ({ articleTree, selected, onSelect, canManage = false, canShare = false, onManageAction }) => {
	const [expandedSeries, setExpandedSeries] = useState(() => {
		const stored = readJsonObject(EXPANDED_SERIES_STORAGE_KEY);
		return buildSeriesExpansionMap(articleTree, stored);
	});
	const [expandedChapters, setExpandedChapters] = useState(() => {
		const stored = readJsonObject(EXPANDED_CHAPTERS_STORAGE_KEY);
		return buildChapterExpansionMap(articleTree, stored);
	});
	const [menuTarget, setMenuTarget] = useState(null);

	useEffect(() => {
		writeJsonObject(EXPANDED_SERIES_STORAGE_KEY, expandedSeries);
	}, [expandedSeries]);

	useEffect(() => {
		writeJsonObject(EXPANDED_CHAPTERS_STORAGE_KEY, expandedChapters);
	}, [expandedChapters]);

	useEffect(() => {
		const onDocumentClick = () => setMenuTarget(null);
		document.addEventListener('click', onDocumentClick);
		return () => document.removeEventListener('click', onDocumentClick);
	}, []);

	const toggleSeries = (seriesId) => {
		setExpandedSeries((previous) => {
			const next = { ...previous, [seriesId]: !previous[seriesId] };
			return next;
		});
	};

	const toggleChapter = (chapterId) => {
		setExpandedChapters((previous) => {
			const next = { ...previous, [chapterId]: !previous[chapterId] };
			return next;
		});
	};

	const toggleMenu = (event, target) => {
		event.stopPropagation();
		setMenuTarget((previous) => {
			if (previous?.type === target.type && previous?.id === target.id) {
				return null;
			}
			return target;
		});
	};

	const renderMenu = (target) => {
		const hasMenuAccess = canManage || canShare;
		if (!hasMenuAccess || !menuTarget || menuTarget.type !== target.type || menuTarget.id !== target.id) {
			return null;
		}

		return (
			<div
				onClick={(event) => event.stopPropagation()}
				className="absolute right-0 top-8 z-40 min-w-[150px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-[var(--shadow-soft)] p-1"
			>
				<button
					type="button"
					onClick={() => {
						onManageAction?.('share', target.payload);
						setMenuTarget(null);
					}}
					className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
				>
					<Share2 size={14} />
					Share
				</button>
				{canManage && (
					<button
						type="button"
						onClick={() => {
							onManageAction?.('rename', target.payload);
							setMenuTarget(null);
						}}
						className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
					>
						<Pencil size={14} />
						Rename
					</button>
				)}
				{canManage && (
					<button
						type="button"
						onClick={() => {
							onManageAction?.('delete', target.payload);
							setMenuTarget(null);
						}}
						className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-500 hover:bg-[var(--bg-secondary)]"
					>
						<Trash2 size={14} />
						Delete
					</button>
				)}
			</div>
		);
	};

	return (
		<div className="h-full overflow-y-auto p-4 md:p-5">
			<h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-4">Article Index</h3>

			<div className="space-y-4">
				{articleTree.map((series) => {
					const isSeriesActive = selected.seriesId === series.id;
					const isSeriesExpanded = expandedSeries[series.id] !== false;

					return (
						<div key={series.id}>
							<div className="flex items-center gap-1 relative">
								<button
									type="button"
									onClick={() => toggleSeries(series.id)}
									className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"
									aria-label={isSeriesExpanded ? 'Collapse series' : 'Expand series'}
								>
									{isSeriesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
								</button>

								<button
									type="button"
									onClick={() => onSelect({ seriesId: series.id, chapterId: '', topicId: '' })}
									className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
										isSeriesActive
											? 'bg-[var(--bg-primary)] text-[var(--text-brand)] border border-[var(--border-color)]'
											: 'text-[var(--text-main)] hover:bg-[var(--bg-primary)] border border-transparent'
									}`}
								>
									{series.title}
								</button>

								{(canManage || canShare) && (
									<button
										type="button"
										onClick={(event) =>
											toggleMenu(event, {
												type: 'series',
												id: series.id,
												payload: { entityType: 'series', seriesId: series.id },
											})
										}
										className="p-1.5 rounded text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"
									>
										<Ellipsis size={16} />
									</button>
								)}

								{renderMenu({
									type: 'series',
									id: series.id,
									payload: { entityType: 'series', seriesId: series.id },
								})}
							</div>

							{isSeriesExpanded && (
								<div className="mt-2 pl-3 border-l border-[var(--border-color)] space-y-2">
									{series.chapters.map((chapter) => {
										const isChapterActive = selected.chapterId === chapter.id;
										const isChapterExpanded = expandedChapters[chapter.id] === true;

										return (
											<div key={chapter.id}>
												<div className="flex items-center gap-1 relative">
													<button
														type="button"
														onClick={() => toggleChapter(chapter.id)}
														className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"
														aria-label={isChapterExpanded ? 'Collapse chapter' : 'Expand chapter'}
													>
														{isChapterExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
													</button>

													<button
														type="button"
														onClick={() => onSelect({ seriesId: series.id, chapterId: chapter.id, topicId: '' })}
														className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
															isChapterActive
																? 'bg-[var(--bg-primary)] text-[var(--text-brand)]'
																: 'text-[var(--text-main)] hover:bg-[var(--bg-primary)]'
														}`}
													>
														{chapter.title}
													</button>

													{(canManage || canShare) && (
														<button
															type="button"
															onClick={(event) =>
																toggleMenu(event, {
																	type: 'chapter',
																	id: chapter.id,
																	payload: { entityType: 'chapter', seriesId: series.id, chapterId: chapter.id },
																})
															}
															className="p-1.5 rounded text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"
														>
															<Ellipsis size={14} />
														</button>
													)}

													{renderMenu({
														type: 'chapter',
														id: chapter.id,
														payload: { entityType: 'chapter', seriesId: series.id, chapterId: chapter.id },
													})}
												</div>

												{isChapterExpanded && (
													<div className="mt-1 pl-3 space-y-1">
														{chapter.topics.map((topic) => {
															const isTopicActive = selected.topicId === topic.id;

															return (
																<div key={topic.id} className="flex items-center gap-1 relative">
																	<button
																		type="button"
																		onClick={() => onSelect({ seriesId: series.id, chapterId: chapter.id, topicId: topic.id })}
																		className={`flex-1 text-left px-2 py-1.5 rounded text-xs transition-colors ${
																			isTopicActive
																				? 'text-[var(--text-brand)] bg-[var(--bg-primary)] font-semibold'
																				: 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-primary)]'
																		}`}
																	>
																		{topic.title}
																	</button>

																	{(canManage || canShare) && (
																		<button
																			type="button"
																			onClick={(event) =>
																				toggleMenu(event, {
																					type: 'topic',
																					id: topic.id,
																					payload: {
																						entityType: 'topic',
																						seriesId: series.id,
																						chapterId: chapter.id,
																						topicId: topic.id,
																					},
																				})
																			}
																			className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"
																		>
																			<Ellipsis size={12} />
																		</button>
																	)}

																	{renderMenu({
																		type: 'topic',
																		id: topic.id,
																		payload: {
																			entityType: 'topic',
																			seriesId: series.id,
																			chapterId: chapter.id,
																			topicId: topic.id,
																		},
																	})}
																</div>
															);
														})}
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ArticleSidebar;
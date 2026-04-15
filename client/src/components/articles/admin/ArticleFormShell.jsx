// Purpose: Compose the admin article form workflow (series, chapter, topic, content, publish).

import React from 'react';
import { X } from 'lucide-react';

import ChapterField from './ChapterField';
import ContentEditor from './ContentEditor';
import PublishPanel from './PublishPanel';
import SeriesField from './SeriesField';
import TagsField from './TagsField';
import TopicField from './TopicField';

const ArticleFormShell = ({
	draft,
	onDraftChange,
	onPublish,
	onClose,
	message,
	messageType,
	seriesOptions,
	chapterOptions,
	topicOptions,
	mode = 'publish',
	actionLabel = 'Publish Article',
	title = 'Create & Publish Article',
	description = 'Select existing or create new series, chapter, and topic.',
}) => {
	const seriesTitle = (draft.seriesTitle || '').trim();
	const chapterTitle = (draft.chapterTitle || '').trim();
	const topicTitle = (draft.topicTitle || '').trim();
	const rawContent = String(draft.content || '');
	const plainContent = rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	const hasContent = plainContent.length > 0;
	const canSubmit = seriesTitle.length > 0 && chapterTitle.length > 0 && topicTitle.length > 0 && hasContent;

	const isContributeMode = mode === 'contribute' || actionLabel.toLowerCase().includes('contribut');
	const typedUnknownSeries = isContributeMode && seriesTitle && !seriesOptions.includes(seriesTitle);
	const typedUnknownChapter = isContributeMode && chapterTitle && !chapterOptions.includes(chapterTitle);

	return (
		<section className="bg-[var(--bg-card)] md:border border-[var(--border-color)] rounded-none md:rounded-2xl shadow-none md:shadow-[var(--shadow-soft)] h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col relative w-full">
			<div className="sticky top-0 z-10 bg-[var(--bg-card)] px-4 py-4 md:p-6 border-b border-[var(--border-color)]">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0">
						<h2 className="text-lg md:text-xl font-bold text-[var(--text-main)]">{title}</h2>
						<p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>
					</div>
					{typeof onClose === 'function' && (
						<button
							type="button"
							onClick={onClose}
							className="shrink-0 p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)] transition-colors"
							aria-label="Close form"
							title="Close"
						>
							<X size={18} />
						</button>
					)}
				</div>

				{isContributeMode && (
					<div className="mt-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
						<p className="text-xs text-[var(--text-muted)]">
							Tip: Contributions work best when selecting an existing <span className="font-semibold text-[var(--text-main)]">Series</span> and{' '}
							<span className="font-semibold text-[var(--text-main)]">Chapter</span>. You can propose a new topic inside an existing chapter.
						</p>
						{(typedUnknownSeries || typedUnknownChapter) && (
							<p className="text-xs mt-2 text-amber-600 dark:text-amber-400">
								Note: New Series/Chapter may be rejected by backend. Consider choosing from the dropdown.
							</p>
						)}
					</div>
				)}
			</div>

			<div className="p-5 md:p-6 overflow-y-auto flex-1 min-h-0">
				<div className="grid grid-cols-1 gap-5">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<SeriesField
							value={draft.seriesTitle}
							onChange={(value) => onDraftChange('seriesTitle', value)}
							options={seriesOptions}
							required
						/>
						<ChapterField
							value={draft.chapterTitle}
							onChange={(value) => onDraftChange('chapterTitle', value)}
							options={chapterOptions}
							disabled={!seriesTitle}
							required
						/>
						<TopicField
							value={draft.topicTitle}
							onChange={(value) => onDraftChange('topicTitle', value)}
							options={topicOptions}
							disabled={!chapterTitle}
							required
						/>
					</div>

					<TagsField value={draft.tags} onChange={(value) => onDraftChange('tags', value)} />
					<ContentEditor value={draft.content} onChange={(value) => onDraftChange('content', value)} />
				</div>
			</div>

			<div className="sticky bottom-0 z-10 w-full px-4 md:px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] md:bg-[var(--bg-secondary)]/40">
				<PublishPanel
					onPublish={onPublish}
					disabled={!canSubmit}
					disabledHint="Fill Series, Chapter, Topic, and Content to continue."
					message={message}
					messageType={messageType}
					actionLabel={actionLabel}
				/>
			</div>
		</section>
	);
};

export default ArticleFormShell;

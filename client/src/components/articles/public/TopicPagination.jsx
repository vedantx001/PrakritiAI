// Purpose: Provide previous/next topic navigation links in reader view.

const TopicPagination = ({ previousTopic, nextTopic, onTopicChange }) => (
	<div className="mt-8 pt-5 border-t border-[var(--border-color)] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
		<button
			type="button"
			onClick={() => previousTopic && onTopicChange(previousTopic)}
			disabled={!previousTopic}
			className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-main)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-secondary)] transition-colors"
		>
			← {previousTopic ? previousTopic.title : 'No previous topic'}
		</button>

		<button
			type="button"
			onClick={() => nextTopic && onTopicChange(nextTopic)}
			disabled={!nextTopic}
			className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-main)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-secondary)] transition-colors"
		>
			{nextTopic ? `${nextTopic.title} →` : 'No next topic'}
		</button>
	</div>
);

export default TopicPagination;

// Purpose: Skeleton placeholder for article topic content while loading.

const SkeletonLine = ({ className = '' }) => (
	<div
		className={`h-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] ${className}`.trim()}
	/>
);

const ArticleContentSkeleton = ({ title = 'Loading…' } = {}) => (
	<article className="p-6 md:p-8 animate-pulse">
		<div className="mb-2">
			<div className="h-7 md:h-9 w-3/4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
			<p className="mt-2 text-xs text-[var(--text-muted)]">{title}</p>
		</div>

		<div className="mb-5 flex flex-col gap-2">
			<SkeletonLine className="w-56" />
			<SkeletonLine className="w-40" />
		</div>

		<div className="mb-5 flex flex-wrap gap-2">
			<div className="h-6 w-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
			<div className="h-6 w-20 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
			<div className="h-6 w-14 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
		</div>

		<div className="space-y-3">
			<SkeletonLine className="w-full" />
			<SkeletonLine className="w-11/12" />
			<SkeletonLine className="w-10/12" />
			<SkeletonLine className="w-full" />
			<SkeletonLine className="w-9/12" />
			<SkeletonLine className="w-11/12" />
			<SkeletonLine className="w-8/12" />
		</div>
	</article>
);

export default ArticleContentSkeleton;

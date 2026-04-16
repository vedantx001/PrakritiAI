// Purpose: Arrange article reader layout with sidebar navigation and content area.

const ArticleLayout = ({ sidebar, children, isMobileDrawerOpen, onCloseDrawer }) => (
	<div className="bg-[var(--bg-card)] lg:border lg:border-[var(--border-color)] lg:rounded-2xl lg:shadow-[var(--shadow-soft)] overflow-hidden h-full lg:grid lg:grid-cols-[260px_1fr] relative">
		{/* Mobile Drawer Overlay */}
		{isMobileDrawerOpen && (
			<div 
				className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
				onClick={onCloseDrawer}
				aria-hidden="true"
			/>
		)}

		{/* Mobile Drawer (Visible only on small screens) */}
		<aside 
			className={`
				fixed inset-y-0 left-0 z-50 w-[280px] sm:w-80 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transform transition-transform duration-300 ease-in-out lg:hidden
				${isMobileDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
			`}
		>
			<div className="h-full overflow-y-auto">{sidebar}</div>
		</aside>

		{/* Desktop Sidebar (Visible on lg screens) */}
		<aside className="hidden lg:block bg-[var(--bg-secondary)] border-r border-[var(--border-color)] h-full overflow-y-auto sticky top-0">
			{sidebar}
		</aside>

		{/* Main Content Area */}
		<section className="bg-[var(--bg-primary)] min-w-0 h-full relative overflow-y-auto">
			<div className="w-full flex justify-center min-h-full">
				<div className="w-full max-w-3xl xl:max-w-4xl">{children}</div>
			</div>
		</section>
	</div>
);

export default ArticleLayout;

// Purpose: Arrange article reader layout with sidebar navigation and content area.

const ArticleLayout = ({ sidebar, children, isMobileDrawerOpen, onCloseDrawer }) => (
	<div className="bg-[var(--bg-card)] lg:border lg:border-[var(--border-color)] lg:rounded-r-2xl lg:rounded-l-none lg:shadow-[var(--shadow-soft)] overflow-hidden h-full flex relative">
		{/* Mobile Drawer Overlay */}
		{isMobileDrawerOpen && (
			<div 
				className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
				onClick={onCloseDrawer}
				aria-hidden="true"
			/>
		)}

		{/* Sidebar / Mobile Drawer */}
		<aside 
			className={`
				fixed inset-y-0 left-0 z-50 w-[280px] sm:w-80 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transform transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:w-[280px] xl:w-[320px] lg:z-auto
				${isMobileDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
			`}
		>
			<div className="h-full overflow-y-auto">{sidebar}</div>
		</aside>

		{/* Main Content Area */}
		<section className="flex-1 bg-[var(--bg-primary)] min-w-0 h-full relative">
			<div className="h-full overflow-y-auto w-full flex justify-center">
				<div className="w-full max-w-4xl">{children}</div>
			</div>
		</section>
	</div>
);

export default ArticleLayout;

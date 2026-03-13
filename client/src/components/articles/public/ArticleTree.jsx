// Purpose: Render structured navigation tree of series, chapters, and topics.

import ArticleSidebar from '../ArticleSidebar';

const ArticleTree = ({ articleTree, selected, onSelect, canManage, onManageAction }) => (
	<ArticleSidebar
		articleTree={articleTree}
		selected={selected}
		onSelect={onSelect}
		canManage={canManage}
		onManageAction={onManageAction}
	/>
);

export default ArticleTree;

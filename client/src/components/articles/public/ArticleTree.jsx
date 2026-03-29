// Purpose: Render structured navigation tree of series, chapters, and topics.

import ArticleSidebar from '../ArticleSidebar';

const ArticleTree = ({ articleTree, selected, onSelect, canManage, canShare, onManageAction }) => (
	<ArticleSidebar
		articleTree={articleTree}
		selected={selected}
		onSelect={onSelect}
		canManage={canManage}
		canShare={canShare}
		onManageAction={onManageAction}
	/>
);

export default ArticleTree;

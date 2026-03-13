// Purpose: Capture and edit the main topic content before publishing.

import { useEffect, useMemo, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import MarkdownIt from 'markdown-it';
import { DOMParser as ProseMirrorDOMParser } from '@tiptap/pm/model';

const isProbablyHtml = (value) => /<\/?[a-z][\s\S]*>/i.test(value || '');

const escapeHtml = (value) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');

const plainTextToHtml = (value) => {
	const trimmed = String(value || '').trim();
	if (!trimmed) return '';

	const escaped = escapeHtml(trimmed);
	const paragraphs = escaped.split(/\n{2,}/g);
	return paragraphs.map((paragraph) => `<p>${paragraph.replaceAll('\n', '<br />')}</p>`).join('');
};

const looksLikeMarkdown = (value) => {
	const text = String(value || '');
	return (
		/^\s{0,3}#{1,6}\s+/.test(text) ||
		/^\s*([-*+]\s+|\d+\.\s+)/m.test(text) ||
		/\*\*[^\n]+\*\*/.test(text) ||
		/`{3,}/.test(text) ||
		/\[[^\]]+\]\([^\)]+\)/.test(text) ||
		/\|.+\|/.test(text)
	);
};

const ToolbarButton = ({ type = 'button', onClick, active = false, disabled = false, children, title }) => (
	<button
		type={type}
		title={title}
		onClick={onClick}
		disabled={disabled}
		className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
			active
				? 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-brand)]'
				: 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-main)] hover:bg-[var(--bg-secondary)]'
		}`}
	>
		{children}
	</button>
);

const ContentEditor = ({ value, onChange }) => {
	const lastEmittedHtmlRef = useRef('');
	const markdown = useMemo(
		() =>
			new MarkdownIt({
				html: false,
				linkify: true,
				breaks: true,
			}),
		[]
	);

	const initialContent = useMemo(() => {
		if (!value) return '';
		return isProbablyHtml(value) ? value : plainTextToHtml(value);
	}, [value]);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [2, 3, 4] },
				codeBlock: { HTMLAttributes: { class: 'tiptap-codeblock' } },
			}),
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
			Link.configure({
				openOnClick: false,
				autolink: true,
				linkOnPaste: true,
				HTMLAttributes: {
					target: '_blank',
					rel: 'noopener noreferrer',
				},
			}),
			Placeholder.configure({
				placeholder: 'Write the full topic content here...',
			}),
		],
		content: initialContent,
		editorProps: {
			attributes: {
				class: 'tiptap-editor ProseMirror',
			},
			handlePaste: (view, event) => {
				const clipboard = event?.clipboardData;
				if (!clipboard) return false;

				const html = clipboard.getData('text/html');
				if (html && html.trim().length > 0) {
					// Let TipTap handle rich HTML pastes natively.
					return false;
				}

				const text = clipboard.getData('text/plain');
				if (!text || !looksLikeMarkdown(text)) return false;

				const rendered = markdown.render(text);
				const dom = new window.DOMParser().parseFromString(rendered, 'text/html').body;
				const slice = ProseMirrorDOMParser.fromSchema(view.state.schema).parseSlice(dom);
				view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
				return true;
			},
		},
		onUpdate: ({ editor: nextEditor }) => {
			const html = nextEditor.getHTML();
			lastEmittedHtmlRef.current = html;
			onChange(html);
		},
	});

	useEffect(() => {
		if (!editor) return;
		const nextValue = value || '';
		const nextHtml = isProbablyHtml(nextValue) ? nextValue : plainTextToHtml(nextValue);

		if (nextHtml === lastEmittedHtmlRef.current) return;
		if (editor.getHTML() === nextHtml) return;

		editor.commands.setContent(nextHtml || '', false);
	}, [editor, value]);

	const setLink = () => {
		if (!editor) return;
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('Enter URL', previousUrl || '');
		if (url === null) return;
		if (!url.trim()) {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
	};

	return (
		<div className="space-y-2">
			<label className="text-sm font-semibold text-[var(--text-main)]">Content</label>

			<div className="flex flex-wrap gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-2.5">
				<ToolbarButton
					onClick={() => editor?.chain().focus().toggleBold().run()}
					active={!!editor?.isActive('bold')}
					disabled={!editor?.can().chain().focus().toggleBold().run()}
					title="Bold"
				>
					B
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor?.chain().focus().toggleItalic().run()}
					active={!!editor?.isActive('italic')}
					disabled={!editor?.can().chain().focus().toggleItalic().run()}
					title="Italic"
				>
					I
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
					active={!!editor?.isActive('heading', { level: 2 })}
					title="Heading 2"
				>
					H2
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
					active={!!editor?.isActive('heading', { level: 3 })}
					title="Heading 3"
				>
					H3
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor?.chain().focus().toggleBulletList().run()}
					active={!!editor?.isActive('bulletList')}
					title="Bullet list"
				>
					• List
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor?.chain().focus().toggleOrderedList().run()}
					active={!!editor?.isActive('orderedList')}
					title="Numbered list"
				>
					1. List
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor?.chain().focus().toggleBlockquote().run()}
					active={!!editor?.isActive('blockquote')}
					title="Quote"
				>
					“ ”
				</ToolbarButton>
				<ToolbarButton onClick={setLink} active={!!editor?.isActive('link')} title="Link">
					Link
				</ToolbarButton>
				<ToolbarButton onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} title="Undo">
					Undo
				</ToolbarButton>
				<ToolbarButton onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} title="Redo">
					Redo
				</ToolbarButton>
			</div>

			<div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3.5 focus-within:ring-2 focus-within:ring-[var(--text-brand)]/30">
				<EditorContent editor={editor} />
			</div>
		</div>
	);
};

export default ContentEditor;

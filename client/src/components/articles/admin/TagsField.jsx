// Purpose: Capture comma-separated tags for the article topic.

const TagsField = ({ value, onChange }) => (
	<div className="space-y-2">
		<label className="text-sm font-semibold text-[var(--text-main)]">Tags</label>
		<input
			type="text"
			value={value}
			onChange={(event) => onChange(event.target.value)}
			placeholder="Example: Ayurveda, Wellness, Doshas"
			className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)]/30"
		/>
		<p className="text-xs text-[var(--text-muted)]">Use commas to separate tags.</p>
	</div>
);

export default TagsField;

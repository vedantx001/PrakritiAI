// Purpose: Select or create a chapter filtered by the selected series.

const ChapterField = ({ value, onChange, options = [], disabled = false, required = false }) => (
	<div className="space-y-2">
		<label className="text-sm font-semibold text-[var(--text-main)]">
			Chapter {required && <span className="text-red-500">*</span>}
		</label>

		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<div className="space-y-1">
				<p className="text-xs text-[var(--text-muted)]">Choose existing</p>
				<select
					value={options.includes(value) ? value : ''}
					disabled={disabled}
					onChange={(event) => {
						if (event.target.value) {
							onChange(event.target.value);
						}
					}}
					className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<option value="">Select chapter</option>
					{options.map((chapterTitle) => (
						<option key={chapterTitle} value={chapterTitle}>
							{chapterTitle}
						</option>
					))}
				</select>
			</div>

			<div className="space-y-1">
				<p className="text-xs text-[var(--text-muted)]">Or type new</p>
				<input
					type="text"
					value={value}
					disabled={disabled}
					onChange={(event) => onChange(event.target.value)}
					placeholder="New chapter title"
					className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</div>
		</div>
	</div>
);

export default ChapterField;

// Purpose: Select or create an article series in the publish/contribute form.

const SeriesField = ({ value, onChange, options = [], required = false }) => (
	<div className="space-y-2">
		<label className="text-sm font-semibold text-[var(--text-main)]">
			Series {required && <span className="text-red-500">*</span>}
		</label>

		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<div className="space-y-1">
				<p className="text-xs text-[var(--text-muted)]">Choose existing</p>
				<select
					value={options.includes(value) ? value : ''}
					onChange={(event) => {
						if (event.target.value) {
							onChange(event.target.value);
						}
					}}
					className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)]/30"
				>
					<option value="">Select series</option>
					{options.map((seriesTitle) => (
						<option key={seriesTitle} value={seriesTitle}>
							{seriesTitle}
						</option>
					))}
				</select>
			</div>

			<div className="space-y-1">
				<p className="text-xs text-[var(--text-muted)]">Or type new</p>
				<input
					type="text"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					placeholder="New series title"
					className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)]/30"
				/>
			</div>
		</div>
	</div>
);

export default SeriesField;

// Purpose: Show publish actions, validation status, and final submit controls.

const PublishPanel = ({
	onPublish,
	disabled = false,
	disabledHint = '',
	message,
	messageType = 'info',
	actionLabel = 'Publish Article',
}) => (
	<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
		<div className="min-w-0">
			{disabled && disabledHint ? <p className="text-xs text-[var(--text-muted)]">{disabledHint}</p> : null}
			{message ? (
				<div
					className={`mt-1 text-sm ${
						messageType === 'error' ? 'text-red-500' : messageType === 'success' ? 'text-[var(--text-brand)]' : 'text-[var(--text-muted)]'
					}`}
				>
					{message}
				</div>
			) : null}
		</div>

		<button
			type="button"
			onClick={onPublish}
			disabled={disabled}
			className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--btn-primary)] text-[var(--btn-text)] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{actionLabel}
		</button>
	</div>
);

export default PublishPanel;

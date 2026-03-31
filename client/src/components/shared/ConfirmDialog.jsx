import { AnimatePresence, motion } from 'framer-motion';

const overlayVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

const panelVariants = {
	initial: { opacity: 0, y: 14, scale: 0.98 },
	animate: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: 14, scale: 0.98 },
};

export default function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title = 'Confirm',
	message = '',
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
}) {
	const MotionDiv = motion.div;

	return (
		<AnimatePresence>
			{isOpen ? (
				<MotionDiv
					className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
					variants={overlayVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.15, ease: 'easeOut' }}
					role="dialog"
					aria-modal="true"
					aria-label={title}
				>
					<div
						className="absolute inset-0 bg-black/35 backdrop-blur-sm"
						onClick={onClose}
						aria-hidden="true"
					/>

					<MotionDiv
						className="relative w-full max-w-sm rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xl"
						variants={panelVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ duration: 0.18, ease: 'easeOut' }}
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-base font-bold text-[var(--text-main)]">{title}</h3>
						{message ? <p className="mt-1 text-xs text-[var(--text-muted)]">{message}</p> : null}

						<div className="mt-4 flex items-center justify-end gap-2">
							<button
								type="button"
								onClick={onClose}
								className="inline-flex items-center justify-center rounded-xl border border-[var(--border-color)] px-3 py-2 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
							>
								{cancelLabel}
							</button>
							<button
								type="button"
								onClick={onConfirm}
								className="inline-flex items-center justify-center rounded-xl bg-[var(--text-brand)] px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
							>
								{confirmLabel}
							</button>
						</div>
					</MotionDiv>
				</MotionDiv>
			) : null}
		</AnimatePresence>
	);
}

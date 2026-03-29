// Purpose: Smooth share modal used from article reader and sidebar.

import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Copy, X } from 'lucide-react';

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

const buildWhatsAppHref = ({ text, url }) => {
	const message = [text, url].filter(Boolean).join('\n');
	return `https://wa.me/?text=${encodeURIComponent(message)}`;
};

export default function ShareModal({ isOpen, onClose, title, shareUrl, shareText, channels }) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (event) => {
			if (event.key === 'Escape') onClose?.();
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (!isOpen) return;
		let cancelled = false;
		queueMicrotask(() => {
			if (cancelled) return;
			setCopied(false);
		});
		return () => {
			cancelled = true;
		};
	}, [isOpen]);

	const normalizedChannels = useMemo(() => {
		if (!Array.isArray(channels)) return [];
		return channels
			.filter((item) => item && typeof item === 'object')
			.map((item) => ({
				id: String(item.id || ''),
				label: item.label ? String(item.label) : '',
			}))
			.filter((item) => item.id.length > 0);
	}, [channels]);

	const hasWhatsApp = normalizedChannels.some((item) => item.id === 'whatsapp');
	const whatsappLabel = normalizedChannels.find((item) => item.id === 'whatsapp')?.label || 'WhatsApp';
	const whatsappHref = useMemo(() => buildWhatsAppHref({ text: shareText, url: shareUrl }), [shareText, shareUrl]);

	const handleCopy = async () => {
		if (!shareUrl) return;
		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(shareUrl);
			} else {
				const temp = document.createElement('textarea');
				temp.value = shareUrl;
				temp.setAttribute('readonly', '');
				temp.style.position = 'fixed';
				temp.style.left = '-9999px';
				document.body.appendChild(temp);
				temp.select();
				document.execCommand('copy');
				document.body.removeChild(temp);
			}
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1200);
		} catch {
			setCopied(false);
		}
	};

	return (
		<AnimatePresence>
			{isOpen ? (
				<Motion.div
					className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
					variants={overlayVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.15, ease: 'easeOut' }}
				>
					<div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

					<Motion.div
						role="dialog"
						aria-modal="true"
						className="relative w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xl"
						variants={panelVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ duration: 0.18, ease: 'easeOut' }}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							onClick={onClose}
							className="absolute top-3 right-3 rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]"
							aria-label="Close"
						>
							<X size={18} />
						</button>

						<div className="pr-8">
							<h3 className="text-lg font-bold text-[var(--text-main)]">Share</h3>
							{title ? <p className="mt-1 text-xs text-[var(--text-muted)]">{title}</p> : null}
						</div>

						<div className="mt-4">
							<label className="text-xs text-[var(--text-muted)]">Link</label>
							<div className="mt-1 flex items-center gap-2">
								<input
									value={shareUrl || ''}
									readOnly
									className="flex-1 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-main)]"
								/>
								<button
									type="button"
									onClick={handleCopy}
									disabled={!shareUrl}
									className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)] disabled:opacity-50"
								>
									<Copy size={16} />
									{copied ? 'Copied' : 'Copy'}
								</button>
							</div>
						</div>

						<div className="mt-4 grid grid-cols-1 gap-2">
							{hasWhatsApp ? (
								<a
									href={whatsappHref}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center justify-center rounded-lg bg-[var(--btn-primary)] text-[var(--btn-text)] px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
								>
									Share to {whatsappLabel}
								</a>
							) : null}
						</div>
					</Motion.div>
				</Motion.div>
			) : null}
		</AnimatePresence>
	);
}

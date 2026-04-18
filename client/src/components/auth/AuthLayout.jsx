import { ArrowLeft, Leaf, NotebookText, ShieldCheck, Stethoscope } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logoDark from '../../assets/DarkMode_logo_PAI.png';

const AuthLayout = ({ title, subtitle, children }) => {
	const location = useLocation();
	const isSignupRoute = location.pathname.includes('/auth/signup');

	return (
		<div className="min-h-screen w-full bg-[var(--bg-secondary)] p-4 sm:p-6 lg:p-10 flex items-center justify-center">
			<div className="w-full max-w-5xl min-h-[680px] bg-[var(--bg-card)] rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex">
				<div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden flex-col justify-between p-10 text-white">
					<div className="absolute top-0 left-0 w-full h-full">
						<div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-800/50 blur-3xl" />
						<div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-900/50 blur-3xl" />
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-emerald-950/50" />
					</div>

					<div className="relative z-10">
						<Link to="/" className="flex items-center gap-2 group w-fit">
							<img
								src={logoDark}
								alt="PrakritiAI"
								className="h-12 w-auto max-w-[280px] object-contain"
							/>
						</Link>
					</div>

					<div className="relative z-10 max-w-md">
						<div className="mt-7 grid grid-cols-2 gap-4">
							<div className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
								<div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-300/20">
									<NotebookText className="w-5 h-5 text-emerald-300" />
								</div>
								<div>
									<p className="font-semibold">Prakriti report</p>
									<p className="text-sm text-emerald-100/70">Readable, structured insights</p>
								</div>
							</div>
							<div className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
								<div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-300/20">
									<Stethoscope className="w-5 h-5 text-emerald-300" />
								</div>
								<div>
									<p className="font-semibold">Remedy suggestions</p>
									<p className="text-sm text-emerald-100/70">Food, routine, and herbs</p>
								</div>
							</div>
							<div className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
								<div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-300/20">
									<ShieldCheck className="w-5 h-5 text-emerald-300" />
								</div>
								<div>
									<p className="font-semibold">Private by default</p>
									<p className="text-sm text-emerald-100/70">Your data stays yours</p>
								</div>
							</div>
							<div className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
								<div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-300/20">
									<Leaf className="w-5 h-5 text-emerald-300" />
								</div>
								<div>
									<p className="font-semibold">Daily balance</p>
									<p className="text-sm text-emerald-100/70">Small steps that compound</p>
								</div>
							</div>
						</div>

						<div className="mt-7 rounded-3xl bg-white/5 border border-white/10 p-5">
							<div className="flex items-center justify-between">
								<p className="text-sm font-semibold text-emerald-100">Preview</p>
								<p className="text-xs text-emerald-200/70">Sample report</p>
							</div>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl bg-white/5 border border-white/10 p-4">
									<p className="text-sm font-semibold">Your current balance</p>
									<div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
										<div className="h-full w-[58%] bg-emerald-400/70" />
									</div>
									<p className="mt-2 text-xs text-emerald-200/70">Clear, simple, and actionable</p>
								</div>
								<div className="grid grid-cols-3 gap-2">
									<div className="rounded-2xl bg-white/5 border border-white/10 p-3">
										<p className="text-xs text-emerald-200/70">Vata</p>
										<p className="text-sm font-semibold mt-1">Moderate</p>
									</div>
									<div className="rounded-2xl bg-white/5 border border-white/10 p-3">
										<p className="text-xs text-emerald-200/70">Pitta</p>
										<p className="text-sm font-semibold mt-1">High</p>
									</div>
									<div className="rounded-2xl bg-white/5 border border-white/10 p-3">
										<p className="text-xs text-emerald-200/70">Kapha</p>
										<p className="text-sm font-semibold mt-1">Low</p>
									</div>
								</div>
							</div>
						</div>

						<p className="mt-6 text-emerald-200/70 text-sm leading-relaxed">
							“When diet is correct, medicine is of no need.”
							<span className="text-emerald-200/50"> — Ayurvedic proverb</span>
						</p>
					</div>

					<div className="relative z-10 text-sm text-emerald-300/60">© 2026 PrakritiAI Project.</div>
				</div>

				<div className="w-full lg:w-1/2 min-h-[680px] flex items-center justify-center p-6 sm:p-10 relative">
					<Link
						to="/"
						className="absolute top-6 left-6 flex items-center gap-2 text-[var(--text-muted)] hover:text-emerald-600 transition-colors lg:hidden"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>

					<AnimatePresence mode="wait">
						<motion.div
							key={location.pathname}
							initial={{ opacity: 0, x: isSignupRoute ? 24 : -24 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: isSignupRoute ? -24 : 24 }}
							transition={{ duration: 0.28, ease: 'easeOut' }}
							className="w-full max-w-sm space-y-7"
						>
							<div className="text-center lg:text-left">
								<h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{title}</h1>
								<p className="mt-2 text-[var(--text-muted)]">{subtitle}</p>
							</div>

							{children}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;


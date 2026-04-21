import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Home,
  ShieldCheck,
  Clock,
  Wifi,
  Leaf,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  Animated Lotus SVG – the centrepiece icon                         */
/* ------------------------------------------------------------------ */
const AnimatedLotus = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-20 h-20 sm:w-24 sm:h-24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Outer glow */}
    <circle
      cx="60"
      cy="60"
      r="52"
      className="stroke-emerald-400/20 dark:stroke-emerald-300/15"
      strokeWidth="1.5"
    >
      <animate
        attributeName="r"
        values="48;54;48"
        dur="4s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.5;1;0.5"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Centre petal */}
    <path
      d="M60 22 C60 22, 72 44, 60 68 C48 44, 60 22, 60 22Z"
      className="fill-emerald-500 dark:fill-emerald-400"
      opacity="0.85"
    >
      <animateTransform
        attributeName="transform"
        type="scale"
        values="1 1;1.04 1.02;1 1"
        dur="3s"
        repeatCount="indefinite"
        additive="sum"
        calcMode="spline"
        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
      />
    </path>

    {/* Left petal */}
    <path
      d="M60 68 C44 48, 24 42, 24 42 C24 42, 40 62, 60 68Z"
      className="fill-emerald-400 dark:fill-emerald-300"
      opacity="0.7"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 60 68;-3 60 68;0 60 68"
        dur="3.5s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
      />
    </path>

    {/* Right petal */}
    <path
      d="M60 68 C76 48, 96 42, 96 42 C96 42, 80 62, 60 68Z"
      className="fill-emerald-400 dark:fill-emerald-300"
      opacity="0.7"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 60 68;3 60 68;0 60 68"
        dur="3.5s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
      />
    </path>

    {/* Far-left petal */}
    <path
      d="M60 68 C38 56, 16 56, 16 56 C16 56, 34 68, 60 68Z"
      className="fill-emerald-300 dark:fill-emerald-200"
      opacity="0.5"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 60 68;-4 60 68;0 60 68"
        dur="4s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
      />
    </path>

    {/* Far-right petal */}
    <path
      d="M60 68 C82 56, 104 56, 104 56 C104 56, 86 68, 60 68Z"
      className="fill-emerald-300 dark:fill-emerald-200"
      opacity="0.5"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 60 68;4 60 68;0 60 68"
        dur="4s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
      />
    </path>

    {/* Base / stem accent */}
    <ellipse
      cx="60"
      cy="72"
      rx="18"
      ry="4"
      className="fill-emerald-600/20 dark:fill-emerald-400/15"
    >
      <animate
        attributeName="rx"
        values="16;20;16"
        dur="3s"
        repeatCount="indefinite"
      />
    </ellipse>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Pulsing ring – decorative background element                      */
/* ------------------------------------------------------------------ */
const PulseRing = ({ delay = '0s', size = 'w-40 h-40' }) => (
  <span
    className={`absolute rounded-full border border-emerald-400/20 dark:border-emerald-300/10 ${size}`}
    style={{
      animation: `pulseRing 4s ease-out ${delay} infinite`,
    }}
  />
);

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */
const COUNTDOWN_SECONDS = 30;

const AIServiceUnavailable = ({ onRetry }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isRetrying, setIsRetrying] = useState(false);

  /* ---- auto-retry countdown ---- */
  useEffect(() => {
    if (countdown <= 0) {
      handleRetry();
      return;
    }
    const timerId = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    // Simulate a small delay so the user sees the spinner, then fire the callback
    setTimeout(() => {
      if (onRetry) {
        onRetry();
      }
      setIsRetrying(false);
      setCountdown(COUNTDOWN_SECONDS);
    }, 1200);
  }, [onRetry]);

  const progressPercent = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

  return (
    <section
      id="ai-service-unavailable"
      className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-300 overflow-hidden px-4 py-12 sm:py-16"
    >
      {/* ---- Background decorations ---- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[-6%] w-[500px] h-[500px] bg-emerald-100/60 dark:bg-emerald-900/30 rounded-full blur-3xl lg:w-[750px] lg:h-[750px]" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[550px] h-[550px] bg-teal-100/60 dark:bg-teal-900/30 rounded-full blur-3xl lg:w-[750px] lg:h-[750px]" />
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-emerald-100/30 dark:bg-emerald-900/15 rounded-full blur-3xl lg:w-[550px] lg:h-[550px]" />
      </div>

      {/* ---- Card ---- */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Gradient border wrapper */}
        <div className="rounded-[2rem] p-[1px] bg-gradient-to-b from-emerald-500/25 via-teal-500/10 to-transparent dark:from-emerald-400/20 dark:via-teal-400/10">
          <div className="rounded-[2rem] bg-[var(--bg-card)]/85 backdrop-blur-2xl border border-[var(--border-color)] shadow-xl overflow-hidden">

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-[var(--bg-secondary)]">
              <div
                className="h-full bg-[var(--text-brand)] rounded-r-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="px-6 sm:px-10 py-10 sm:py-14 flex flex-col items-center text-center">

              {/* Animated lotus with pulse rings */}
              <div className="relative flex items-center justify-center mb-8">
                <PulseRing delay="0s" size="w-32 h-32 sm:w-40 sm:h-40" />
                <PulseRing delay="1.3s" size="w-48 h-48 sm:w-56 sm:h-56" />
                <PulseRing delay="2.6s" size="w-64 h-64 sm:w-72 sm:h-72" />
                <AnimatedLotus />
              </div>

              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 dark:bg-amber-900/30 border border-amber-300/60 dark:border-amber-700/50 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300 tracking-wide">
                  AI Providers Reconnecting
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight leading-snug mb-3">
                Healing Intelligence is Taking a Short Pause
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-md mb-8">
                Our Ayurvedic analysis system is temporarily unavailable due to high demand or provider downtime. Please try again shortly.
              </p>

              {/* ---- Helpful extras ---- */}
              <div className="w-full bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 mb-8 space-y-3">
                <div className="flex items-start gap-3 text-left">
                  <ShieldCheck size={18} className="text-[var(--text-brand)] flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                    <span className="font-semibold">Your entered symptoms are safe</span>{' '}
                    <span className="text-[var(--text-muted)]">and have not been lost.</span>
                  </p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <Clock size={18} className="text-[var(--text-brand)] flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Try again in a few moments — most disruptions resolve within seconds.
                  </p>
                </div>
              </div>

              {/* ---- Auto-retry countdown ---- */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-muted)] mb-8 font-medium">
                <Wifi size={14} className="text-[var(--text-brand)]" />
                {isRetrying ? (
                  <span className="text-[var(--text-brand)]">Retrying…</span>
                ) : (
                  <span>
                    Auto-retrying in{' '}
                    <span className="text-[var(--text-brand)] font-bold tabular-nums">{countdown}s</span>
                  </span>
                )}
              </div>

              {/* ---- Buttons ---- */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Primary: Retry Analysis */}
                <button
                  id="retry-analysis-btn"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex-1 flex items-center justify-center gap-2 bg-[var(--btn-primary)] text-[var(--btn-text)] px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  <RefreshCw
                    size={18}
                    className={isRetrying ? 'animate-spin' : 'group-hover:rotate-90 transition-transform duration-300'}
                  />
                  {isRetrying ? 'Retrying…' : 'Retry Analysis'}
                </button>

                {/* Secondary: Back to Home */}
                <button
                  id="back-to-home-btn"
                  onClick={() => navigate('/')}
                  className="flex-1 flex items-center justify-center gap-2 bg-[var(--bg-secondary)]/70 border border-[var(--border-color)] text-[var(--text-main)] px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base hover:border-[var(--text-brand)] hover:text-[var(--text-brand)] hover:bg-[var(--text-brand)]/5 active:scale-[0.98] transition-all duration-200"
                >
                  <Home size={18} />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom branding accent */}
        <div className="flex items-center justify-center gap-2 mt-6 text-[var(--text-muted)]">
          <Leaf size={14} className="text-[var(--text-brand)]" />
          <span className="text-xs font-medium tracking-wide">
            Prakriti<span className="text-[var(--text-brand)]">AI</span> · Ancient Wisdom, Modern Care
          </span>
        </div>
      </div>

      {/* ---- Keyframe for pulse rings (injected once) ---- */}
      <style>{`
        @keyframes pulseRing {
          0% {
            transform: scale(0.6);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default AIServiceUnavailable;

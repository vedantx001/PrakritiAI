import React from 'react';
import { Leaf, AlertCircle, ArrowLeft, Sparkles, Wind, Flame, Droplets } from 'lucide-react';

const DEFAULT_EXAMPLES = [
  {
    icon: Wind,
    iconWrapClass: 'bg-orange-50 text-orange-500',
    text: '"I have trouble sleeping, dry skin, and feel anxious."',
    hint: '(Vata symptoms)',
  },
  {
    icon: Flame,
    iconWrapClass: 'bg-red-50 text-red-500',
    text: '"Acid reflux, feeling easily irritated, and acne."',
    hint: '(Pitta symptoms)',
  },
  {
    icon: Droplets,
    iconWrapClass: 'bg-sky-50 text-sky-500',
    text: '"Heaviness, excess mucus, and low energy."',
    hint: '(Kapha symptoms)',
  },
];

export default function InvalidSymptomsFallback({
  onReturn,
  message,
  examples,
}) {
  const normalizedExamples = Array.isArray(examples)
    ? examples
        .map((x) => (typeof x === 'string' ? x.trim() : ''))
        .filter(Boolean)
    : [];

  const cards = normalizedExamples.length
    ? normalizedExamples.slice(0, 3).map((text, idx) => {
        const preset = DEFAULT_EXAMPLES[idx] || DEFAULT_EXAMPLES[0];
        return {
          ...preset,
          text: `"${text.replace(/^"|"$/g, '')}"`,
          hint: '',
        };
      })
    : DEFAULT_EXAMPLES;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      {/* Main Content Card */}
      <div className="relative bg-white/80 backdrop-blur-md max-w-2xl w-full rounded-[2rem] shadow-xl border border-white/40 p-8 sm:p-12 text-center z-10">
        
        {/* Icon Header */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm mx-auto">
            <AlertCircle className="text-emerald-600 w-12 h-12" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
            <Leaf className="text-emerald-500 w-5 h-5" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-800 mb-4 tracking-tight">
          We couldn't read your energy.
        </h1>
        
        <p className="text-stone-600 text-lg sm:text-xl mb-8 leading-relaxed max-w-lg mx-auto">
          {message || "In Ayurveda, clarity is the first step to healing. Our AI needs specific physical or mental symptoms to determine your Dosha imbalance and recommend the right remedies."}
        </p>

        {/* Examples Section */}
        <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-left border border-stone-100 shadow-inner">
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4 text-center">
            Try describing how you feel:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {cards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-stone-100">
                  <div className={`${item.iconWrapClass} p-2 rounded-lg shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-sm text-stone-600">
                    {item.text}{' '}
                    {item.hint ? (
                      <span className="text-xs text-stone-400 block mt-1">{item.hint}</span>
                    ) : null}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onReturn}
            className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Return to Consultation
          </button>
        </div>

      </div>

      {/* Footer hint */}
      <p className="text-stone-400 text-sm mt-8 flex items-center gap-2 z-10">
        <Sparkles size={14} /> AI-Powered Ayurvedic Analysis
      </p>
    </div>
  );
}
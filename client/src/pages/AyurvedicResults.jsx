import React from 'react';
import { 
  Leaf, Moon, Sun, Heart, AlertCircle, Coffee, 
  Brain, Info, Droplet, Sparkles, Activity, ShieldCheck 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

/**
 * DATA CONSTANT
 * This represents the structured response your backend would return.
 * I have added high-quality placeholder images for the herbs.
 */
const ANALYSIS_DATA = {
  condition: "Anidra (Insomnia)",
  dosha_profile: {
    primary: ["Vata", "Pitta"],
    secondary: ["Kapha"]
  },
  herbal_remedies: [
    {
      name: "Ashwagandha (Withania somnifera)",
      usage: "Take as a powder/tablet in the evening with warm milk or water (as tolerated).",
      primary_action: "Nervine tonic; reduces stress and supports restful sleep",
      dosha_effect: ["Pacifies Vata", "Supports Pitta"],
      contraindications: ["Autoimmune Diseases", "Thyroid Disorders"],
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Brahmi (Bacopa monnieri)",
      usage: "Take as Brahmi tea/extract in the evening; can be combined with warm water.",
      primary_action: "Calms the mind and supports sleep quality",
      dosha_effect: ["Pacifies Pitta", "Supports Vata"],
      contraindications: ["Heart Conditions", "Thyroid Disorders", "Gastrointestinal Issues", "Respiratory Conditions"],
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Jatamansi (Nardostachys jatamansi)",
      usage: "Take at bedtime with warm water (commonly used for restlessness).",
      primary_action: "Promotes relaxation; helps with restlessness and anxious thoughts",
      dosha_effect: ["Pacifies Vata", "Pacifies Pitta"],
      contraindications: ["Heavy Menstrual Periods"],
      image: "/public/jatamansi.jpg"
    },
    {
      name: "Tagara (Valeriana wallichii)",
      usage: "Take in the evening/at bedtime as a tea or capsule per label guidance.",
      primary_action: "Supports sleep initiation and reduces nervous agitation",
      dosha_effect: ["Pacifies Vata"],
      contraindications: ["Liver Disorders", "Not for children (without medical supervision)"],
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Shankhpushpi (Convolvulus pluricaulis)",
      usage: "Take as syrup/powder in the evening; can be paired with warm water.",
      primary_action: "Supports mental calmness and improves sleep quality",
      dosha_effect: ["Pacifies Pitta", "Supports Vata"],
      contraindications: ["Allergic Reactions"],
      image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Sarpagandha (Rauwolfia serpentina)",
      usage: "Use only under medical supervision (commonly used in specific cases like hypertension-related restlessness).",
      primary_action: "Promotes relaxation; may support sleep in select cases",
      dosha_effect: ["Pacifies Vata", "Pacifies Pitta"],
      contraindications: ["Digestive Issues", "Mental Health Conditions"],
      image: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&q=80&w=800"
    }
  ],
  therapies: [
    {
      name: "Abhyanga (Oil Massage)",
      description: "A calming full-body oil massage (often sesame for Vata, coconut for Pitta) to relax the nervous system."
    },
    {
      name: "Shirodhara",
      description: "A steady stream of warm herbal oil on the forehead to support deep relaxation and sleep quality (performed by a trained therapist)."
    },
    {
      name: "Pada Abhyanga (Foot Massage)",
      description: "Gentle foot massage with warm oil at bedtime to calm Vata and promote sleep onset."
    }
  ],
  dietary_tips: [
    "Consume warm, light meals in the evening",
    "Avoid caffeine and heavy foods at night",
    "Prefer warm milk with a pinch of nutmeg (if suitable)"
  ],
  lifestyle_tips: [
    "Maintain a fixed sleep and wake schedule",
    "Avoid screens at least one hour before bedtime",
    "Practice deep breathing or meditation before sleep",
    "Engage in calming wind-down activities (reading, soft music)"
  ],
  safety_notes: [
    "If sleep issues persist for a long duration, consult a healthcare professional",
    "Always check by your end before using remedies especially if you have underlying health conditions or are on medications",
    "Keep certain herbs away from children. Always consult a pediatrician before giving any herbal remedies to children.",
    "Make sure to check your family history for any allergies to herbs mentioned"
  ]
};

export const AyurvedicResultsContent = ({ data = ANALYSIS_DATA }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* 1. HEADER & DOSHA PROFILE */}
      <section className="animate-fade-in grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[var(--bg-secondary)] rounded-3xl p-8 border border-[var(--border-color)] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[var(--text-brand)] mb-2 font-medium">
              <Sparkles size={18} />
              <span>Analysis Complete</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-[var(--text-main)]">
              {data.condition}
            </h1>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-xl">
              Based on your symptoms, we have generated a personalized Ayurvedic protocol focusing on pacifying Vata and Pitta to restore natural sleep rhythms.
            </p>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-[var(--text-brand)] opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border-color)] shadow-sm flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-main)]">
            <Activity className="h-5 w-5 text-[var(--text-brand)]" />
            Dosha Imbalance
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Primary</span>
                <span className="text-xs text-[var(--text-brand)] bg-[var(--bg-secondary)] px-2 py-1 rounded-full">Dominant</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.dosha_profile.primary.map((dosha) => (
                  <span key={dosha} className="px-4 py-2 bg-[var(--text-brand)] text-[var(--btn-text)] rounded-lg font-semibold shadow-sm">
                    {dosha}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Secondary</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.dosha_profile.secondary.map((dosha) => (
                  <span key={dosha} className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-brand)] border border-[var(--text-brand)]/20 rounded-lg font-medium">
                    {dosha}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HERBAL REMEDIES GRID */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-brand)]">
            <Leaf size={24} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Recommended Herbs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.herbal_remedies.map((herb, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-sm hover:shadow-xl hover:border-[var(--text-brand)]/30 transition-all duration-300"
            >
              {/* Image Header */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={herb.image} 
                  alt={herb.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-white font-bold text-lg leading-tight shadow-sm">
                    {herb.name.split('(')[0]}
                  </h3>
                  <p className="text-white/80 text-xs italic mt-1">
                    {herb.name.match(/\((.*?)\)/)?.[1] || herb.name}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                {/* Primary Action */}
                <div>
                   <span className="text-xs font-bold text-[var(--text-brand)] uppercase tracking-wide">Primary Action</span>
                   <p className="text-[var(--text-main)] text-sm mt-1 leading-snug">{herb.primary_action}</p>
                </div>

                {/* Usage Box */}
                <div className="bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 flex items-center gap-1">
                    <Coffee size={12} /> Usage
                  </p>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">{herb.usage}</p>
                </div>
                
                {/* Dosha Badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {herb.dosha_effect.map((effect, i) => (
                    <span key={i} className="text-[10px] py-1 px-2 rounded-md bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] font-medium">
                      {effect}
                    </span>
                  ))}
                </div>

                {/* Contraindications Warning */}
                {herb.contraindications.length > 0 && (
                  <div className="pt-3 border-t border-[var(--border-color)] mt-2">
                    <div className="flex items-start gap-2 text-xs text-red-500 dark:text-red-400">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span className="font-medium">Avoid if: {herb.contraindications.join(", ")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THERAPIES & LIFESTYLE (Two Column Layout) */}
      <section className="grid lg:grid-cols-2 gap-8">
        
        {/* Therapies Column */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[var(--bg-secondary)] text-[var(--text-brand)] rounded-lg border border-[var(--border-color)]">
              <Droplet size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-main)]">Therapies</h2>
          </div>
          
          <div className="space-y-6">
            {data.therapies.map((therapy, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--text-brand)] text-white flex items-center justify-center font-bold shadow-md">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-main)] text-lg">{therapy.name}</h4>
                  <p className="text-[var(--text-muted)] text-sm mt-1 leading-relaxed">
                    {therapy.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle & Diet Column */}
        <div className="space-y-8">
          
          {/* Diet */}
          <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--bg-card)] text-[var(--text-brand)] rounded-lg border border-[var(--border-color)]">
                <Heart size={20} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-main)]">Dietary Habits</h3>
            </div>
            <ul className="space-y-3">
              {data.dietary_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text-main)]">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--text-brand)] shrink-0"></span>
                  <span className="text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lifestyle */}
          <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--bg-secondary)] text-[var(--text-brand)] rounded-lg border border-[var(--border-color)]">
                <Brain size={20} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-main)]">Lifestyle Rituals</h3>
            </div>
            <ul className="space-y-3">
              {data.lifestyle_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text-main)]">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--text-brand)] shrink-0"></span>
                  <span className="text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </section>

      {/* 4. SAFETY DISCLAIMER */}
      <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="p-3 bg-[var(--bg-card)] rounded-full text-[var(--text-brand)] border border-[var(--border-color)] shrink-0">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Safety First</h3>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
            {data.safety_notes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <Info size={14} className="mt-1 shrink-0 opacity-70" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

const AyurvedicResultsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  let data = location?.state?.resultsData;

  if (!data) {
    try {
      const stored = sessionStorage.getItem('demoAyurvedicResults');
      if (stored) {
        data = JSON.parse(stored);
      }
    } catch {
      data = null;
    }
  }

  data = data || ANALYSIS_DATA;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-300 font-sans pb-20">

        {/* --- NAVBAR --- */}
        <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-[var(--text-brand)]" />
              <span className="font-bold text-xl tracking-tight">Prakriti<span className="text-[var(--text-brand)]">AI</span> - Ayurvedic Results</span>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </nav>

        <AyurvedicResultsContent data={data} />
    </div>
  );
};

export default AyurvedicResultsPage;
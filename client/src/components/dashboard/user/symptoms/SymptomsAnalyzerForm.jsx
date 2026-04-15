import React from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Activity,
  Moon,
  Droplets,
  Wind,
  Info,
  ChevronDown,
  Thermometer,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { COMMON_CONCERNS, DURATION_OPTIONS } from '../../../../pages/dashboard/user/data/symptomsAnalyzerData';

const concernIconMap = {
  'Digestion Issues': <Activity className="w-4 h-4" />,
  Insomnia: <Moon className="w-4 h-4" />,
  'Skin Rash': <Sparkles className="w-4 h-4" />,
  'High Stress': <Wind className="w-4 h-4" />,
  'Joint Pain': <Droplets className="w-4 h-4" />,
};

const SymptomsAnalyzerForm = ({ formData, handleInputChange, setFormData, onAnalyze }) => (
  <section className="relative w-full bg-[var(--bg-primary)] py-6 sm:py-8 lg:py-12 transition-colors duration-300 min-h-[calc(100vh-4rem)] flex flex-col">
    <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
      <div className="absolute top-[-12%] right-[-8%] w-[520px] h-[520px] bg-emerald-100/50 dark:bg-emerald-900/25 rounded-full blur-3xl lg:w-[800px] lg:h-[800px]" />
      <div className="absolute bottom-[-14%] left-[-8%] w-[560px] h-[560px] bg-teal-100/50 dark:bg-teal-900/25 rounded-full blur-3xl lg:w-[800px] lg:h-[800px]" />
      <div className="absolute top-[15%] left-[15%] w-[380px] h-[380px] bg-emerald-100/30 dark:bg-emerald-900/15 rounded-full blur-3xl lg:w-[600px] lg:h-[600px]" />
    </div>

    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
        <header className="md:col-span-5 lg:col-span-4 md:sticky md:top-24">
          <div className="rounded-3xl p-[1px] bg-gradient-to-b from-emerald-500/25 via-teal-500/10 to-transparent dark:from-emerald-400/15 dark:via-teal-400/10">
            <div className="rounded-3xl bg-[var(--bg-card)]/80 backdrop-blur-2xl border border-[var(--border-color)] p-6 sm:p-8 shadow-[var(--shadow-soft)]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-emerald-200/70 dark:border-emerald-800">
                <Sparkles size={14} /> AI Health Assistant
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-main)] tracking-tight leading-tight">
                Symptom Analyzer
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[var(--text-muted)] max-w-prose leading-relaxed">
                Describe your condition in detail. We&apos;ll generate a personalized Ayurvedic health report for you based on ancient principles.
              </p>
            </div>
          </div>
        </header>

        <div className="md:col-span-7 lg:col-span-8">
          <div className="relative bg-[var(--bg-card)]/90 backdrop-blur-2xl border border-[var(--border-color)] rounded-3xl shadow-xl overflow-hidden transition-colors duration-300">
            <div className="h-1.5 w-full bg-[var(--bg-secondary)]">
              <div className="h-full w-1/4 bg-[var(--text-brand)] rounded-r-full" />
            </div>

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-emerald-200/20 dark:bg-emerald-500/10 blur-3xl lg:h-96 lg:w-96" />
            </div>

            <div className="p-6 sm:p-8 lg:p-10 relative">
              <form onSubmit={onAnalyze} className="space-y-8 lg:space-y-10">
                <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-primary)]/55 backdrop-blur-xl p-5 sm:p-6 lg:p-8 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] mb-6 sm:mb-8 flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                    <div className="p-2 bg-[var(--bg-secondary)] rounded-xl">
                      <Activity size={20} className="text-[var(--text-brand)]" />
                    </div>
                    Primary Symptoms
                  </h3>

                  <div className="space-y-6 lg:space-y-8">
                    <div>
                      <label htmlFor="symptoms" className="block text-sm sm:text-base font-semibold text-[var(--text-main)] mb-2.5">
                        What are you feeling? <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 text-[var(--text-muted)] group-focus-within:text-[var(--text-brand)] transition-colors">
                          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <input
                          id="symptoms"
                          name="symptoms"
                          type="text"
                          value={formData.symptoms}
                          onChange={handleInputChange}
                          placeholder="e.g. Severe headache on left side with nausea..."
                          required
                          className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3.5 sm:py-4 pl-12 sm:pl-14 pr-4 text-base sm:text-lg text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all shadow-sm"
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                        {COMMON_CONCERNS.map((item, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, symptoms: item }))}
                            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-full text-[var(--text-muted)] text-xs sm:text-sm font-medium hover:border-[var(--text-brand)] hover:text-[var(--text-brand)] hover:bg-[var(--text-brand)]/5 transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            {concernIconMap[item]}
                            <span className="whitespace-nowrap">{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                      <div>
                        <label className="block text-sm sm:text-base font-semibold text-[var(--text-main)] mb-2.5 flex items-center gap-2">
                          <Clock size={16} className="text-[var(--text-muted)] sm:w-5 sm:h-5" /> Duration
                        </label>
                        <div className="relative">
                          <select
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="w-full appearance-none rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3.5 sm:py-4 px-4 text-base sm:text-lg text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all cursor-pointer shadow-sm"
                          >
                            {DURATION_OPTIONS.map((durationOption) => (
                              <option key={durationOption}>{durationOption}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3 text-sm sm:text-base font-semibold text-[var(--text-main)]">
                          <label className="flex items-center gap-2">
                            <Thermometer size={16} className="text-[var(--text-muted)] sm:w-5 sm:h-5" /> Severity
                          </label>
                          <span className="text-sm font-bold text-[var(--text-brand)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-lg border border-[var(--border-color)] shadow-sm">
                            {formData.severity}/10
                          </span>
                        </div>
                        <div className="relative pt-2">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            name="severity"
                            value={formData.severity}
                            onChange={handleInputChange}
                            className="w-full h-2 sm:h-2.5 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--text-brand)]"
                          />
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm text-[var(--text-muted)] mt-2 font-medium">
                          <span>Mild</span>
                          <span>Severe</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-primary)]/55 backdrop-blur-xl p-5 sm:p-6 lg:p-8 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] mb-6 sm:mb-8 flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                    <div className="p-2 bg-[var(--bg-secondary)] rounded-xl">
                      <Info size={20} className="text-[var(--text-brand)]" />
                    </div>
                    Context
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                    <div>
                      <label htmlFor="age" className="block text-sm sm:text-base font-semibold text-[var(--text-main)] mb-2.5">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. 28"
                        className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3.5 sm:py-4 px-4 text-base sm:text-lg text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm sm:text-base font-semibold text-[var(--text-main)] mb-2.5">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className="w-full appearance-none rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3.5 sm:py-4 px-4 text-base sm:text-lg text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all cursor-pointer shadow-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-[var(--text-main)] mb-2.5">
                      Additional Notes <span className="text-[var(--text-muted)] font-normal text-sm ml-1">(Optional)</span>
                    </label>
                    <textarea
                      name="additional_details"
                      rows={3}
                      value={formData.additional_details}
                      onChange={handleInputChange}
                      placeholder="Any allergies, current medications, or specific triggers..."
                      className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-4 px-4 text-base sm:text-lg text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all resize-y shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start shadow-sm">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-muted)] flex-shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    <strong className="text-[var(--text-main)]">Privacy Note:</strong> Your health data is processed securely and is only used to generate your personalized Ayurvedic report. It will never be shared.
                  </p>
                </div>

                <div className="pt-2 sm:pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[var(--btn-primary)] text-[var(--btn-text)] px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-emerald-500/25 w-full md:w-auto justify-center group"
                  >
                    <Sparkles size={20} className="group-hover:animate-pulse" />
                    <span>Analyze Symptoms</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default SymptomsAnalyzerForm;
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
  <section className="relative w-full bg-[var(--bg-primary)] py-4 md:py-6 transition-colors duration-300">
    <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
      <div className="absolute top-[-12%] right-[-8%] w-[520px] h-[520px] bg-emerald-100/50 dark:bg-emerald-900/25 rounded-full blur-3xl" />
      <div className="absolute bottom-[-14%] left-[-8%] w-[560px] h-[560px] bg-teal-100/50 dark:bg-teal-900/25 rounded-full blur-3xl" />
      <div className="absolute top-[15%] left-[15%] w-[380px] h-[380px] bg-emerald-100/30 dark:bg-emerald-900/15 rounded-full blur-3xl" />
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        <header className="lg:col-span-4 lg:sticky lg:top-6">
          <div className="rounded-3xl p-[1px] bg-gradient-to-b from-emerald-500/25 via-teal-500/10 to-transparent dark:from-emerald-400/15 dark:via-teal-400/10">
            <div className="rounded-3xl bg-[var(--bg-card)]/70 backdrop-blur-xl border border-[var(--border-color)] p-6 md:p-7 shadow-[var(--shadow-soft)]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200/70 dark:border-emerald-800">
                <Sparkles size={12} /> AI Health Assistant
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
                Symptom Analyzer
              </h1>
              <p className="mt-3 text-base md:text-lg text-[var(--text-muted)] max-w-prose">
                Describe your condition in detail. We&apos;ll generate a personalized Ayurvedic health report for you.
              </p>
            </div>
          </div>
        </header>

        <div className="lg:col-span-8">
          <div className="relative bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-color)] rounded-3xl shadow-[var(--shadow-soft)] overflow-hidden transition-colors duration-300">
            <div className="h-1.5 w-full bg-[var(--bg-secondary)]">
              <div className="h-full w-1/4 bg-[var(--text-brand)]" />
            </div>

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-emerald-200/25 dark:bg-emerald-500/10 blur-3xl" />
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              <form onSubmit={onAnalyze} className="space-y-8">
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/55 backdrop-blur-xl p-5 md:p-6">
                  <h3 className="text-lg font-bold text-[var(--text-main)] mb-6 flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                    <Activity size={20} className="text-[var(--text-brand)]" />
                    Primary Symptoms
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="symptoms" className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                        What are you feeling? <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute top-3.5 left-4 text-[var(--text-muted)] group-focus-within:text-[var(--text-brand)] transition-colors">
                          <Search className="w-5 h-5" />
                        </div>
                        <input
                          id="symptoms"
                          name="symptoms"
                          type="text"
                          value={formData.symptoms}
                          onChange={handleInputChange}
                          placeholder="e.g. Severe headache on left side with nausea..."
                          required
                          className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all shadow-sm"
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {COMMON_CONCERNS.map((item, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, symptoms: item }))}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-secondary)]/80 border border-[var(--border-color)] rounded-full text-[var(--text-muted)] text-xs font-medium hover:border-[var(--text-brand)] hover:text-[var(--text-brand)] hover:bg-[var(--bg-primary)]/70 transition-colors cursor-pointer"
                          >
                            {concernIconMap[item]}
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-main)] mb-2 flex items-center gap-2">
                          <Clock size={16} className="text-[var(--text-muted)]" /> Duration
                        </label>
                        <div className="relative">
                          <select
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="w-full appearance-none rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3 px-4 text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all cursor-pointer shadow-sm"
                          >
                            {DURATION_OPTIONS.map((durationOption) => (
                              <option key={durationOption}>{durationOption}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-3">
                          <label className="block text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                            <Thermometer size={16} className="text-[var(--text-muted)]" /> Severity
                          </label>
                          <span className="text-sm font-bold text-[var(--text-brand)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                            {formData.severity}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          name="severity"
                          value={formData.severity}
                          onChange={handleInputChange}
                          className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--text-brand)]"
                        />
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2 font-medium">
                          <span>Mild Discomfort</span>
                          <span>Severe Pain</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/55 backdrop-blur-xl p-5 md:p-6">
                  <h3 className="text-lg font-bold text-[var(--text-main)] mb-6 flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                    <Info size={20} className="text-[var(--text-brand)]" />
                    Context
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-[var(--text-main)] mb-2">Age <span className="text-red-500">*</span></label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 28"
                    className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3 px-4 text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-[var(--text-main)] mb-2">Gender <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full appearance-none rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3 px-4 text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all cursor-pointer shadow-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                  </div>
                </div>
              </div>

                  <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">Additional Notes</label>
                <textarea
                  name="additional_details"
                  rows={3}
                  value={formData.additional_details}
                  onChange={handleInputChange}
                  placeholder="Any allergies, current medications, or specific triggers we should know about..."
                  className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 py-3 px-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-[var(--text-brand)] transition-all resize-y shadow-sm"
                />
              </div>
            </div>

                <div className="bg-[var(--bg-secondary)]/80 border border-[var(--border-color)] rounded-2xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-muted)]">
                    <strong>Privacy Note:</strong> Your health data is processed securely and is only used to generate your personalized Ayurvedic report.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[var(--btn-primary)] text-[var(--btn-text)] px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-emerald-500/20 w-full md:w-auto justify-center"
                  >
                    <Sparkles size={20} />
                    <span>Analyze Symptoms</span>
                    <ArrowRight size={20} />
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
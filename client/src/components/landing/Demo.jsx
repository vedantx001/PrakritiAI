import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Activity,
  Moon,
  Sun,
  Droplets,
  Wind,
  ChevronDown,
  Thermometer,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeSymptoms } from '../../services/aiService';
import { mapAiReportToAyurvedicResultsData } from '../../utils/ayurvedicResultsMapper';
import { DURATION_OPTIONS } from '../../pages/dashboard/user/data/symptomsAnalyzerData';

const Symptoms = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [invalidExamples, setInvalidExamples] = useState([]);
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '1-3 days',
    severity: 5,
    age: '',
    gender: '',
    additional_details: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    setError('');
    setInvalidExamples([]);

    if (!formData.symptoms) {
      setError('Please enter your symptoms.');
      return;
    }

    const age = Number(formData.age);
    if (!Number.isFinite(age) || age <= 0) {
      setError('Please enter a valid age.');
      return;
    }

    const gender = String(formData.gender || '').trim().toLowerCase();
    if (!gender) {
      setError('Please select your gender.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const payload = await analyzeSymptoms({
        symptoms: formData.symptoms,
        age,
        gender,
        duration: formData.duration,
        severity: Number(formData.severity),
        additional_details: formData.additional_details,
      });

      const mapped = mapAiReportToAyurvedicResultsData(payload?.result);

      try {
        sessionStorage.setItem('demoAyurvedicResults', JSON.stringify(mapped));
      } catch {
        // ignore storage errors
      }

      navigate('/ayurvedic-results', {
        state: {
          resultsData: mapped,
          source: 'demo',
        },
      });
    } catch (err) {
      if (err?.code === 'INVALID_SYMPTOMS') {
        setInvalidExamples(Array.isArray(err.examples) ? err.examples : []);
        setError(err?.message || 'Please describe your symptoms more clearly.');
        return;
      }

      setError(err?.message || 'Failed to analyze symptoms');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const commonConcerns = [
    { label: 'Digestion Issues', icon: <Activity className="w-4 h-4" /> },
    { label: 'Sleep & Insomnia', icon: <Moon className="w-4 h-4" /> },
    { label: 'Skin Care', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Stress & Anxiety', icon: <Wind className="w-4 h-4" /> },
    { label: 'Hair Fall', icon: <Droplets className="w-4 h-4" /> },
  ];

  return (
    <section id="symptoms" className="relative w-full py-24 bg-[var(--bg-primary)] overflow-hidden">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-teal-100/50 rounded-full blur-3xl" />
        <div className="absolute top-[20%] left-[10%] w-12 h-12 bg-emerald-200/20 rounded-full animate-float-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main Glass Container */}
        <div className="relative bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-[2rem] p-6 sm:p-8 lg:p-14 text-center overflow-hidden">
          
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>

          {/* Heading Section */}
          <div className="max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] mb-4 tracking-tight">
              What seems to be the trouble?
            </h2>
            <p className="text-lg text-[var(--text-muted)]">
              Enter your details below. Our AI analyzes Ayurvedic patterns to suggest suitable <span className="text-emerald-700 font-medium">Herbal Remedies</span> for you.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-3xl mx-auto mb-10 text-left">
            <form
              onSubmit={handleAnalyze}
              className="bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--border-color)] shadow-sm p-5 md:p-6 transition-all duration-300 hover:border-emerald-300"
            >
              {error ? (
                <div className="mb-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm text-red-600 dark:text-red-400 flex gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{error}</div>
                    {invalidExamples.length ? (
                      <div className="mt-2 text-[var(--text-muted)]">
                        Try examples:
                        <ul className="list-disc pl-5 mt-1 space-y-0.5">
                          {invalidExamples.slice(0, 6).map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <label htmlFor="symptoms" className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                    Symptoms *
                  </label>
                  <div className="flex items-center bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100/60 transition-all">
                    <div className="pl-4 text-emerald-500">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      id="symptoms"
                      name="symptoms"
                      type="text"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      placeholder="e.g. Poor sleep, acidity, and dry cough"
                      required
                      minLength={3}
                      maxLength={1000}
                      className="w-full py-3 px-3 text-[var(--text-main)] bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-main)] mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--text-muted)]" /> Duration
                  </label>
                  <div className="relative">
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-3 px-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-100/60 focus:border-emerald-500 transition-all"
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-[var(--text-muted)]" /> Severity
                    </label>
                    <span className="text-sm font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/25 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800">
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
                    className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2 font-medium">
                    <span>Mild</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                    Age *
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 25"
                    required
                    min={1}
                    max={129}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-3 px-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-100/60 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-3 px-4 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-100/60 focus:border-emerald-500 transition-all"
                  >
                    <option value="" className="text-[var(--text-muted)]">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label htmlFor="additional_details" className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                    Additional Details
                  </label>
                  <textarea
                    id="additional_details"
                    name="additional_details"
                    value={formData.additional_details}
                    onChange={handleInputChange}
                    placeholder="Optional: duration, severity, triggers, digestion/sleep pattern, etc."
                    rows={4}
                    maxLength={2000}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-3 px-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-100/60 focus:border-emerald-500 transition-all resize-y"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 active:scale-95 transition-all duration-200 shadow-md shadow-emerald-200 cursor-pointer"
                >
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Categories / Pills */}
          <div className="hidden md:flex flex-col items-center [@media(max-height:500px)]:!hidden">
            <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
              Common Concerns
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {commonConcerns.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setFormData((prev) => ({ ...prev, symptoms: item.label }))}
                  className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-[var(--text-muted)] text-sm font-medium hover:border-emerald-400 hover:text-emerald-700 hover:bg-[var(--bg-secondary)] hover:shadow-sm transition-all duration-200 active:scale-95"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Symptoms;
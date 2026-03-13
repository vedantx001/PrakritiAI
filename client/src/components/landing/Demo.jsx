import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, Activity, Moon, Sun, Droplets, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Symptoms = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    gender: '',
    additional_details: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    navigate('/ayurvedic-results');
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

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Main Glass Container */}
        <div className="relative bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-[2rem] p-8 md:p-14 text-center overflow-hidden">
          
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
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
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 active:scale-95 transition-all duration-200 shadow-md shadow-emerald-200 cursor-pointer"
                >
                  <span>Analyze</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Categories / Pills */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
              Common Concerns
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {commonConcerns.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setFormData((prev) => ({ ...prev, symptoms: item.label }))}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-[var(--text-muted)] text-sm font-medium hover:border-emerald-400 hover:text-emerald-700 hover:bg-[var(--bg-secondary)] hover:shadow-sm transition-all duration-200 active:scale-95"
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
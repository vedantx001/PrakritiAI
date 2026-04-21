import React, { useState, useEffect } from 'react';
import SymptomsThemeStyles from '../../../components/dashboard/user/symptoms/SymptomsThemeStyles';
import SymptomsAnalyzerLoading from '../../../components/dashboard/user/symptoms/SymptomsAnalyzerLoading';
import SymptomsAnalyzerForm from '../../../components/dashboard/user/symptoms/SymptomsAnalyzerForm';
import InvalidSymptomsFallback from '../../../components/dashboard/user/symptoms/InvalidSymptomsFallback';
import { AyurvedicResultsContent } from '../../AyurvedicResults';
import { analyzeSymptoms } from '../../../services/aiService';
import { mapAiReportToAyurvedicResultsData } from '../../../utils/ayurvedicResultsMapper';
import { useAuth } from '../../../context/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

const SymptomsAnalyzer = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [error, setError] = useState('');
  const [invalidExamples, setInvalidExamples] = useState([]);
  const [showInvalidFallback, setShowInvalidFallback] = useState(false);

  const MIN_ANALYSIS_MS = 2500;

  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '1-3 days',
    severity: 5,
    age: user?.age ?? '',
    gender: user?.gender ?? '',
    additional_details: '',
  });

  useEffect(() => {
    // Keep form in sync when profile loads/refreshes.
    setFormData((prev) => ({
      ...prev,
      age: prev.age || user?.age || '',
      gender: prev.gender || user?.gender || '',
    }));
  }, [user?.age, user?.gender]);

  useEffect(() => {
    const state = location.state;
    if (!state) return;

    if (state?.resultsData) {
      setResultsData(state.resultsData);
      setShowResults(true);
      setError('');
      setShowInvalidFallback(false);
      setInvalidExamples([]);
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    if (state?.invalidExamples?.length) {
      setInvalidExamples(state.invalidExamples);
      setShowInvalidFallback(true);
      setError('');
      setShowResults(false);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    setError('');
    setShowInvalidFallback(false);
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

    const startedAt = Date.now();

    try {
      const payload = await analyzeSymptoms(
        {
          symptoms: formData.symptoms,
          age,
          gender,
          duration: formData.duration,
          severity: Number(formData.severity),
          additional_details: formData.additional_details,
        },
        { token }
      );

      const mapped = mapAiReportToAyurvedicResultsData(payload?.result);

      const elapsed = Date.now() - startedAt;
      const remaining = MIN_ANALYSIS_MS - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setResultsData(mapped);
      setShowResults(true);
    } catch (err) {
      const elapsed = Date.now() - startedAt;
      const remaining = MIN_ANALYSIS_MS - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      if (err?.code === 'INVALID_SYMPTOMS') {
        setInvalidExamples(Array.isArray(err.examples) ? err.examples : []);
        setShowInvalidFallback(true);
        return;
      }

      if (err?.code === 'AI_UNAVAILABLE') {
        navigate('/ai-service-unavailable', {
          state: {
            mode: 'dashboard',
            input: {
              symptoms: formData.symptoms,
              age,
              gender,
              duration: formData.duration,
              severity: Number(formData.severity),
              additional_details: formData.additional_details,
            },
            token,
            returnTo: '/dashboard/user/symptoms-analyzer',
          },
        });
        return;
      }

      setError(err?.message || 'Failed to analyze symptoms');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <>
        <SymptomsThemeStyles />
        <SymptomsAnalyzerLoading />
      </>
    );
  }

  if (showResults) {
    return (
      <>
        <SymptomsThemeStyles />
        <AyurvedicResultsContent data={resultsData || undefined} />
      </>
    );
  }

  if (showInvalidFallback) {
    return (
      <>
        <SymptomsThemeStyles />
        <InvalidSymptomsFallback
          examples={invalidExamples}
          onReturn={() => {
            setShowInvalidFallback(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <SymptomsThemeStyles />
      {error ? (
        <div className="px-6 pt-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm text-red-500 dark:text-red-400">
            {error}
          </div>
        </div>
      ) : null}
      <SymptomsAnalyzerForm
        formData={formData}
        handleInputChange={handleInputChange}
        setFormData={setFormData}
        onAnalyze={handleAnalyze}
      />
    </>
  );
};

export default SymptomsAnalyzer;
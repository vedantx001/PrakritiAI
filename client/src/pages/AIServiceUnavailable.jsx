import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AIServiceUnavailable from '../components/shared/AIServiceUnavailable';
import { analyzeSymptoms } from '../services/aiService';
import { mapAiReportToAyurvedicResultsData } from '../utils/ayurvedicResultsMapper';

const AIServiceUnavailablePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const mode = state?.mode; // 'demo' | 'dashboard'
  const input = state?.input;
  const token = state?.token;
  const returnTo = state?.returnTo || '/';

  const onRetry = async () => {
    if (!input) {
      navigate(returnTo, { replace: true });
      return;
    }

    try {
      const payload = await analyzeSymptoms(input, token ? { token } : undefined);
      const mapped = mapAiReportToAyurvedicResultsData(payload?.result);

      if (mode === 'dashboard') {
        navigate('/dashboard/user/symptoms-analyzer', {
          replace: true,
          state: {
            resultsData: mapped,
            source: 'ai-retry',
          },
        });
        return;
      }

      // Demo / public flow
      navigate('/ayurvedic-results', {
        replace: true,
        state: {
          resultsData: mapped,
          source: mode || 'demo',
        },
      });
    } catch (err) {
      // Keep the user on this page; the component will auto-retry.
      // If auth expired, send user to login.
      if (err?.status === 401 || err?.status === 403) {
        navigate('/auth/login', { replace: true });
      }
    }
  };

  return <AIServiceUnavailable onRetry={onRetry} />;
};

export default AIServiceUnavailablePage;

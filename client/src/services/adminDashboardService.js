const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizedBaseUrl = String(API_BASE_URL || '').trim().replace(/\/+$/, '');

const buildUrl = (path) => {
  const normalizedPath = String(path || '');
  if (!normalizedBaseUrl) return normalizedPath;
  return `${normalizedBaseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

const request = async (path, { method = 'GET', token, body } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
};

export const getAdminDashboardSummary = async ({ token }) =>
  request('/api/admin/dashboard/summary', {
    method: 'GET',
    token,
  });

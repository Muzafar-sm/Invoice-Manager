// Shared API base URL - use local proxy in dev, production URL when built
export const getApiBase = () => {
  if (import.meta.env.DEV) return '/api';
  const url = import.meta.env.VITE_API_URL || '/api';
  return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
};

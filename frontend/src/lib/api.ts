const raw = import.meta.env.VITE_API_URL ?? '';

// Never send requests to localhost from a production build — it triggers the
// Chrome Private Network Access (PNA) permission prompt on real users' browsers.
const isLocalhost = raw.includes('localhost') || raw.includes('127.0.0.1');
const isBuild = !import.meta.env.DEV;

export const API_BASE = isLocalhost && isBuild ? '' : raw || (import.meta.env.DEV ? 'http://localhost:3001' : '');

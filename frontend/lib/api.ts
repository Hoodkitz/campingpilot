import { API_BASE } from './types';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const resp = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({ detail: 'Unbekannter Fehler' }));
    throw new Error(error.detail || `HTTP ${resp.status}`);
  }
  if (resp.status === 204) {
    return undefined as T;
  }
  return resp.json();
}

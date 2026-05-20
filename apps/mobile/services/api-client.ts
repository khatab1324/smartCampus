import Constants from 'expo-constants';

function getExpoHost() {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0] || null;
}

function getApiBaseUrl() {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const expoHost = getExpoHost();
  const baseUrl = configuredBaseUrl.replace(/\/+$/, '');

  if (expoHost && baseUrl.includes('localhost')) {
    return baseUrl.replace('localhost', expoHost);
  }

  return baseUrl;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  idToken?: string
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  if (idToken) {
    headers.set('Authorization', `Bearer ${idToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(`Cannot reach the backend at ${baseUrl}.`);
  }

  const payload = (await response.json().catch(() => null)) as
    | { data?: T; message?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  return (payload?.data ?? null) as T;
}

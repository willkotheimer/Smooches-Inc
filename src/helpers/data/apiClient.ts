// Express API base (MERN). Used by the imperative auth bootstrap in <App>.
const baseUrl = import.meta.env.VITE_API_BASE_URL;

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Thin fetch wrapper around the Firebase REST API (replaces axios). */
export async function apiRequest<T>(
  endpoint: string,
  method: Method = 'GET',
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

import { useCallback } from 'react';

// Express API base (MERN). e.g. http://localhost:4000/api
const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface RequestOptions {
  successMessage?: string;
  errorMessage?: string;
}

export function useAPIRequest() {
  const get = useCallback(async <T>(url: string): Promise<T> => {
    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return (await response.json()) as T;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }, []);

  const send = useCallback(
    async <T>(
      method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      url: string,
      body?: unknown,
      options?: RequestOptions,
    ): Promise<T> => {
      try {
        const response = await fetch(`${baseUrl}${url}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });
        if (!response.ok) {
          throw new Error(options?.errorMessage || 'Network response was not ok');
        }
        const result =
          response.status === 204 ? ({} as T) : ((await response.json()) as T);
        if (options?.successMessage) {
          console.log(options.successMessage);
        }
        return result;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    [],
  );

  const post = useCallback(
    <T>(url: string, body?: unknown, options?: RequestOptions) => send<T>('POST', url, body, options),
    [send],
  );
  const put = useCallback(
    <T>(url: string, body?: unknown, options?: RequestOptions) => send<T>('PUT', url, body, options),
    [send],
  );
  const patch = useCallback(
    <T>(url: string, body?: unknown, options?: RequestOptions) =>
      send<T>('PATCH', url, body, options),
    [send],
  );
  const del = useCallback(
    <T>(url: string, options?: RequestOptions) => send<T>('DELETE', url, undefined, options),
    [send],
  );

  return { get, post, put, patch, del };
}

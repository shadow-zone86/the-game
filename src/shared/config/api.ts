export const API_BASE = 'https://dev-space.su/api/v1';

type FetchFn = typeof fetch;

/** Fetch-функция для API (можно подменить в тестах или при SSR) */
export function getFetchFn(): FetchFn {
  return typeof window !== 'undefined' ? window.fetch.bind(window) : fetch;
}

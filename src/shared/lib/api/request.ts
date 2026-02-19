type FetchFn = typeof fetch;

interface ApiErrorBody {
  err?: string;
}

export async function apiRequest<T>(
  fetchFn: FetchFn,
  baseUrl: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl}${path}`;
  const res = await fetchFn(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = (data as ApiErrorBody).err ?? res.statusText ?? 'Ошибка запроса';
    throw new Error(err);
  }

  return data as T;
}

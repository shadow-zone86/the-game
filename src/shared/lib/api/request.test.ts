import { describe, it, expect, vi } from 'vitest';
import { apiRequest } from './request';

function createMockFetch(resolve: { ok: boolean; data: unknown }) {
  return vi.fn().mockResolvedValue({
    ok: resolve.ok,
    json: () => Promise.resolve(resolve.data),
  });
}

describe('apiRequest', () => {
  const BASE = 'https://api.example.com';

  it('возвращает данные при res.ok', async () => {
    const mockData = { id: 1, name: 'test' };
    const fetchFn = createMockFetch({ ok: true, data: mockData });

    const result = await apiRequest(fetchFn, BASE, '/path');

    expect(result).toEqual(mockData);
    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.example.com/path',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('передаёт options в fetch (method, body)', async () => {
    const fetchFn = createMockFetch({ ok: true, data: {} });

    await apiRequest(fetchFn, BASE, '/path', {
      method: 'POST',
      body: JSON.stringify({ x: 1 }),
    });

    expect(fetchFn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: '{"x":1}',
      })
    );
  });

  it('бросает ошибку с data.err при res.ok = false', async () => {
    const fetchFn = createMockFetch({
      ok: false,
      data: { err: 'Insufficient funds' },
    });

    await expect(apiRequest(fetchFn, BASE, '/path')).rejects.toThrow(
      'Insufficient funds'
    );
  });

  it('бросает ошибку с res.statusText при отсутствии data.err', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      json: () => Promise.resolve({}),
    });

    await expect(apiRequest(fetchFn, BASE, '/path')).rejects.toThrow(
      'Not Found'
    );
  });

  it('бросает "Ошибка запроса" при пустом data.err и statusText undefined', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      statusText: undefined,
      json: () => Promise.resolve({}),
    });

    await expect(apiRequest(fetchFn, BASE, '/path')).rejects.toThrow(
      'Ошибка запроса'
    );
  });

  it('пробрасывает ошибку при reject fetch', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(apiRequest(fetchFn, BASE, '/path')).rejects.toThrow(
      'Network error'
    );
  });
});

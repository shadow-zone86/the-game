import { describe, it, expect, vi } from 'vitest';
import { createUpdateBalanceService } from './updateBalanceService';
import type { DevicePlaceApi } from '../model/types';

function createMockFetch(resolve: { ok: boolean; data: unknown }) {
  return vi.fn().mockResolvedValue({
    ok: resolve.ok,
    json: () => Promise.resolve(resolve.data),
  });
}

describe('createUpdateBalanceService', () => {
  const BASE = 'https://api.example.com';

  it('update вызывает POST с deviceId, placeId и body', async () => {
    const mockPlace: DevicePlaceApi = {
      place: 1,
      device_id: 10,
      balances: 1500,
      currency: 'RUB',
    };
    const fetchFn = createMockFetch({ ok: true, data: mockPlace });
    const service = createUpdateBalanceService(fetchFn, BASE);

    const result = await service.update('10', 1, { delta: 500 });

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.example.com/a/devices/10/place/1/update',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ delta: 500 }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
    expect(result).toEqual(mockPlace);
  });

  it('update с delta 0 (снятие)', async () => {
    const mockPlace: DevicePlaceApi = {
      place: 2,
      device_id: 5,
      balances: 0,
      currency: 'RUB',
    };
    const fetchFn = createMockFetch({ ok: true, data: mockPlace });
    const service = createUpdateBalanceService(fetchFn, BASE);

    const result = await service.update('5', 2, { delta: -100 });

    expect(fetchFn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: JSON.stringify({ delta: -100 }) })
    );
    expect(result.balances).toBe(0);
  });

  it('update пробрасывает ошибку при res.ok = false', async () => {
    const fetchFn = createMockFetch({
      ok: false,
      data: { err: 'Insufficient funds' },
    });
    const service = createUpdateBalanceService(fetchFn, BASE);

    await expect(
      service.update('1', 1, { delta: -9999 })
    ).rejects.toThrow('Insufficient funds');
  });

  it('update пробрасывает ошибку при reject fetch', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
    const service = createUpdateBalanceService(fetchFn, BASE);

    await expect(
      service.update('1', 1, { delta: 100 })
    ).rejects.toThrow('Network error');
  });
});

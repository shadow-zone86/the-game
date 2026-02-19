import { describe, it, expect, vi } from 'vitest';
import { createGetDevicesService } from './getDevicesService';
import type { DeviceApi } from '../model/types';

function createMockFetch(resolve: { ok: boolean; data: unknown }) {
  return vi.fn().mockResolvedValue({
    ok: resolve.ok,
    json: () => Promise.resolve(resolve.data),
  });
}

describe('createGetDevicesService', () => {
  const BASE = 'https://api.example.com';

  it('get вызывает fetch с верным URL', async () => {
    const mockDevices: DeviceApi[] = [
      { id: 1, name: 'Device A' },
      { id: 2, name: 'Device B' },
    ];
    const fetchFn = createMockFetch({ ok: true, data: mockDevices });
    const service = createGetDevicesService(fetchFn, BASE);

    const result = await service.get();

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.example.com/a/devices/',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
    expect(result).toEqual(mockDevices);
  });

  it('get возвращает пустой массив', async () => {
    const fetchFn = createMockFetch({ ok: true, data: [] });
    const service = createGetDevicesService(fetchFn, BASE);

    const result = await service.get();

    expect(result).toEqual([]);
  });

  it('get пробрасывает ошибку при res.ok = false', async () => {
    const fetchFn = createMockFetch({ ok: false, data: { err: 'Unauthorized' } });
    const service = createGetDevicesService(fetchFn, BASE);

    await expect(service.get()).rejects.toThrow('Unauthorized');
  });

  it('get пробрасывает ошибку при reject fetch', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
    const service = createGetDevicesService(fetchFn, BASE);

    await expect(service.get()).rejects.toThrow('Network error');
  });
});

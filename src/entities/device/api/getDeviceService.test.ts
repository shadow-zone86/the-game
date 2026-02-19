import { describe, it, expect, vi } from 'vitest';
import { createGetDeviceService } from './getDeviceService';
import type { DeviceApi } from '../model/types';

function createMockFetch(resolve: { ok: boolean; data: unknown }) {
  return vi.fn().mockResolvedValue({
    ok: resolve.ok,
    json: () => Promise.resolve(resolve.data),
  });
}

describe('createGetDeviceService', () => {
  const BASE = 'https://api.example.com';

  it('get вызывает fetch с deviceId в URL', async () => {
    const mockDevice: DeviceApi = {
      id: 42,
      name: 'Device X',
      places: [{ place: 1, device_id: 42, balances: 1000, currency: 'RUB' }],
    };
    const fetchFn = createMockFetch({ ok: true, data: mockDevice });
    const service = createGetDeviceService(fetchFn, BASE);

    const result = await service.get('42');

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.example.com/a/devices/42/',
      expect.any(Object)
    );
    expect(result).toEqual(mockDevice);
  });

  it('get эскейпит deviceId в URL', async () => {
    const mockDevice: DeviceApi = { id: 1, name: 'A' };
    const fetchFn = createMockFetch({ ok: true, data: mockDevice });
    const service = createGetDeviceService(fetchFn, BASE);

    await service.get('a/b');

    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.example.com/a/devices/a%2Fb/',
      expect.any(Object)
    );
  });

  it('get пробрасывает ошибку при res.ok = false', async () => {
    const fetchFn = createMockFetch({ ok: false, data: { err: 'Not found' } });
    const service = createGetDeviceService(fetchFn, BASE);

    await expect(service.get('999')).rejects.toThrow('Not found');
  });

  it('get пробрасывает ошибку при reject fetch', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
    const service = createGetDeviceService(fetchFn, BASE);

    await expect(service.get('1')).rejects.toThrow('Network error');
  });
});

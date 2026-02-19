import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API_BASE } from '@/shared/config/api';

const mockCreateGetDevicesService = vi.fn();
const mockCreateGetDeviceService = vi.fn();
const mockCreateUpdateBalanceService = vi.fn();

vi.mock('../../api', () => ({
  createGetDevicesService: (fetchFn: unknown, baseUrl: string) => {
    mockCreateGetDevicesService(fetchFn, baseUrl);
    return { get: vi.fn().mockResolvedValue([]) };
  },
  createGetDeviceService: (fetchFn: unknown, baseUrl: string) => {
    mockCreateGetDeviceService(fetchFn, baseUrl);
    return { get: vi.fn().mockResolvedValue({ id: 1, name: 'D', places: [] }) };
  },
  createUpdateBalanceService: (fetchFn: unknown, baseUrl: string) => {
    mockCreateUpdateBalanceService(fetchFn, baseUrl);
    return {
      update: vi.fn().mockResolvedValue({
        place: 1,
        device_id: 1,
        balances: 0,
        currency: 'RUB',
      }),
    };
  },
}));

describe('deviceServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('создаёт сервисы с fetch и API_BASE', async () => {
    const { getDevicesService, getDeviceService, updateBalanceService } =
      await import('./deviceServices');

    expect(mockCreateGetDevicesService).toHaveBeenCalledWith(
      expect.any(Function),
      API_BASE
    );
    expect(mockCreateGetDeviceService).toHaveBeenCalledWith(
      expect.any(Function),
      API_BASE
    );
    expect(mockCreateUpdateBalanceService).toHaveBeenCalledWith(
      expect.any(Function),
      API_BASE
    );

    expect(getDevicesService.get).toBeDefined();
    expect(getDeviceService.get).toBeDefined();
    expect(updateBalanceService.update).toBeDefined();
  });

  it('getDevicesService.get() возвращает результат фабрики', async () => {
    const { getDevicesService } = await import('./deviceServices');
    const result = await getDevicesService.get();
    expect(result).toEqual([]);
  });
});

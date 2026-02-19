import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeviceQuery } from './useDeviceQuery';
import type { DeviceApi } from '../../model/types';

const mockDeviceApi: DeviceApi = {
  id: 42,
  name: 'Device X',
  places: [{ place: 1, device_id: 42, balances: 1000, currency: 'RUB' }],
};

const mockGet = vi.fn();

vi.mock('./deviceServices', () => ({
  getDeviceService: {
    get: (id: string) => mockGet(id),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useDeviceQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockResolvedValue(mockDeviceApi);
  });

  it('не запрашивает данные при deviceId = null', async () => {
    const { result } = renderHook(() => useDeviceQuery(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('возвращает замапленный device при переданном deviceId', async () => {
    const { result } = renderHook(() => useDeviceQuery('42'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe(42);
    expect(result.current.data?.name).toBe('Device X');
    expect(result.current.data?.places).toHaveLength(1);
    expect(result.current.data?.places?.[0].formattedBalance).toBe('10.00');
    expect(mockGet).toHaveBeenCalledWith('42');
  });

  it('возвращает error при ошибке сервиса', async () => {
    mockGet.mockRejectedValueOnce(new Error('Not found'));

    const { result } = renderHook(() => useDeviceQuery('999'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect((result.current.error as Error).message).toBe('Not found');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDevicesQuery } from './useDevicesQuery';
import type { DeviceApi } from '../../model/types';

const mockDevicesApi: DeviceApi[] = [
  { id: 1, name: 'Device A' },
  { id: 2, name: 'Device B', places: [] },
];

const mockGet = vi.fn();

vi.mock('./deviceServices', () => ({
  getDevicesService: {
    get: () => mockGet(),
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

describe('useDevicesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockResolvedValue(mockDevicesApi);
  });

  it('возвращает замапленные DTO после успешной загрузки', async () => {
    const { result } = renderHook(() => useDevicesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0]).toEqual({
      id: 1,
      name: 'Device A',
      places: [],
    });
    expect(result.current.data?.[1]).toEqual({
      id: 2,
      name: 'Device B',
      places: [],
    });
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('возвращает error при ошибке сервиса', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useDevicesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => expect(result.current.isError).toBe(true),
      { timeout: 3000 }
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('Network error');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateBalanceMutation } from './useUpdateBalanceMutation';

const mockUpdate = vi.fn();

vi.mock('./deviceServices', () => ({
  updateBalanceService: {
    update: (
      deviceId: string,
      placeId: number,
      body: { delta: number }
    ) => mockUpdate(deviceId, placeId, body),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useUpdateBalanceMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockResolvedValue({
      place: 1,
      device_id: 10,
      balances: 1500,
      currency: 'RUB',
    });
  });

  it('вызывает updateBalanceService.update с deviceId, placeId и delta', async () => {
    const { result } = renderHook(() => useUpdateBalanceMutation('10'), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ placeId: 1, delta: 500 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockUpdate).toHaveBeenCalledWith('10', 1, { delta: 500 });
  });

  it('при успехе инвалидирует кэш (invalidateQueries вызывается)', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }

    const { result } = renderHook(() => useUpdateBalanceMutation('10'), {
      wrapper: Wrapper,
    });

    result.current.mutate({ placeId: 1, delta: 100 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalled();
  });
});

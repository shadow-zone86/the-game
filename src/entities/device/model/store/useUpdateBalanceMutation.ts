import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBalanceService } from './deviceServices';
import { deviceQueryKey } from './useDeviceQuery';
import { devicesQueryKey } from './useDevicesQuery';

export function useUpdateBalanceMutation(deviceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      placeId,
      delta,
    }: {
      placeId: number;
      delta: number;
    }) => {
      if (!deviceId) {
        throw new Error('deviceId is required for balance update');
      }
      return updateBalanceService.update(deviceId, placeId, { delta });
    },
    onSuccess: () => {
      if (deviceId) {
        queryClient.invalidateQueries({ queryKey: deviceQueryKey(deviceId) });
      }
      queryClient.invalidateQueries({ queryKey: devicesQueryKey });
    },
  });
}

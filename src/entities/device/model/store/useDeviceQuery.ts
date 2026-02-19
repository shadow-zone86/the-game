import { useQuery } from '@tanstack/react-query';
import { getDeviceService } from './deviceServices';
import { mapDeviceApiToStoreDto } from '../../lib/mappers';

export function deviceQueryKey(deviceId: string | null) {
  return ['device', deviceId] as const;
}

export function useDeviceQuery(deviceId: string | null) {
  return useQuery({
    queryKey: deviceQueryKey(deviceId),
    queryFn: async () => {
      if (!deviceId) throw new Error('No deviceId');
      const api = await getDeviceService.get(deviceId);
      return mapDeviceApiToStoreDto(api);
    },
    enabled: !!deviceId,
  });
}

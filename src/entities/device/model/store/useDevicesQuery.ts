import { useQuery } from '@tanstack/react-query';
import { getDevicesService } from './deviceServices';
import { mapDevicesApiToStoreDto } from '../../lib/mappers';

export const devicesQueryKey = ['devices'] as const;

export function useDevicesQuery() {
  return useQuery({
    queryKey: devicesQueryKey,
    queryFn: async () => {
      const api = await getDevicesService.get();
      return mapDevicesApiToStoreDto(api);
    },
    retry: 1,
  });
}

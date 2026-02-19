import { apiRequest } from '@/shared/lib/api/request';
import type {
  DevicePlaceApi,
  ModBalanceRequestApi,
  IUpdateBalanceService,
} from '../model/types';

type FetchFn = typeof fetch;

export function createUpdateBalanceService(
  fetchFn: FetchFn,
  baseUrl: string
): IUpdateBalanceService {
  return {
    async update(
      deviceId: string,
      placeId: number,
      body: ModBalanceRequestApi
    ): Promise<DevicePlaceApi> {
      return apiRequest<DevicePlaceApi>(
        fetchFn,
        baseUrl,
        `/a/devices/${encodeURIComponent(deviceId)}/place/${placeId}/update`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        }
      );
    },
  };
}

import { apiRequest } from '@/shared/lib/api/request';
import type { DeviceApi, IGetDeviceService } from '../model/types';

type FetchFn = typeof fetch;

export function createGetDeviceService(
  fetchFn: FetchFn,
  baseUrl: string
): IGetDeviceService {
  return {
    async get(deviceId: string): Promise<DeviceApi> {
      return apiRequest<DeviceApi>(
        fetchFn,
        baseUrl,
        `/a/devices/${encodeURIComponent(deviceId)}/`
      );
    },
  };
}

import { apiRequest } from '@/shared/lib/api/request';
import type { DeviceApi, IGetDevicesService } from '../model/types';

type FetchFn = typeof fetch;

export function createGetDevicesService(
  fetchFn: FetchFn,
  baseUrl: string
): IGetDevicesService {
  return {
    async get(): Promise<DeviceApi[]> {
      return apiRequest<DeviceApi[]>(fetchFn, baseUrl, '/a/devices/');
    },
  };
}

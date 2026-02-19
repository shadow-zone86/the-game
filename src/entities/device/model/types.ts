/**
 * API-типы (контракт с бэкендом).
 * Swagger: https://dev-space.su/swagger/index.html
 */

export interface DevicePlaceApi {
  place: number;
  device_id: number;
  balances: number;
  currency: string;
}

export interface DeviceApi {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  places?: DevicePlaceApi[];
}

export interface ModBalanceRequestApi {
  delta: number;
}

export interface WebErrorApi {
  err: string;
  data?: Record<string, unknown>;
}

export interface IGetDevicesService {
  get(): Promise<DeviceApi[]>;
}

export interface IGetDeviceService {
  get(deviceId: string): Promise<DeviceApi>;
}

export interface IUpdateBalanceService {
  update(
    deviceId: string,
    placeId: number,
    body: ModBalanceRequestApi
  ): Promise<DevicePlaceApi>;
}

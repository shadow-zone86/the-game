import { describe, it, expect } from 'vitest';
import {
  mapDevicePlaceApiToDtoPublic,
  mapDeviceApiToStoreDto,
  mapDevicesApiToStoreDto,
} from './mapDeviceApiToStoreDto';
import type { DeviceApi, DevicePlaceApi } from '../../model/types';

describe('mapDevicePlaceApiToDtoPublic', () => {
  it('маппит place: device_id → deviceId, balances → formattedBalance', () => {
    const api: DevicePlaceApi = {
      place: 1,
      device_id: 42,
      balances: 1050,
      currency: 'RUB',
    };
    const result = mapDevicePlaceApiToDtoPublic(api);

    expect(result.place).toBe(1);
    expect(result.deviceId).toBe(42);
    expect(result.balances).toBe(1050);
    expect(result.currency).toBe('RUB');
    expect(result.formattedBalance).toBe('10.50');
  });

  it('форматирует баланс 0 как "0.00"', () => {
    const api: DevicePlaceApi = {
      place: 2,
      device_id: 1,
      balances: 0,
      currency: 'USD',
    };
    const result = mapDevicePlaceApiToDtoPublic(api);

    expect(result.formattedBalance).toBe('0.00');
  });
});

describe('mapDeviceApiToStoreDto', () => {
  it('возвращает null для null', () => {
    expect(mapDeviceApiToStoreDto(null)).toBe(null);
  });

  it('возвращает null для undefined', () => {
    expect(mapDeviceApiToStoreDto(undefined)).toBe(null);
  });

  it('маппит device без places', () => {
    const api: DeviceApi = {
      id: 1,
      name: 'Device A',
      created_at: '2024-01-01',
    };
    const result = mapDeviceApiToStoreDto(api);

    expect(result).not.toBe(null);
    expect(result!.id).toBe(1);
    expect(result!.name).toBe('Device A');
    expect(result!.created_at).toBe('2024-01-01');
    expect(result!.places).toEqual([]);
  });

  it('форматирует created_at и updated_at в DD.MM.YYYY и HH:MM:SS', () => {
    const api: DeviceApi = {
      id: 1,
      name: 'Device',
      created_at: '2025-08-29T13:23:57.796Z',
      updated_at: '2025-08-30T09:05:12.000Z',
    };
    const result = mapDeviceApiToStoreDto(api);

    expect(result!.created_at_formatted_date).toBe('29.08.2025');
    expect(result!.created_at_formatted_time).toBe('13:23:57');
    expect(result!.updated_at_formatted_date).toBe('30.08.2025');
    expect(result!.updated_at_formatted_time).toBe('09:05:12');
  });

  it('маппит device с places', () => {
    const api: DeviceApi = {
      id: 10,
      name: 'Device B',
      places: [
        { place: 1, device_id: 10, balances: 1000, currency: 'RUB' },
        { place: 2, device_id: 10, balances: 50, currency: 'RUB' },
      ],
    };
    const result = mapDeviceApiToStoreDto(api);

    expect(result).not.toBe(null);
    expect(result!.places).toHaveLength(2);
    expect(result!.places![0]).toEqual({
      place: 1,
      deviceId: 10,
      balances: 1000,
      currency: 'RUB',
      formattedBalance: '10.00',
    });
    expect(result!.places![1]).toEqual({
      place: 2,
      deviceId: 10,
      balances: 50,
      currency: 'RUB',
      formattedBalance: '0.50',
    });
  });
});

describe('mapDevicesApiToStoreDto', () => {
  it('возвращает пустой массив для null', () => {
    expect(mapDevicesApiToStoreDto(null)).toEqual([]);
  });

  it('возвращает пустой массив для undefined', () => {
    expect(mapDevicesApiToStoreDto(undefined)).toEqual([]);
  });

  it('маппит массив devices', () => {
    const api: DeviceApi[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B', places: [] },
    ];
    const result = mapDevicesApiToStoreDto(api);

    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe(1);
    expect(result[0]!.name).toBe('A');
    expect(result[0]!.places).toEqual([]);
    expect(result[1]!.id).toBe(2);
    expect(result[1]!.name).toBe('B');
    expect(result[1]!.places).toEqual([]);
  });
});

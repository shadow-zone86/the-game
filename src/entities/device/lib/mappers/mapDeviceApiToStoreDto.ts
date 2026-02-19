import { MINOR_UNITS } from '@/shared/config/constants';
import { formatIsoToDate, formatIsoToTime } from '@/shared/lib/formatter';
import type { DevicePlaceApi, DeviceApi } from '../../model/types';
import type { DevicePlaceDto, DeviceDto } from '../../model/types.dto';

function mapDevicePlaceApiToDto(api: DevicePlaceApi): DevicePlaceDto {
  return {
    place: api.place,
    deviceId: api.device_id,
    balances: api.balances,
    currency: api.currency,
    formattedBalance: (api.balances / MINOR_UNITS).toFixed(2)
  };
}

export function mapDevicePlaceApiToDtoPublic(
  api: DevicePlaceApi
): DevicePlaceDto {
  return mapDevicePlaceApiToDto(api);
}

export function mapDeviceApiToStoreDto(
  api: DeviceApi | null | undefined
): DeviceDto | null {
  if (!api) return null;
  return {
    id: api.id,
    name: api.name,
    created_at: api.created_at,
    updated_at: api.updated_at,
    created_at_formatted_date: formatIsoToDate(api.created_at),
    created_at_formatted_time: formatIsoToTime(api.created_at),
    updated_at_formatted_date: formatIsoToDate(api.updated_at),
    updated_at_formatted_time: formatIsoToTime(api.updated_at),
    places: api.places?.map(mapDevicePlaceApiToDto) ?? [],
  };
}

export function mapDevicesApiToStoreDto(
  api: DeviceApi[] | null | undefined
): DeviceDto[] {
  if (!api) return [];
  return api.map((d) => mapDeviceApiToStoreDto(d)!);
}

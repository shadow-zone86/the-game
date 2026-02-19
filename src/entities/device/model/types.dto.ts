/**
 * DTO для store и UI.
 */

export interface DevicePlaceDto {
  place: number;
  deviceId: number;
  balances: number;
  currency: string;
  formattedBalance: string;
}

export interface DeviceDto {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  created_at_formatted_date?: string;
  created_at_formatted_time?: string;
  updated_at_formatted_date?: string;
  updated_at_formatted_time?: string;
  places?: DevicePlaceDto[];
}

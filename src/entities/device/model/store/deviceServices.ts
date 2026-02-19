/**
 * Инстансы сервисов для работы с API.
 * Создаются один раз при загрузке модуля.
 */
import {
  createGetDevicesService,
  createGetDeviceService,
  createUpdateBalanceService,
} from '../../api';
import { API_BASE, getFetchFn } from '@/shared/config/api';

const fetchFn = getFetchFn();

export const getDevicesService = createGetDevicesService(fetchFn, API_BASE);
export const getDeviceService = createGetDeviceService(fetchFn, API_BASE);
export const updateBalanceService = createUpdateBalanceService(
  fetchFn,
  API_BASE
);

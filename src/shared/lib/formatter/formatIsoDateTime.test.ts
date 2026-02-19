import { describe, it, expect } from 'vitest';
import { formatIsoToDate, formatIsoToTime } from './formatIsoDateTime';

describe('formatIsoToDate', () => {
  it('форматирует ISO-строку в DD.MM.YYYY (UTC)', () => {
    expect(formatIsoToDate('2025-08-29T13:23:57.796Z')).toBe('29.08.2025');
    expect(formatIsoToDate('2024-01-01T00:00:00.000Z')).toBe('01.01.2024');
  });

  it('дополняет нулями день и месяц', () => {
    expect(formatIsoToDate('2024-03-05T12:00:00Z')).toBe('05.03.2024');
  });

  it('возвращает undefined для undefined и пустой строки', () => {
    expect(formatIsoToDate(undefined)).toBeUndefined();
    expect(formatIsoToDate('')).toBeUndefined();
  });

  it('возвращает undefined для невалидной даты', () => {
    expect(formatIsoToDate('invalid')).toBeUndefined();
  });
});

describe('formatIsoToTime', () => {
  it('форматирует ISO-строку в HH:MM:SS (UTC)', () => {
    expect(formatIsoToTime('2025-08-29T13:23:57.796Z')).toBe('13:23:57');
    expect(formatIsoToTime('2024-01-01T00:00:00.000Z')).toBe('00:00:00');
  });

  it('дополняет нулями часы, минуты и секунды', () => {
    expect(formatIsoToTime('2024-03-05T09:05:03Z')).toBe('09:05:03');
  });

  it('возвращает undefined для undefined и пустой строки', () => {
    expect(formatIsoToTime(undefined)).toBeUndefined();
    expect(formatIsoToTime('')).toBeUndefined();
  });

  it('возвращает undefined для невалидной даты', () => {
    expect(formatIsoToTime('invalid')).toBeUndefined();
  });
});

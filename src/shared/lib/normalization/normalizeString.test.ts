import { describe, it, expect } from 'vitest';
import { normalizeString } from './normalizeString';

describe('normalizeString', () => {
  it('возвращает строку в нижнем регистре и без пробелов по краям', () => {
    expect(normalizeString('  Москва  ')).toBe('москва');
    expect(normalizeString('Санкт-Петербург')).toBe('санкт-петербург');
    expect(normalizeString('  UPPERCASE  ')).toBe('uppercase');
  });

  it('возвращает пустую строку для пустой строки и строки из пробелов', () => {
    expect(normalizeString('')).toBe('');
    expect(normalizeString('   ')).toBe('');
    expect(normalizeString('\t\n')).toBe('');
  });

  it('возвращает undefined для нестроковых значений', () => {
    expect(normalizeString(null)).toBeUndefined();
    expect(normalizeString(undefined)).toBeUndefined();
    expect(normalizeString(123)).toBeUndefined();
    expect(normalizeString(true)).toBeUndefined();
    expect(normalizeString({})).toBeUndefined();
    expect(normalizeString([])).toBeUndefined();
  });
});

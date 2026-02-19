import { describe, it, expect } from 'vitest';
import {
  getErrorMessage,
  getErrorMessageOrFallback,
} from './getErrorMessage';

describe('getErrorMessage', () => {
  it('возвращает message из Error', () => {
    expect(getErrorMessage(new Error('Ошибка сети'))).toBe('Ошибка сети');
    expect(getErrorMessage(new Error(''))).toBe('');
  });

  it('возвращает строку как есть', () => {
    expect(getErrorMessage('Текст ошибки')).toBe('Текст ошибки');
  });

  it('возвращает fallback для неизвестных типов', () => {
    expect(getErrorMessage(null)).toBe('Неизвестная ошибка');
    expect(getErrorMessage(undefined)).toBe('Неизвестная ошибка');
    expect(getErrorMessage(42)).toBe('Неизвестная ошибка');
    expect(getErrorMessage({})).toBe('Неизвестная ошибка');
  });

  it('использует кастомный fallback', () => {
    expect(getErrorMessage(null, 'Ошибка')).toBe('Ошибка');
    expect(getErrorMessage(undefined, 'Загрузка не удалась')).toBe(
      'Загрузка не удалась'
    );
  });
});

describe('getErrorMessageOrFallback', () => {
  it('возвращает message из Error', () => {
    expect(getErrorMessageOrFallback(new Error('Ошибка'), 'Fallback')).toBe(
      'Ошибка'
    );
  });

  it('возвращает fallback для строки', () => {
    expect(getErrorMessageOrFallback('Текст', 'Fallback')).toBe('Fallback');
  });

  it('возвращает fallback для неизвестных типов', () => {
    expect(getErrorMessageOrFallback(null, 'Fallback')).toBe('Fallback');
    expect(getErrorMessageOrFallback(42, 'Ошибка')).toBe('Ошибка');
  });
});

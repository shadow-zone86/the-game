import { describe, it, expect } from 'vitest';
import {
  isValidBalanceInput,
  parseAmountToMinor,
  getBalanceValidationError,
} from './balanceValidation';

describe('isValidBalanceInput', () => {
  it('возвращает true для валидных сумм', () => {
    expect(isValidBalanceInput('100')).toBe(true);
    expect(isValidBalanceInput('100.50')).toBe(true);
    expect(isValidBalanceInput('0')).toBe(true);
    expect(isValidBalanceInput('0.01')).toBe(true);
    expect(isValidBalanceInput('999.99')).toBe(true);
    expect(isValidBalanceInput(' 100.50 ')).toBe(true);
  });

  it('возвращает false для пустой строки и точки', () => {
    expect(isValidBalanceInput('')).toBe(false);
    expect(isValidBalanceInput('.')).toBe(false);
    expect(isValidBalanceInput('  ')).toBe(false);
    expect(isValidBalanceInput(' . ')).toBe(false);
  });

  it('возвращает false при более 2 знаков после запятой', () => {
    expect(isValidBalanceInput('100.567')).toBe(false);
    expect(isValidBalanceInput('10.123')).toBe(false);
  });

  it('возвращает false для нечисловых и отрицательных значений', () => {
    expect(isValidBalanceInput('abc')).toBe(false);
    expect(isValidBalanceInput('-100')).toBe(false);
    expect(isValidBalanceInput('100.50.50')).toBe(false);
    expect(isValidBalanceInput('1,000')).toBe(false);
  });
});

describe('parseAmountToMinor', () => {
  it('конвертирует сумму в минорные единицы (×100)', () => {
    expect(parseAmountToMinor('100')).toBe(10000);
    expect(parseAmountToMinor('100.50')).toBe(10050);
    expect(parseAmountToMinor('0.01')).toBe(1);
    expect(parseAmountToMinor('10.99')).toBe(1099);
  });

  it('возвращает null для невалидного ввода', () => {
    expect(parseAmountToMinor('')).toBe(null);
    expect(parseAmountToMinor('.')).toBe(null);
    expect(parseAmountToMinor('abc')).toBe(null);
  });

  it('поддерживает кастомный multiplier', () => {
    expect(parseAmountToMinor('10', 1000)).toBe(10000);
    expect(parseAmountToMinor('1.5', 10)).toBe(15);
  });
});

describe('getBalanceValidationError', () => {
  it('возвращает null для пустой строки', () => {
    expect(getBalanceValidationError('')).toBe(null);
    expect(getBalanceValidationError('  ')).toBe(null);
  });

  it('возвращает сообщение для одной точки', () => {
    expect(getBalanceValidationError('.')).toBe(
      'Введите число, например 100 или 100.50'
    );
  });

  it('возвращает сообщение для недопустимых символов', () => {
    expect(getBalanceValidationError('100a')).toBe(
      'Допустимы только цифры и одна точка'
    );
  });

  it('возвращает сообщение для более 2 знаков после запятой', () => {
    expect(getBalanceValidationError('100.567')).toBe(
      'Допустимо не более 2 знаков после запятой (например, 100.50)'
    );
  });

  it('минус отсекается как недопустимый символ до проверки знака', () => {
    expect(getBalanceValidationError('-50')).toBe(
      'Допустимы только цифры и одна точка'
    );
  });

  it('возвращает null для валидного ввода', () => {
    expect(getBalanceValidationError('100')).toBe(null);
    expect(getBalanceValidationError('100.50')).toBe(null);
  });
});

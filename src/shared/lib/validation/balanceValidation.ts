/**
 * Валидация сумм для финансовых операций.
 *
 * Почему ограничение до 2 знаков после запятой важно в финансовых приложениях:
 * 1. Соответствие реальным валютам — в подавляющем большинстве валют (рубли, доллары, евро)
 *    минимальная единица — 2 знака (копейки, центы). Больше знаков не имеют смысла при отображении
 *    и ведут к путанице и ошибкам округления.
 * 2. Избежание ошибок округления — при хранении в целых единицах (например, копейки) дробные
 *    значения вроде 10.567 создают неоднозначность (округлять вверх/вниз/банковское округление),
 *    что в финансах недопустимо и может привести к накоплению погрешностей или судебным спорам.
 * 3. Защита от мошенничества — ограничение формата затрудняет ввод «странных» сумм и упрощает
 *    аудит и сверку операций.
 * 4. UX и предсказуемость — пользователь и система всегда понимают точный размер операции
 *    без двусмысленности.
 */

import {
  BALANCE_DECIMAL_REGEX,
  BALANCE_INVALID_CHARS_REGEX,
  BALANCE_DECIMAL_OVERFLOW_REGEX,
} from '@/shared/config/constants';
import { normalizeString } from '@/shared/lib/normalization';

/** Проверка: строка — неотрицательное число с не более чем 2 знаками после запятой */
export function isValidBalanceInput(value: string): boolean {
  const n = normalizeString(value);
  if (!n || n === '.') return false;
  if (!BALANCE_DECIMAL_REGEX.test(n)) return false;
  const num = parseFloat(n);
  return !Number.isNaN(num) && num >= 0 && Number.isFinite(num);
}

/**
 * Парсит строку ввода в число; возвращает null при невалидном вводе.
 * Для API передаём сумму в «минорных» единицах (копейки): умножаем на 100.
 */
export function parseAmountToMinor(
  value: string,
  minorMultiplier: number = 100
): number | null {
  if (!isValidBalanceInput(value)) return null;
  const major = parseFloat(value);
  const minor = Math.round(major * minorMultiplier);
  return minor;
}

/** Сообщение об ошибке валидации для пользователя */
export function getBalanceValidationError(value: string): string | null {
  const n = normalizeString(value);
  if (!n) return null;
  if (n === '.') return 'Введите число, например 100 или 100.50';
  if (BALANCE_INVALID_CHARS_REGEX.test(n))
    return 'Допустимы только цифры и одна точка';
  if (BALANCE_DECIMAL_OVERFLOW_REGEX.test(n))
    return 'Допустимо не более 2 знаков после запятой (например, 100.50)';
  const num = parseFloat(n);
  if (Number.isNaN(num) || num < 0) return 'Введите неотрицательное число';
  return null;
}

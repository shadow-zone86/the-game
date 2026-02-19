/**
 * Извлекает текст ошибки из unknown значения.
 * @param error — объект ошибки (Error, строка, и т.д.)
 * @param fallback — fallback-сообщение при нераспознанной ошибке
 */
export function getErrorMessage(
  error: unknown,
  fallback: string = 'Неизвестная ошибка'
): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}

/**
 * Для Error возвращает message, иначе — fallback.
 * Используется, когда нужно показывать свой текст для любых не-Error.
 */
export function getErrorMessageOrFallback(
  error: unknown,
  fallback: string
): string {
  return error instanceof Error ? error.message : fallback;
}

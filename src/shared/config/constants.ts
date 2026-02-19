export const MINOR_UNITS = 100;

/** Макс. знаков после запятой для сумм (валидация баланса) */
export const MAX_DECIMAL_PLACES = 2;

export const BALANCE_DECIMAL_REGEX = new RegExp(
  `^\\d+(\\.\\d{1,${MAX_DECIMAL_PLACES}})?$`
);

/** Недопустимые символы в сумме (только цифры и точка) */
export const BALANCE_INVALID_CHARS_REGEX = /[^\d.]/;

/** Более чем MAX_DECIMAL_PLACES знаков после запятой */
export const BALANCE_DECIMAL_OVERFLOW_REGEX = new RegExp(
  `\\.\\d{${MAX_DECIMAL_PLACES + 1},}$`
);

/** Паттерн для фильтрации ввода при наборе суммы (цифры и одна точка) */
export const BALANCE_INPUT_PATTERN = /^\d*\.?\d*$/;

/** Мин. время показа лоадера (мс) — избегаем мигания при быстрой загрузке */
export const MIN_LOADER_MS = 350;

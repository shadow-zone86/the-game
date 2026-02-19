export const MINOR_UNITS = 100;

/** Макс. знаков после запятой для сумм (валидация баланса) */
export const MAX_DECIMAL_PLACES = 2;

export const BALANCE_DECIMAL_REGEX = new RegExp(
  `^\\d+(\\.\\d{1,${MAX_DECIMAL_PLACES}})?$`
);

/** Мин. время показа лоадера (мс) — избегаем мигания при быстрой загрузке */
export const MIN_LOADER_MS = 350;

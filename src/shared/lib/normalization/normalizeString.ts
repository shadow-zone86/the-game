export function normalizeString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value.toLowerCase().trim();
  }
  return undefined;
}

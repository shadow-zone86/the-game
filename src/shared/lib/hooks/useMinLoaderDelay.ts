import { useState, useEffect, useRef } from 'react';

/**
 * Гарантирует минимальное время показа лоадера — избегает мигания при быстрой загрузке.
 * @param isLoading — идёт ли загрузка
 * @param minMs — минимальное время (мс), в течение которого лоадер должен отображаться
 * @returns showContent — true, когда загрузка завершена и прошло достаточно времени
 */
export function useMinLoaderDelay(isLoading: boolean, minMs: number): boolean {
  const [showContent, setShowContent] = useState(false);
  const loadStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      loadStartRef.current = Date.now();
      queueMicrotask(() => setShowContent(false));
    } else {
      const elapsed = loadStartRef.current ? Date.now() - loadStartRef.current : 0;
      const delay = Math.max(0, minMs - elapsed);
      const t = setTimeout(() => setShowContent(true), delay);
      return () => clearTimeout(t);
    }
  }, [isLoading, minMs]);

  return showContent;
}

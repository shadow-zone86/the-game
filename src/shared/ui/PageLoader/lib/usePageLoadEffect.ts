import { useEffect, useState, useRef } from 'react';
import { normalizeString } from '@/shared/lib/normalization';
import {
  FALLBACK_TIMEOUT_MS,
  COMPLETE_DELAY_MS,
  READY_STATE_DELAY_MS,
} from '../config/constants';
import { createProgressAnimator } from './createProgressAnimator';

/**
 * Хук для страничного лоадера: анимация прогресса и ожидание события load.
 */
export function usePageLoadEffect() {
  const [isLoading, setIsLoading] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressEl = progressRef.current;
    if (!progressEl) return;

    const animator = createProgressAnimator(progressEl);
    animator.start();

    let handled = false;
    const handleLoad = (): void => {
      if (handled) return;
      handled = true;
      animator.complete();
      setTimeout(() => setIsLoading(false), COMPLETE_DELAY_MS);
    };

    if (normalizeString(document.readyState) === 'complete') {
      setTimeout(handleLoad, READY_STATE_DELAY_MS);
    } else {
      window.addEventListener('load', handleLoad);
    }

    const fallbackTimeout = setTimeout(handleLoad, FALLBACK_TIMEOUT_MS);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimeout);
      animator.cleanup();
    };
  }, []);

  return { isLoading, progressRef };
}

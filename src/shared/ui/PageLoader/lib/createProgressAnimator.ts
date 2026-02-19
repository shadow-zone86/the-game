import { DURATION_MS, PROGRESS_FROM, PROGRESS_TO } from '../config/constants';

export interface ProgressAnimator {
  start: () => void;
  complete: () => void;
  cleanup: () => void;
}

/**
 * Создаёт аниматор прогресс-бара.
 * Анимация идёт от PROGRESS_FROM до PROGRESS_TO за DURATION_MS.
 */
export function createProgressAnimator(progressEl: HTMLDivElement): ProgressAnimator {
  let startTime: number | null = null;
  let animationFrameId: number | null = null;
  let isComplete = false;

  const animate = (currentTime: number): void => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / DURATION_MS, 1);
    const width = Math.floor(
      progress * (PROGRESS_TO - PROGRESS_FROM) + PROGRESS_FROM
    );
    progressEl.style.width = `${width}%`;

    if (progress < 1 && !isComplete) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  return {
    start() {
      animationFrameId = requestAnimationFrame(animate);
    },
    complete() {
      if (isComplete) return;
      isComplete = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      progressEl.style.width = '100%';
    },
    cleanup() {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },
  };
}

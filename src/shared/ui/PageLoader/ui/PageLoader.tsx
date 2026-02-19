import { useEffect, useState, useRef } from 'react';
import { normalizeString } from '@/shared/lib/normalization';
import {
  LOGO_SRC,
  DURATION_MS,
  PROGRESS_FROM,
  PROGRESS_TO,
  FALLBACK_TIMEOUT_MS,
} from '../config/constants';
import styles from './PageLoader.module.css';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressEl = progressRef.current;
    if (!progressEl) return;

    let startTime: number | null = null;
    let pageLoaded: boolean = false;
    let animationFrameId: number | null = null;

    const animate = (currentTime: number): void => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;

      if (!pageLoaded) {
        const progress = Math.min(elapsed / DURATION_MS, 1);
        const width = Math.floor(
          progress * (PROGRESS_TO - PROGRESS_FROM) + PROGRESS_FROM
        );
        progressEl.style.width = `${width}%`;

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleLoad = (): void => {
      if (pageLoaded) return;
      pageLoaded = true;

      progressEl.style.width = '100%';
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    if (normalizeString(document.readyState) === 'complete') {
      setTimeout(handleLoad, 800);
    } else {
      window.addEventListener('load', handleLoad);
    }

    const fallbackTimeout = setTimeout(handleLoad, FALLBACK_TIMEOUT_MS);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      id="page-loader"
      className={`${styles.pageLoader} ${!isLoading ? styles.pageLoaderHidden : ''}`}
      aria-hidden="true"
    >
      <div className={styles.loadingLogo}>
        <img
          src={LOGO_SRC}
          alt="Loading"
          className={styles.logoBg}
          width={120}
          height={120}
        />
        <div ref={progressRef} className={styles.progress}>
          <img
            src={LOGO_SRC}
            alt="Loading"
            className={styles.logoFg}
            width={120}
            height={120}
          />
        </div>
      </div>
    </div>
  );
}

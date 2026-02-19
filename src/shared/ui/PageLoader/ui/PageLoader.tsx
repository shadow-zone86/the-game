import { LOGO_SRC } from '../config/constants';
import { usePageLoadEffect } from '../lib/usePageLoadEffect';
import styles from './PageLoader.module.css';

export function PageLoader() {
  const { isLoading, progressRef } = usePageLoadEffect();

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

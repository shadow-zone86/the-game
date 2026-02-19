import { Spinner } from 'react-bootstrap';

interface ContentLoaderProps {
  /** Дополнительные классы для контейнера */
  className?: string;
}

/** Центрированный спиннер загрузки для использования в списках, карточках и т.д. */
export function ContentLoader({ className = '' }: ContentLoaderProps) {
  return (
    <div
      className={`d-flex justify-content-center align-items-center p-4 ${className}`.trim()}
      aria-busy="true"
      aria-label="Загрузка"
    >
      <Spinner animation="border" />
    </div>
  );
}

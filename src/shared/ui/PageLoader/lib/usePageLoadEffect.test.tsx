import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { usePageLoadEffect } from './usePageLoadEffect';

const mockAnimator = {
  start: vi.fn(),
  complete: vi.fn(),
  cleanup: vi.fn(),
};

vi.mock('./createProgressAnimator', () => ({
  createProgressAnimator: () => mockAnimator,
}));

function TestPageLoader() {
  const { isLoading, progressRef } = usePageLoadEffect();
  if (!isLoading) return <div data-testid="loaded">loaded</div>;
  return <div ref={progressRef} data-testid="loader">loading</div>;
}

describe('usePageLoadEffect', () => {
  let loadHandler: () => void;
  const addEventListenerSpy = vi.fn((event: string, handler: () => void) => {
    if (event === 'load') loadHandler = handler;
  });
  const removeEventListenerSpy = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    loadHandler = () => {};
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true,
      configurable: true,
    });
    vi.stubGlobal('window', {
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      removeListener: removeEventListenerSpy,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('возвращает isLoading: true изначально и создаёт аниматор', () => {
    render(<TestPageLoader />);

    expect(screen.getByTestId('loader')).toBeTruthy();
    expect(mockAnimator.start).toHaveBeenCalled();
  });

  it('вызывает handleLoad по событию load и скрывает лоадер через COMPLETE_DELAY', () => {
    render(<TestPageLoader />);
    expect(loadHandler).toBeDefined();

    act(() => {
      loadHandler();
    });
    expect(mockAnimator.complete).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('loaded')).toBeTruthy();
  });

  it('вызывает cleanup при размонтировании', () => {
    const { unmount } = render(<TestPageLoader />);
    unmount();
    expect(mockAnimator.cleanup).toHaveBeenCalled();
  });
});

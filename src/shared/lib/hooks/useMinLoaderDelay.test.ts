import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMinLoaderDelay } from './useMinLoaderDelay';

describe('useMinLoaderDelay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('возвращает false при isLoading = true', () => {
    const { result } = renderHook(() => useMinLoaderDelay(true, 100));

    expect(result.current).toBe(false);
  });

  it('возвращает true после завершения загрузки и истечения minMs', () => {
    const { result, rerender } = renderHook(
      ({ isLoading }) => useMinLoaderDelay(isLoading, 100),
      { initialProps: { isLoading: true } }
    );

    expect(result.current).toBe(false);

    rerender({ isLoading: false });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(true);
  });

  it('ждёт оставшееся время, если загрузка была меньше minMs', () => {
    const { result, rerender } = renderHook(
      ({ isLoading }) => useMinLoaderDelay(isLoading, 100),
      { initialProps: { isLoading: true } }
    );

    act(() => {
      vi.advanceTimersByTime(30);
    });
    rerender({ isLoading: false });

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(69);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it('возвращает true сразу при длительной загрузке (elapsed >= minMs)', () => {
    const { result, rerender } = renderHook(
      ({ isLoading }) => useMinLoaderDelay(isLoading, 50),
      { initialProps: { isLoading: true } }
    );

    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ isLoading: false });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe(true);
  });
});

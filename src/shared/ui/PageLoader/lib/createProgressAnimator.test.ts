import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createProgressAnimator } from './createProgressAnimator';

describe('createProgressAnimator', () => {
  let progressEl: HTMLDivElement;
  let rafCallback: (time: number) => void;
  let rafId = 0;

  beforeEach(() => {
    progressEl = document.createElement('div');
    rafId = 0;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: (time: number) => void) => {
        rafCallback = cb;
        return ++rafId;
      })
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('возвращает объект с start, complete, cleanup', () => {
    const animator = createProgressAnimator(progressEl);
    expect(animator).toHaveProperty('start');
    expect(animator).toHaveProperty('complete');
    expect(animator).toHaveProperty('cleanup');
    expect(typeof animator.start).toBe('function');
    expect(typeof animator.complete).toBe('function');
    expect(typeof animator.cleanup).toBe('function');
  });

  it('start вызывает requestAnimationFrame', () => {
    const animator = createProgressAnimator(progressEl);
    animator.start();

    expect(requestAnimationFrame).toHaveBeenCalled();
    expect(typeof rafCallback).toBe('function');
  });

  it('complete устанавливает width 100% и останавливает анимацию', () => {
    const animator = createProgressAnimator(progressEl);
    animator.start();
    rafCallback(100);

    animator.complete();

    expect(progressEl.style.width).toBe('100%');
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it('complete второй раз не делает ничего', () => {
    const animator = createProgressAnimator(progressEl);
    animator.start();
    animator.complete();
    const cancelCalls = (cancelAnimationFrame as ReturnType<typeof vi.fn>).mock
      .calls.length;

    animator.complete();

    expect((cancelAnimationFrame as ReturnType<typeof vi.fn>).mock.calls.length).toBe(
      cancelCalls
    );
  });

  it('cleanup отменяет requestAnimationFrame', () => {
    const animator = createProgressAnimator(progressEl);
    animator.start();

    animator.cleanup();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(rafId);
  });
});

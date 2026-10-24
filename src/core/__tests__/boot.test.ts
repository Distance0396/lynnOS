/* ===== boot.test.ts — BootSequence unit tests ===== */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BootSequence } from '../boot';
import { STORAGE_KEYS } from '../../constants';

describe('BootSequence', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    // jsdom doesn't implement HTMLMediaElement.play — mock it
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined as any);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('shouldSkip', () => {
    it('returns false when boot has not been done', () => {
      // We can't directly call shouldSkip (private), but start() calls it.
      // When not done, start() appends the boot overlay.
      BootSequence.start(() => {});
      expect(document.getElementById('boot-overlay')).not.toBeNull();
    });

    it('skips boot when already done (localStorage flag set)', () => {
      localStorage.setItem(STORAGE_KEYS.bootDone, '1');
      const onComplete = vi.fn();
      BootSequence.start(onComplete);
      // Should call onComplete immediately without overlay
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(document.getElementById('boot-overlay')).toBeNull();
    });
  });

  describe('start', () => {
    it('creates the boot overlay element', () => {
      BootSequence.start(() => {});
      const overlay = document.getElementById('boot-overlay');
      expect(overlay).not.toBeNull();
      expect(overlay?.classList.contains('visible')).toBe(false);
    });

    it('calls onComplete and removes overlay after full boot sequence', () => {
      const onComplete = vi.fn();
      BootSequence.start(onComplete);

      // Advance through boot phase (5200ms) + welcome (2600ms) + loading (1600ms) + fade (500ms)
      vi.advanceTimersByTime(5200);
      vi.advanceTimersByTime(500); // fade
      vi.advanceTimersByTime(2600); // welcome
      vi.advanceTimersByTime(1600); // loading
      vi.advanceTimersByTime(500); // final fade

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(document.getElementById('boot-overlay')).toBeNull();
    });

    it('marks boot as done in localStorage after completion', () => {
      BootSequence.start(() => {});
      vi.advanceTimersByTime(5200);
      vi.advanceTimersByTime(500);
      vi.advanceTimersByTime(2600);
      vi.advanceTimersByTime(1600);
      vi.advanceTimersByTime(500);

      expect(localStorage.getItem(STORAGE_KEYS.bootDone)).toBe('1');
    });
  });
});

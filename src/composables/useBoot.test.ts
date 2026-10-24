// useBoot.test.ts — 开机状态机
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BOOT_TIMING, STORAGE_KEYS } from '../constants';
import { useBoot } from './useBoot';

const { boot: BOOT_MS, welcome: WELCOME_MS, loading: LOADING_MS, fade: FADE_MS } = BOOT_TIMING;

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('full sequence', () => {
  it('walks boot → welcome → loading → fading → done and marks done', () => {
    const { phase } = useBoot();
    expect(phase.value).toBe('boot');

    vi.advanceTimersByTime(BOOT_MS);
    expect(phase.value).toBe('welcome');

    vi.advanceTimersByTime(WELCOME_MS);
    expect(phase.value).toBe('loading');

    vi.advanceTimersByTime(LOADING_MS);
    expect(phase.value).toBe('fading');

    vi.advanceTimersByTime(FADE_MS);
    expect(phase.value).toBe('done');
    expect(localStorage.getItem(STORAGE_KEYS.bootDone)).toBe('1');
  });
});

describe('skip', () => {
  it('is done immediately when the boot flag is set', () => {
    localStorage.setItem(STORAGE_KEYS.bootDone, '1');
    const { phase } = useBoot();
    expect(phase.value).toBe('done');
    vi.advanceTimersByTime(BOOT_MS + WELCOME_MS + LOADING_MS + FADE_MS);
    expect(phase.value).toBe('done');
  });
});

// settings.test.ts — 设置 store 与持久化
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { STORAGE_KEYS } from '../constants';
import { useSettingsStore } from './settings';

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

describe('defaults', () => {
  it('starts with bliss wallpaper, sound off, animations on', () => {
    const store = useSettingsStore();
    expect(store.wallpaper).toBe('bliss');
    expect(store.soundEnabled).toBe(false);
    expect(store.animationsEnabled).toBe(true);
    expect(store.iconsVisible).toBe(true);
  });
});

describe('persistence', () => {
  it('persists on update and restores on a fresh store', () => {
    useSettingsStore().update({ wallpaper: 'hallway', soundEnabled: true });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.settings)!)).toMatchObject({
      wallpaper: 'hallway',
      soundEnabled: true,
    });

    setActivePinia(createPinia());
    const fresh = useSettingsStore();
    expect(fresh.wallpaper).toBe('hallway');
    expect(fresh.soundEnabled).toBe(true);
    expect(fresh.animationsEnabled).toBe(true);
  });

  it('ignores corrupt JSON and invalid wallpaper ids on load', () => {
    localStorage.setItem(STORAGE_KEYS.settings, '{not json');
    setActivePinia(createPinia());
    expect(useSettingsStore().wallpaper).toBe('bliss');

    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ wallpaper: 'hacker-desktop' }));
    setActivePinia(createPinia());
    expect(useSettingsStore().wallpaper).toBe('bliss');
  });
});

describe('update / reset', () => {
  it('rejects unknown wallpaper ids', () => {
    const store = useSettingsStore();
    store.update({ wallpaper: 'nope' });
    expect(store.wallpaper).toBe('bliss');
  });

  it('reset restores defaults and persists them', () => {
    const store = useSettingsStore();
    store.update({ wallpaper: 'garden', iconsVisible: false });
    store.reset();
    expect(store.wallpaper).toBe('bliss');
    expect(store.iconsVisible).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.settings)!)).toMatchObject({
      wallpaper: 'bliss',
      iconsVisible: true,
    });
  });
});

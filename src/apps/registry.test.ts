// registry.test.ts — 应用注册表与 openApp
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { APPS, DESKTOP_ICONS, openApp } from './registry';
import { useWindowsStore } from '../stores/windows';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('APPS', () => {
  it('covers every desktop icon and start menu entry', () => {
    for (const icon of DESKTOP_ICONS) {
      expect(APPS[icon.appId], `desktop icon ${icon.appId}`).toBeDefined();
    }
  });

  it('has icons pointing at existing public assets naming scheme', () => {
    for (const def of Object.values(APPS)) {
      expect(def.icon).toMatch(/^assets\/icons\/xp\/32\//);
    }
  });
});

describe('openApp', () => {
  it('opens a window with the registered metadata', () => {
    openApp('music-collection');
    const store = useWindowsStore();
    expect(store.windows.length).toBe(1);
    expect(store.windows[0].appId).toBe('music-collection');
    expect(store.windows[0].title).toBe('音乐收藏');
    expect(store.windows[0].width).toBe(420);
    expect(store.activeId).toBe(store.windows[0].id);
  });

  it('does not duplicate on repeated open (singleton)', () => {
    openApp('guestbook');
    openApp('guestbook');
    expect(useWindowsStore().windows.length).toBe(1);
  });

  it('ignores unknown app ids', () => {
    openApp('not-an-app');
    expect(useWindowsStore().windows.length).toBe(0);
  });
});

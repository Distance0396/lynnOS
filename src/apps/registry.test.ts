// registry.test.ts — 应用注册表与 openApp（保留范围：4 个应用）
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { APPS, DESKTOP_ICONS, START_MENU_LEFT, START_MENU_RIGHT, openApp } from './registry';
import { useWindowsStore } from '../stores/windows';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('APPS', () => {
  it('contains exactly the 4 kept apps', () => {
    expect(Object.keys(APPS).sort()).toEqual(['about-me', 'guestbook', 'my-computer', 'recycle-bin']);
  });

  it('covers every desktop icon and start menu entry', () => {
    for (const icon of DESKTOP_ICONS) {
      expect(APPS[icon.appId], `desktop icon ${icon.appId}`).toBeDefined();
    }
    for (const item of [...START_MENU_LEFT, ...START_MENU_RIGHT]) {
      if (item.appId) expect(APPS[item.appId], `start menu item ${item.appId}`).toBeDefined();
    }
  });

  it('every app has a component and xp-theme icon path', () => {
    for (const def of Object.values(APPS)) {
      expect(def.component).toBeDefined();
      expect(def.icon).toMatch(/^assets\/icons\/xp\/32\//);
    }
  });
});

describe('openApp', () => {
  it('opens a window with the registered metadata', () => {
    openApp('my-computer');
    const store = useWindowsStore();
    expect(store.windows.length).toBe(1);
    expect(store.windows[0].appId).toBe('my-computer');
    expect(store.windows[0].title).toBe('我的电脑');
    expect(store.windows[0].width).toBe(750);
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

// windows.test.ts — 窗口 store
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useWindowsStore } from './windows';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('open', () => {
  it('creates a centered, active window', () => {
    const store = useWindowsStore();
    const win = store.open({ id: 'welcome', title: 'Welcome', icon: '📄', width: 600, height: 450 });
    // jsdom: 1024x768, 工作区 728 → 居中 (212, 139)
    expect(win.x).toBe(212);
    expect(win.y).toBe(139);
    expect(store.activeId).toBe(win.id);
    expect(win.display).toBe('normal');
  });

  it('applies default icon and sizes when omitted', () => {
    const store = useWindowsStore();
    const win = store.open({ id: 'app', title: 'App' });
    expect(win.icon).toBe('assets/icons/xp/32/notepad-file.png');
    expect(win.width).toBe(600);
    expect(win.height).toBe(450);
    expect(win.minWidth).toBe(280);
  });

  it('activates the existing window instead of duplicating (singleton)', () => {
    const store = useWindowsStore();
    const first = store.open({ id: 'welcome', title: 'Welcome' });
    store.minimize(first.id);
    const again = store.open({ id: 'welcome', title: 'Welcome' });
    expect(again.id).toBe(first.id);
    expect(store.windows.length).toBe(1);
    expect(again.display).toBe('normal');
    expect(store.activeId).toBe(first.id);
  });
});

describe('close', () => {
  it('removes the window and promotes the topmost remaining one', () => {
    const store = useWindowsStore();
    const a = store.open({ id: 'a', title: 'A' });
    const b = store.open({ id: 'b', title: 'B' });
    store.close(b.id);
    expect(store.windows.length).toBe(1);
    expect(store.activeId).toBe(a.id);
  });

  it('sets activeId to null when the last window closes', () => {
    const store = useWindowsStore();
    const a = store.open({ id: 'a', title: 'A' });
    store.close(a.id);
    expect(store.windows.length).toBe(0);
    expect(store.activeId).toBeNull();
  });

  it('closeAll clears every window at once', () => {
    const store = useWindowsStore();
    store.open({ id: 'a', title: 'A' });
    store.open({ id: 'b', title: 'B' });
    store.closeAll();
    expect(store.windows.length).toBe(0);
    expect(store.activeId).toBeNull();
  });
});

describe('minimize', () => {
  it('marks minimized and promotes the next topmost window', () => {
    const store = useWindowsStore();
    const a = store.open({ id: 'a', title: 'A' });
    const b = store.open({ id: 'b', title: 'B' });
    store.minimize(b.id);
    expect(b.display).toBe('minimized');
    expect(store.activeId).toBe(a.id);
  });

  it('clears activeId when minimizing the only window', () => {
    const store = useWindowsStore();
    const a = store.open({ id: 'a', title: 'A' });
    store.minimize(a.id);
    expect(store.activeId).toBeNull();
  });
});

describe('activate', () => {
  it('un-minimizes and assigns the highest z', () => {
    const store = useWindowsStore();
    const a = store.open({ id: 'a', title: 'A' });
    const b = store.open({ id: 'b', title: 'B' });
    store.minimize(a.id);
    store.activate(a.id);
    expect(a.display).toBe('normal');
    expect(a.z).toBeGreaterThan(b.z);
    expect(store.activeId).toBe(a.id);
  });
});

describe('toggleMaximize', () => {
  it('stores prevBounds when maximizing and restores them on toggle back', () => {
    const store = useWindowsStore();
    const a = store.open({ id: 'a', title: 'A' });
    a.x = 100; a.y = 80; a.width = 500; a.height = 400;

    store.toggleMaximize(a.id);
    expect(a.display).toBe('maximized');
    expect(a.prevBounds).toEqual({ x: 100, y: 80, width: 500, height: 400 });
    expect(store.activeId).toBe(a.id);

    store.toggleMaximize(a.id);
    expect(a.display).toBe('normal');
    expect(a.x).toBe(100);
    expect(a.width).toBe(500);
    expect(a.prevBounds).toBeNull();
  });
});

describe('commitBounds', () => {
  it('writes the given fields onto the window', () => {
    const store = useWindowsStore();
    const a = store.open({ id: 'a', title: 'A' });
    store.commitBounds(a.id, { x: 42, y: 24, width: 320, height: 240 });
    expect(a.x).toBe(42);
    expect(a.y).toBe(24);
    expect(a.width).toBe(320);
    expect(a.height).toBe(240);
  });
});

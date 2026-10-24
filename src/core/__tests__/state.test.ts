/* ===== state.test.ts — DesktopState (store) unit tests ===== */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DesktopState } from '../state';

describe('DesktopState', () => {
  beforeEach(() => {
    // Clear all windows and reset active
    DesktopState.state.windows.clear();
    DesktopState.state.activeWinId = null;
    DesktopState.state.selectedIcon = null;
  });

  describe('addWindow', () => {
    it('creates a window with default dimensions', () => {
      const w = DesktopState.addWindow({ appId: 'test', title: 'Test', icon: '📄' });
      expect(w.id).toBeTruthy();
      expect(w.appId).toBe('test');
      expect(w.title).toBe('Test');
      expect(w.width).toBe(600);
      expect(w.height).toBe(450);
      expect(w.state).toBe('normal');
      expect(w.z).toBeGreaterThan(0);
    });

    it('uses provided dimensions', () => {
      const w = DesktopState.addWindow({
        appId: 'test', title: 'Test', icon: '📄',
        width: 800, height: 600, minWidth: 400, minHeight: 300,
      });
      expect(w.width).toBe(800);
      expect(w.height).toBe(600);
      expect(w.minWidth).toBe(400);
      expect(w.minHeight).toBe(300);
    });

    it('sets the new window as active', () => {
      const w = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      expect(DesktopState.state.activeWinId).toBe(w.id);
    });

    it('assigns incrementing z-index', () => {
      const w1 = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      const w2 = DesktopState.addWindow({ appId: 'b', title: 'B', icon: '📄' });
      expect(w2.z).toBeGreaterThan(w1.z);
    });
  });

  describe('removeWindow', () => {
    it('removes the window from the map', () => {
      const w = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      DesktopState.removeWindow(w.id);
      expect(DesktopState.state.windows.has(w.id)).toBe(false);
    });

    it('activates the topmost remaining window when active is removed', () => {
      const w1 = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      const w2 = DesktopState.addWindow({ appId: 'b', title: 'B', icon: '📄' });
      DesktopState.removeWindow(w2.id);
      expect(DesktopState.state.activeWinId).toBe(w1.id);
    });

    it('sets activeWinId to null when no windows remain', () => {
      const w = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      DesktopState.removeWindow(w.id);
      expect(DesktopState.state.activeWinId).toBeNull();
    });
  });

  describe('activateWindow', () => {
    it('restores a minimized window', () => {
      const w = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      w.state = 'minimized';
      DesktopState.activateWindow(w.id);
      expect(w.state).toBe('normal');
    });

    it('gives the window a higher z-index', () => {
      const w1 = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      const w2 = DesktopState.addWindow({ appId: 'b', title: 'B', icon: '📄' });
      const oldZ = w1.z;
      DesktopState.activateWindow(w1.id);
      expect(w1.z).toBeGreaterThan(oldZ);
      expect(w1.z).toBeGreaterThan(w2.z);
    });

    it('sets activeWinId', () => {
      const w1 = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      DesktopState.addWindow({ appId: 'b', title: 'B', icon: '📄' });
      DesktopState.activateWindow(w1.id);
      expect(DesktopState.state.activeWinId).toBe(w1.id);
    });
  });

  describe('findWindowByApp', () => {
    it('returns the window for a given appId', () => {
      const w = DesktopState.addWindow({ appId: 'my-app', title: 'My App', icon: '📄' });
      expect(DesktopState.findWindowByApp('my-app')?.id).toBe(w.id);
    });

    it('returns null when no window matches', () => {
      expect(DesktopState.findWindowByApp('nonexistent')).toBeNull();
    });
  });

  describe('subscribe / notify (pub/sub)', () => {
    it('calls subscribers when state changes via addWindow', () => {
      const fn = vi.fn();
      const unsub = DesktopState.subscribe(fn);
      DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      expect(fn).toHaveBeenCalledTimes(1);
      unsub();
    });

    it('stops calling after unsubscribe', () => {
      const fn = vi.fn();
      const unsub = DesktopState.subscribe(fn);
      unsub();
      DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      expect(fn).not.toHaveBeenCalled();
    });

    it('notifies on removeWindow', () => {
      const fn = vi.fn();
      const unsub = DesktopState.subscribe(fn);
      const w = DesktopState.addWindow({ appId: 'a', title: 'A', icon: '📄' });
      fn.mockClear();
      DesktopState.removeWindow(w.id);
      expect(fn).toHaveBeenCalledTimes(1);
      unsub();
    });
  });
});

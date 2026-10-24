/* ===== window-manager.test.ts — WindowManager unit tests ===== */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WindowManager } from '../window-manager';
import { DesktopState } from '../state';

// Minimal DOM required by window-manager
function setupDOM() {
  document.body.innerHTML = `
    <div id="window-container"></div>
    <div id="taskbar"><div id="task-buttons"></div></div>
  `;
}

describe('WindowManager', () => {
  beforeEach(() => {
    DesktopState.state.windows.clear();
    DesktopState.state.activeWinId = null;
    setupDOM();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('openWindow', () => {
    it('creates a window DOM element in the container', () => {
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      const container = document.getElementById('window-container')!;
      expect(container.children.length).toBe(1);
      expect(container.firstElementChild?.id).toMatch(/^win-/);
    });

    it('activates an existing window instead of opening a duplicate', () => {
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      const container = document.getElementById('window-container')!;
      expect(container.children.length).toBe(1);
    });

    it('renders the window title', () => {
      WindowManager.openWindow({ id: 'test', title: 'My Window', icon: '📄' });
      const container = document.getElementById('window-container')!;
      const title = container.querySelector('.title-bar-text');
      expect(title?.textContent).toBe('My Window');
    });
  });

  describe('closeWindow', () => {
    it('removes the window after the close animation', () => {
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      const container = document.getElementById('window-container')!;
      expect(container.children.length).toBe(1);

      const winId = DesktopState.state.windows.keys().next().value!;
      WindowManager.closeWindow(winId);
      // Animation is 130ms; advance timers
      vi.advanceTimersByTime(200);
      expect(container.children.length).toBe(0);
    });
  });

  describe('minimizeWindow', () => {
    it('sets window state to minimized', () => {
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      const winId = DesktopState.state.windows.keys().next().value!;
      WindowManager.minimizeWindow(winId);
      const w = DesktopState.state.windows.get(winId)!;
      expect(w.state).toBe('minimized');
    });

    it('adds the minimized class to the DOM element', () => {
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      const winId = DesktopState.state.windows.keys().next().value!;
      WindowManager.minimizeWindow(winId);
      const el = document.getElementById(winId)!;
      expect(el.classList.contains('minimized')).toBe(true);
    });
  });

  describe('toggleMaximize', () => {
    it('toggles window state between normal and maximized', () => {
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      const winId = DesktopState.state.windows.keys().next().value!;
      const w = DesktopState.state.windows.get(winId)!;

      WindowManager.toggleMaximize(winId);
      expect(w.state).toBe('maximized');

      WindowManager.toggleMaximize(winId);
      expect(w.state).toBe('normal');
    });

    it('saves previous bounds before maximizing', () => {
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      const winId = DesktopState.state.windows.keys().next().value!;
      const w = DesktopState.state.windows.get(winId)!;
      w.x = 100; w.y = 100; w.width = 500; w.height = 400;

      WindowManager.toggleMaximize(winId);
      expect(w.prevBounds).toEqual({ x: 100, y: 100, width: 500, height: 400 });
    });
  });

  describe('incremental rendering', () => {
    it('caches the DOM element on the window state (does not rebuild)', () => {
      WindowManager.openWindow({ id: 'test', title: 'Test', icon: '📄' });
      const winId = DesktopState.state.windows.keys().next().value!;
      const w = DesktopState.state.windows.get(winId)!;
      const firstEl = w.el;
      expect(firstEl).not.toBeNull();

      // Re-render should reuse the same element
      WindowManager.renderAll();
      expect(w.el).toBe(firstEl);
    });

    it('only updates style/class on re-render, not content', () => {
      const marker = 'test-marker';
      WindowManager.openWindow({
        id: 'test', title: 'Test', icon: '📄',
        renderContent(body) {
          body.innerHTML = `<div class="${marker}">content</div>`;
        },
      });
      const winId = DesktopState.state.windows.keys().next().value!;

      // Re-render via activation
      DesktopState.activateWindow(winId);
      const w = DesktopState.state.windows.get(winId)!;
      expect(w.el?.querySelector(`.${marker}`)).not.toBeNull();
    });
  });
});

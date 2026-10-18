/* ===== state.js — Central Desktop State ===== */
const DesktopState = (() => {
  let _nextZ = 200;
  let _nextWinId = 1;

  const state = {
    windows: new Map(),       // winId -> window info
    activeWinId: null,
    selectedIcon: null,
    startMenuOpen: false,
    settings: {
      wallpaper: 'bliss',
      soundEnabled: false,
      animationsEnabled: true,
      iconsVisible: true,
    },
    iconPositions: {},        // appId -> { row, col }
  };

  function allocZ() { return ++_nextZ; }
  function allocWinId() { return 'win-' + (_nextWinId++); }

  function addWindow(info) {
    const id = allocWinId();
    const win = {
      id,
      appId: info.appId,
      title: info.title,
      icon: info.icon || '📄',
      x: info.x ?? 200,
      y: info.y ?? 100,
      width: info.width ?? 600,
      height: info.height ?? 450,
      minWidth: info.minWidth ?? 280,
      minHeight: info.minHeight ?? 160,
      state: 'normal',        // normal | maximized | minimized
      z: allocZ(),
      prevBounds: null,       // saved before maximize
      renderContent: info.renderContent,
    };
    state.windows.set(id, win);
    state.activeWinId = id;
    return win;
  }

  function removeWindow(id) {
    state.windows.delete(id);
    if (state.activeWinId === id) {
      // activate topmost remaining window
      let top = null;
      for (const [wid, w] of state.windows) {
        if (w.state !== 'minimized' && (!top || w.z > top.z)) top = w;
      }
      state.activeWinId = top ? top.id : null;
    }
  }

  function activateWindow(id) {
    const w = state.windows.get(id);
    if (!w) return;
    if (w.state === 'minimized') w.state = 'normal';
    w.z = allocZ();
    state.activeWinId = id;
  }

  function findWindowByApp(appId) {
    for (const [id, w] of state.windows) {
      if (w.appId === appId) return w;
    }
    return null;
  }

  return { state, addWindow, removeWindow, activateWindow, findWindowByApp, allocZ };
})();

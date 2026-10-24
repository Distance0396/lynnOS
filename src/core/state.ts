/* ===== state.ts — Central Desktop State (with pub/sub) ===== */
import { INITIAL_Z, MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT } from '../constants';

export interface WindowInfo {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  state: 'normal' | 'maximized' | 'minimized';
  z: number;
  prevBounds: { x: number; y: number; width: number; height: number } | null;
  renderContent?: (body: HTMLElement, win: WindowInfo) => void;
  el?: HTMLElement | null;
}

export interface Settings {
  wallpaper: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  iconsVisible: boolean;
}

export type StateListener = () => void;

let _nextZ = INITIAL_Z;
let _nextWinId = 1;
const _listeners: StateListener[] = [];

export const state = {
  windows: new Map<string, WindowInfo>(),
  activeWinId: null as string | null,
  selectedIcon: null as string | null,
  startMenuOpen: false,
  settings: {
    wallpaper: 'bliss',
    soundEnabled: false,
    animationsEnabled: true,
    iconsVisible: true,
  } as Settings,
};

function allocZ() { return ++_nextZ; }
function allocWinId() { return 'win-' + (_nextWinId++); }

function subscribe(fn: StateListener): () => void {
  _listeners.push(fn);
  return () => {
    const i = _listeners.indexOf(fn);
    if (i >= 0) _listeners.splice(i, 1);
  };
}

function notify() {
  for (const fn of _listeners) {
    try { fn(); } catch (e) { console.error('State listener error:', e); }
  }
}

function addWindow(info: {
  appId: string;
  title: string;
  icon?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  renderContent?: (body: HTMLElement, win: WindowInfo) => void;
}): WindowInfo {
  const id = allocWinId();
  const win: WindowInfo = {
    id,
    appId: info.appId,
    title: info.title,
    icon: info.icon || 'assets/icons/xp/32/notepad-file.png',
    x: info.x ?? 200,
    y: info.y ?? 100,
    width: info.width ?? DEFAULT_WINDOW_WIDTH,
    height: info.height ?? DEFAULT_WINDOW_HEIGHT,
    minWidth: info.minWidth ?? MIN_WINDOW_WIDTH,
    minHeight: info.minHeight ?? MIN_WINDOW_HEIGHT,
    state: 'normal',
    z: allocZ(),
    prevBounds: null,
    renderContent: info.renderContent,
    el: null,
  };
  state.windows.set(id, win);
  state.activeWinId = id;
  notify();
  return win;
}

function removeWindow(id: string) {
  state.windows.delete(id);
  if (state.activeWinId === id) {
    let top: WindowInfo | null = null;
    for (const [, w] of state.windows) {
      if (w.state !== 'minimized' && (!top || w.z > top.z)) top = w;
    }
    state.activeWinId = top ? top.id : null;
  }
  notify();
}

function activateWindow(id: string) {
  const w = state.windows.get(id);
  if (!w) return;
  if (w.state === 'minimized') w.state = 'normal';
  w.z = allocZ();
  state.activeWinId = id;
  notify();
}

function updateSettings(partial: Partial<Settings>) {
  Object.assign(state.settings, partial);
  notify();
}

function findWindowByApp(appId: string): WindowInfo | null {
  for (const [, w] of state.windows) {
    if (w.appId === appId) return w;
  }
  return null;
}

export const DesktopState = {
  state,
  addWindow,
  removeWindow,
  activateWindow,
  findWindowByApp,
  updateSettings,
  subscribe,
  allocZ,
};

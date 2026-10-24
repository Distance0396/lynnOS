// 窗口集合状态：开/关/最小化/最大化/激活/z 序，单例由 appId 保证
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
  INITIAL_Z,
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  TASKBAR_HEIGHT,
} from '../constants';
import { centeredPosition, type Bounds } from '../utils/geometry';
import type { WindowDisplay } from '../utils/display';

export type { Bounds, WindowDisplay };

// apps/registry.ts 中与窗口创建相关的元数据
export interface AppWindowMeta {
  id: string;
  title: string;
  icon?: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}

export interface WindowState {
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
  display: WindowDisplay;
  z: number;
  prevBounds: Bounds | null;
}

const DEFAULT_ICON = 'assets/icons/xp/32/notepad-file.png';

export const useWindowsStore = defineStore('windows', () => {
  const windows = ref<WindowState[]>([]);
  const activeId = ref<string | null>(null);
  let nextZ = INITIAL_Z;
  let nextWinId = 1;

  const activeWindow = computed(() => windows.value.find(w => w.id === activeId.value) ?? null);

  function topUnminimized(): WindowState | null {
    let top: WindowState | null = null;
    for (const w of windows.value) {
      if (w.display !== 'minimized' && (!top || w.z > top.z)) top = w;
    }
    return top;
  }

  function activate(id: string) {
    const win = windows.value.find(w => w.id === id);
    if (!win) return;
    if (win.display === 'minimized') win.display = 'normal';
    win.z = ++nextZ;
    activeId.value = id;
  }

  // 打开应用窗口；同应用已存在时激活并还原，不重复创建
  function open(meta: AppWindowMeta): WindowState {
    const existing = windows.value.find(w => w.appId === meta.id);
    if (existing) {
      activate(existing.id);
      return existing;
    }
    const width = meta.width ?? DEFAULT_WINDOW_WIDTH;
    const height = meta.height ?? DEFAULT_WINDOW_HEIGHT;
    const pos = centeredPosition(width, height, window.innerWidth, window.innerHeight - TASKBAR_HEIGHT);
    const win: WindowState = {
      id: `win-${nextWinId++}`,
      appId: meta.id,
      title: meta.title,
      icon: meta.icon ?? DEFAULT_ICON,
      x: pos.x,
      y: pos.y,
      width,
      height,
      minWidth: meta.minWidth ?? MIN_WINDOW_WIDTH,
      minHeight: meta.minHeight ?? MIN_WINDOW_HEIGHT,
      display: 'normal',
      z: ++nextZ,
      prevBounds: null,
    };
    windows.value.push(win);
    activeId.value = win.id;
    return win;
  }

  function close(id: string) {
    if (!windows.value.some(w => w.id === id)) return;
    windows.value = windows.value.filter(w => w.id !== id);
    if (activeId.value === id) activeId.value = topUnminimized()?.id ?? null;
  }

  function minimize(id: string) {
    const win = windows.value.find(w => w.id === id);
    if (!win) return;
    win.display = 'minimized';
    if (activeId.value === id) activeId.value = topUnminimized()?.id ?? null;
  }

  function toggleMaximize(id: string) {
    const win = windows.value.find(w => w.id === id);
    if (!win) return;
    if (win.display === 'maximized') {
      if (win.prevBounds) Object.assign(win, win.prevBounds);
      win.display = 'normal';
      win.prevBounds = null;
    } else {
      win.prevBounds = { x: win.x, y: win.y, width: win.width, height: win.height };
      win.display = 'maximized';
    }
    activate(id);
  }

  // 拖拽/缩放结束时提交边界（窗口位置的唯一写入点）
  function commitBounds(id: string, bounds: Partial<Bounds>) {
    const win = windows.value.find(w => w.id === id);
    if (win) Object.assign(win, bounds);
  }

  return { windows, activeId, activeWindow, open, close, minimize, toggleMaximize, activate, commitBounds };
});

/* ===== constants/index.ts — Centralized constants ===== */

/* --- Storage keys --- */
export const STORAGE_KEYS = {
  settings: 'somewhere-settings',
  bootDone: 'somewhere-boot-done',
  guestbook: 'somewhere-guestbook',
} as const;

/* --- Layout --- */
export const TASKBAR_HEIGHT = 40;
export const MIN_WINDOW_WIDTH = 280;
export const MIN_WINDOW_HEIGHT = 160;
export const DEFAULT_WINDOW_WIDTH = 600;
export const DEFAULT_WINDOW_HEIGHT = 450;

/* --- Boot sequence timing (ms) --- */
export const BOOT_TIMING = {
  boot: 5200,
  welcome: 2600,
  loading: 1600,
  fade: 500,
} as const;

/* --- Initial z-index --- */
export const INITIAL_Z = 200;

/* --- Viewport: ≤768px 时窗口强制最大化、禁用拖拽缩放 --- */
export const NARROW_BREAKPOINT = 768;

/* --- Window close: CSS 动画 140ms，130ms 后提交移除 --- */
export const CLOSE_REMOVE_DELAY_MS = 130;

/* --- Resize handles（与 windows.css 的 .resize-* 类一一对应）--- */
export const RESIZE_DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;

/* --- 合法壁纸 id（对应 atmosphere.css 的 theme-* 类）--- */
export const VALID_WALLPAPERS = ['bliss', 'hallway', 'faded', 'garden', 'room'] as const;

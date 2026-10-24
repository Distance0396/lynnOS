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

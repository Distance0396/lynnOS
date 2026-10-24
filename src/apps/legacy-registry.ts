/* ===== apps/registry.ts — App Registry & Open ===== */
import { WindowManager } from '../core/window-manager';
import type { WindowInfo } from '../core/state';

export interface AppDef {
  id: string;
  title: string;
  icon: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  renderContent?: (body: HTMLElement, win: WindowInfo) => void;
}

const REGISTRY: Record<string, AppDef> = {};

export function register(appDef: AppDef) {
  REGISTRY[appDef.id] = appDef;
}

export function openApp(appId: string) {
  const app = REGISTRY[appId];
  if (!app) {
    console.warn('Unknown app:', appId);
    return;
  }
  WindowManager.openWindow(app);
}

export const Apps = { register, openApp };

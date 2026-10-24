// 应用注册表：仅保留 4 个应用（范围变更见 PRD），窗口元数据 + 组件映射
import type { Component } from 'vue';
import { useWindowsStore } from '../stores/windows';
import { useSound } from '../composables/useSound';
import AboutMeApp from './about-me/AboutMeApp.vue';
import GuestbookApp from './guestbook/GuestbookApp.vue';
import MyComputerApp from './my-computer/MyComputerApp.vue';
import RecycleBinApp from './recycle-bin/RecycleBinApp.vue';

export interface AppDef {
  id: string;
  title: string;
  icon: string;
  width?: number;
  height?: number;
  // 附加到 .window-body 的类（explorer 式应用需 no-scroll）
  bodyClass?: string;
  component: Component;
}

export const APPS: Record<string, AppDef> = {
  'about-me': { id: 'about-me', title: '关于我', icon: 'assets/icons/xp/32/user-key.png', width: 560, height: 500, bodyClass: 'no-scroll', component: AboutMeApp },
  guestbook: { id: 'guestbook', title: '留言板', icon: 'assets/icons/xp/32/document-edit.png', width: 640, height: 520, bodyClass: 'no-scroll', component: GuestbookApp },
  'my-computer': { id: 'my-computer', title: '我的电脑', icon: 'assets/icons/xp/32/my-computer.png', width: 750, height: 500, bodyClass: 'no-scroll', component: MyComputerApp },
  'recycle-bin': { id: 'recycle-bin', title: '回收站', icon: 'assets/icons/xp/32/recycle-bin.png', width: 550, height: 380, bodyClass: 'no-scroll', component: RecycleBinApp },
};

// 桌面图标（顺序即列排顺序，图标取自 APPS）
export const DESKTOP_ICONS = [
  { appId: 'about-me', label: '关于我' },
  { appId: 'my-computer', label: '我的电脑' },
  { appId: 'recycle-bin', label: '回收站' },
] as const;

export interface StartMenuItem {
  appId?: string;
  label?: string;
  icon?: string;
  bold?: boolean;
  sep?: boolean;
}

export const START_MENU_LEFT: StartMenuItem[] = [
  { appId: 'about-me', label: '电子邮件', icon: 'assets/icons/xp/32/internet.png', bold: true },
  { appId: 'guestbook', label: '留言板', icon: 'assets/icons/xp/32/document-edit.png' },
];

export const START_MENU_RIGHT: StartMenuItem[] = [
  { appId: 'my-computer', label: '我的电脑', icon: 'assets/icons/xp/32/my-computer.png' },
  { sep: true },
  { appId: 'about-me', label: '关于我', icon: 'assets/icons/xp/32/user-key.png' },
];

// 打开应用窗口；新窗口播放提示音，已存在仅激活（与旧行为一致）
export function openApp(appId: string) {
  const def = APPS[appId];
  if (!def) return;
  const store = useWindowsStore();
  const isNew = !store.windows.some(w => w.appId === appId);
  store.open(def);
  if (isNew) useSound().open();
}

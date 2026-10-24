// 应用注册表：窗口元数据 + 桌面图标 / 开始菜单配置；V4 起补充 component 字段
import { useWindowsStore } from '../stores/windows';
import { useSound } from '../composables/useSound';

export interface AppDef {
  id: string;
  title: string;
  icon: string;
  width?: number;
  height?: number;
}

export const APPS: Record<string, AppDef> = {
  welcome: { id: 'welcome', title: 'Welcome to my little world', icon: 'assets/icons/xp/32/notepad-file.png', width: 540, height: 370 },
  'article-archive': { id: 'article-archive', title: '文章档案', icon: 'assets/icons/xp/32/folder-documents.png', width: 760, height: 520 },
  'my-blog': { id: 'my-blog', title: '我的博客', icon: 'assets/icons/xp/32/notepad-file.png', width: 640, height: 480 },
  'photo-memory': { id: 'photo-memory', title: '照片记忆', icon: 'assets/icons/xp/32/folder-pictures.png', width: 820, height: 560 },
  'music-collection': { id: 'music-collection', title: '音乐收藏', icon: 'assets/icons/xp/32/folder-music.png', width: 420, height: 460 },
  'tech-notes': { id: 'tech-notes', title: '技术笔记', icon: 'assets/icons/xp/32/notepad-config.png', width: 760, height: 540 },
  guestbook: { id: 'guestbook', title: '留言板', icon: 'assets/icons/xp/32/document-edit.png', width: 640, height: 520 },
  'about-me': { id: 'about-me', title: '关于我', icon: 'assets/icons/xp/32/user-key.png', width: 560, height: 500 },
  'my-computer': { id: 'my-computer', title: '我的电脑', icon: 'assets/icons/xp/32/my-computer.png', width: 750, height: 500 },
  'recycle-bin': { id: 'recycle-bin', title: '回收站', icon: 'assets/icons/xp/32/recycle-bin.png', width: 550, height: 380 },
  settings: { id: 'settings', title: '系统设置', icon: 'assets/icons/xp/32/settings-gear.png', width: 580, height: 500 },
};

// 桌面图标（顺序即列排顺序，图标取自 APPS）
export const DESKTOP_ICONS = [
  { appId: 'about-me', label: '关于我' },
  { appId: 'my-blog', label: '我的博客' },
  { appId: 'article-archive', label: '文章档案' },
  { appId: 'photo-memory', label: '照片记忆' },
  { appId: 'music-collection', label: '音乐收藏' },
  { appId: 'tech-notes', label: '技术笔记' },
  { appId: 'guestbook', label: '留言板' },
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
  { appId: 'tech-notes', label: '技术笔记', icon: 'assets/icons/xp/32/notepad-config.png', bold: true },
  { appId: 'article-archive', label: '文章档案', icon: 'assets/icons/xp/32/folder-documents.png' },
  { appId: 'photo-memory', label: '照片记忆', icon: 'assets/icons/xp/32/folder-pictures.png' },
  { appId: 'music-collection', label: '音乐收藏', icon: 'assets/icons/xp/32/folder-music.png' },
  { appId: 'guestbook', label: '留言板', icon: 'assets/icons/xp/32/document-edit.png' },
];

export const START_MENU_RIGHT: StartMenuItem[] = [
  { appId: 'article-archive', label: '我的文档', icon: 'assets/icons/xp/32/folder-documents.png' },
  { appId: 'photo-memory', label: '我的图片', icon: 'assets/icons/xp/32/folder-pictures.png' },
  { appId: 'music-collection', label: '我的音乐', icon: 'assets/icons/xp/32/folder-music.png' },
  { sep: true },
  { appId: 'my-computer', label: '我的电脑', icon: 'assets/icons/xp/32/my-computer.png' },
  { appId: 'settings', label: '控制面板', icon: 'assets/icons/xp/32/control-panel.png' },
  { sep: true },
  { appId: 'about-me', label: '关于我', icon: 'assets/icons/xp/32/user-key.png' },
  { appId: 'welcome', label: '帮助和支持', icon: 'assets/icons/xp/32/help.png' },
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

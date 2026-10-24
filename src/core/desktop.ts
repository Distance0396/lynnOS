/* ===== desktop.ts — Desktop Icons & Interactions ===== */
import { DesktopState } from './state';
import { Apps } from '../apps/legacy-registry';

const ICONS = [
  { id: 'about-me',         label: '关于我',    icon: 'assets/icons/xp/32/user-key.png',          app: 'about-me' },
  { id: 'my-blog',          label: '我的博客',  icon: 'assets/icons/xp/32/notepad-file.png',      app: 'my-blog' },
  { id: 'article-archive',  label: '文章档案',  icon: 'assets/icons/xp/32/folder-documents.png',  app: 'article-archive' },
  { id: 'photo-memory',     label: '照片记忆',  icon: 'assets/icons/xp/32/folder-pictures.png',   app: 'photo-memory' },
  { id: 'music-collection', label: '音乐收藏',  icon: 'assets/icons/xp/32/folder-music.png',      app: 'music-collection' },
  { id: 'tech-notes',       label: '技术笔记',  icon: 'assets/icons/xp/32/notepad-config.png',    app: 'tech-notes' },
  { id: 'guestbook',        label: '留言板',    icon: 'assets/icons/xp/32/document-edit.png',     app: 'guestbook' },
  { id: 'my-computer',      label: '我的电脑',  icon: 'assets/icons/xp/32/my-computer.png',       app: 'my-computer' },
  { id: 'recycle-bin',      label: '回收站',    icon: 'assets/icons/xp/32/recycle-bin.png',       app: 'recycle-bin' },
];

function render() {
  const area = document.getElementById('desktop-icons');
  if (!area) return;
  area.innerHTML = '';

  ICONS.forEach(ic => {
    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.dataset.app = ic.app;
    el.innerHTML = `
      <div class="icon-img"><img src="${ic.icon}" alt=""></div>
      <div class="icon-label">${ic.label}</div>
    `;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectIcon(ic.app);
    });

    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      Apps.openApp(ic.app);
    });

    area.appendChild(el);
  });
}

function selectIcon(appId: string) {
  DesktopState.state.selectedIcon = appId;
  document.querySelectorAll('.desktop-icon').forEach(el => {
    (el as HTMLElement).classList.toggle('selected', (el as HTMLElement).dataset.app === appId);
  });
}

function clearSelection() {
  DesktopState.state.selectedIcon = null;
  document.querySelectorAll('.desktop-icon.selected').forEach(el => {
    el.classList.remove('selected');
  });
}

function initDesktopClicks() {
  const root = document.getElementById('desktop-root');
  if (!root) return;
  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'desktop-root' ||
        target.id === 'wallpaper' ||
        target.id === 'wallpaper-overlay' ||
        target.id === 'window-container') {
      clearSelection();
      closeStartMenu();
    }
  });
}

function closeStartMenu() {
  DesktopState.state.startMenuOpen = false;
  const menu = document.getElementById('start-menu');
  if (menu) menu.hidden = true;
  const btn = document.getElementById('start-btn');
  if (btn) btn.classList.remove('active');
}

export const Desktop = { render, selectIcon, clearSelection, initDesktopClicks, closeStartMenu, ICONS };

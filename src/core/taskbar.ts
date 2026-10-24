/* ===== taskbar.ts — Taskbar, Start Menu, Clock ===== */
import { DesktopState } from './state';
import { Apps } from '../apps/registry';
import { Desktop } from './desktop';
import { WindowManager } from './window-manager';
import { Atmosphere } from './atmosphere';

function render() {
  renderTaskButtons();
}

function renderTaskButtons() {
  const area = document.getElementById('task-buttons');
  if (!area) return;
  area.innerHTML = '';
  const { windows, activeWinId } = DesktopState.state;

  for (const [winId, w] of windows) {
    const btn = document.createElement('button');
    btn.className = 'task-btn' + (winId === activeWinId ? ' active' : '');
    const taskIcon = w.icon ? w.icon.replace('/32/', '/16/').replace('/48/', '/16/') : '';
    btn.innerHTML = '<span class="task-icon">' + (taskIcon ? '<img src="' + taskIcon + '" alt="">' : w.icon) + '</span><span class="task-title">' + w.title + '</span>';
    btn.addEventListener('click', () => {
      if (w.state === 'minimized') {
        DesktopState.activateWindow(winId);
        WindowManager.renderAll();
      } else if (winId === activeWinId) {
        WindowManager.minimizeWindow(winId);
      } else {
        DesktopState.activateWindow(winId);
        WindowManager.renderAll();
      }
    });
    area.appendChild(btn);
  }
}

/* --- Clock --- */
function startClock() {
  const el = document.getElementById('tray-clock');
  if (!el) return;
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    el!.textContent = h + ':' + m;
  }
  tick();
  setInterval(tick, 15000);
}

/* --- Start Menu --- */
function initStartMenu() {
  const btn = document.getElementById('start-btn');
  const menu = document.getElementById('start-menu');
  if (!btn || !menu) return;

  const left = document.getElementById('start-menu-left');
  const right = document.getElementById('start-menu-right');
  function iconHtml(ic: string) {
    if (ic.includes('/') || ic.includes('.')) return '<img src="' + ic + '" alt="">';
    return ic;
  }
  if (left) {
    const leftItems = [
      { icon: 'assets/icons/xp/32/internet.png', label: '电子邮件', app: 'about-me', bold: true },
      { icon: 'assets/icons/xp/32/notepad-config.png', label: '技术笔记', app: 'tech-notes', bold: true },
      { icon: 'assets/icons/xp/32/folder-documents.png', label: '文章档案', app: 'article-archive' },
      { icon: 'assets/icons/xp/32/folder-pictures.png', label: '照片记忆', app: 'photo-memory' },
      { icon: 'assets/icons/xp/32/folder-music.png', label: '音乐收藏', app: 'music-collection' },
      { icon: 'assets/icons/xp/32/document-edit.png', label: '留言板', app: 'guestbook' },
    ];
    left.innerHTML = leftItems.map(it =>
      '<div class="start-item' + (it.bold ? ' bold' : '') + '" data-app="' + it.app + '">'
      + '<span class="si-icon">' + iconHtml(it.icon) + '</span>'
      + '<span class="si-label">' + it.label + '</span></div>'
    ).join('');

    left.querySelectorAll('.start-item').forEach(el => {
      el.addEventListener('click', () => {
        Apps.openApp((el as HTMLElement).dataset.app!);
        Desktop.closeStartMenu();
      });
    });
  }
  if (right) {
    const rightItems = [
      { icon: 'assets/icons/xp/32/folder-documents.png', label: '我的文档', app: 'article-archive' },
      { icon: 'assets/icons/xp/32/folder-pictures.png', label: '我的图片', app: 'photo-memory' },
      { icon: 'assets/icons/xp/32/folder-music.png', label: '我的音乐', app: 'music-collection' },
      { sep: true },
      { icon: 'assets/icons/xp/32/my-computer.png', label: '我的电脑', app: 'my-computer' },
      { icon: 'assets/icons/xp/32/control-panel.png', label: '控制面板', app: 'settings' },
      { sep: true },
      { icon: 'assets/icons/xp/32/user-key.png', label: '关于我', app: 'about-me' },
      { icon: 'assets/icons/xp/32/help.png', label: '帮助和支持', app: 'welcome' },
    ] as Array<{ sep?: boolean; icon?: string; label?: string; app?: string }>;
    right.innerHTML = rightItems.map(it => {
      if (it.sep) return '<div class="start-vsep"></div>';
      return '<div class="start-item" data-app="' + it.app + '">'
        + '<span class="si-icon">' + iconHtml(it.icon!) + '</span>'
        + '<span class="si-label">' + it.label + '</span></div>';
    }).join('');

    right.querySelectorAll('.start-item').forEach(el => {
      el.addEventListener('click', () => {
        Apps.openApp((el as HTMLElement).dataset.app!);
        Desktop.closeStartMenu();
      });
    });
  }

  const allProg = document.getElementById('start-all-programs');
  if (allProg) {
    allProg.addEventListener('click', () => {
      Apps.openApp('my-computer');
      Desktop.closeStartMenu();
    });
  }

  menu.querySelectorAll('.start-bottom-btn').forEach(el => {
    el.addEventListener('click', () => {
      const action = (el as HTMLElement).dataset.action;
      Desktop.closeStartMenu();
      if (action === 'home') {
        const ids = Array.from(DesktopState.state.windows.keys());
        ids.forEach(id => DesktopState.removeWindow(id));
        WindowManager.renderAll();
        Apps.openApp('welcome');
      } else if (action === 'sleep') {
        Atmosphere.enterSleep();
      }
    });
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = DesktopState.state.startMenuOpen;
    if (isOpen) {
      Desktop.closeStartMenu();
    } else {
      DesktopState.state.startMenuOpen = true;
      menu.hidden = false;
      btn.classList.add('active');
    }
  });
}

export const Taskbar = { render, startClock, initStartMenu };

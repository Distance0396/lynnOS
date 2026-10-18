/* ===== taskbar.js — Taskbar, Start Menu, Clock ===== */
const Taskbar = (() => {

  /* --- Render task buttons --- */
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
      // Use 16px version for taskbar
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
      el.textContent = h + ':' + m;
    }
    tick();
    setInterval(tick, 15000);
  }

  /* --- Start Menu --- */
  function initStartMenu() {
    const btn = document.getElementById('start-btn');
    const menu = document.getElementById('start-menu');
    if (!btn || !menu) return;

    // Populate start menu items
    const left = document.getElementById('start-menu-left');
    const right = document.getElementById('start-menu-right');
    function iconHtml(ic) {
      if (ic.includes('/') || ic.includes('.')) return '<img src="' + ic + '" alt="">';
      return ic;
    }
    // Left column: pinned / frequently used programs (bold top entries)
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
          Apps.openApp(el.dataset.app);
          Desktop.closeStartMenu();
        });
      });
    }
    // Right column: places + system links, grouped with separators
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
      ];
      right.innerHTML = rightItems.map(it => {
        if (it.sep) return '<div class="start-vsep"></div>';
        return '<div class="start-item" data-app="' + it.app + '">'
          + '<span class="si-icon">' + iconHtml(it.icon) + '</span>'
          + '<span class="si-label">' + it.label + '</span></div>';
      }).join('');

      right.querySelectorAll('.start-item').forEach(el => {
        el.addEventListener('click', () => {
          Apps.openApp(el.dataset.app);
          Desktop.closeStartMenu();
        });
      });
    }

    // All Programs row (visual only)
    const allProg = document.getElementById('start-all-programs');
    if (allProg) {
      allProg.addEventListener('click', () => {
        Apps.openApp('my-computer');
        Desktop.closeStartMenu();
      });
    }

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

  return { render, startClock, initStartMenu };
})();

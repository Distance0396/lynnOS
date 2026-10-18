/* ===== desktop.js — Desktop Icons & Interactions ===== */
const Desktop = (() => {

  /* --- Icon definitions --- */
  const ICONS = [
    { id: 'about-me',      label: '关于我',       icon: 'assets/icons/xp/32/user-key.png', app: 'about-me' },
    { id: 'guestbook',     label: '留言板',       icon: 'assets/icons/xp/32/document-edit.png', app: 'guestbook' },
    { id: 'my-computer',   label: '我的电脑',     icon: 'assets/icons/xp/32/my-computer.png', app: 'my-computer' },
    { id: 'recycle-bin',   label: '回收站',       icon: 'assets/icons/xp/32/recycle-bin.png', app: 'recycle-bin' },
  ];

  /* --- Render icons --- */
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

      // Single click: select
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectIcon(ic.app);
      });

      // Double click: open app
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        Apps.openApp(ic.app);
      });

      area.appendChild(el);
    });
  }

  function selectIcon(appId) {
    DesktopState.state.selectedIcon = appId;
    document.querySelectorAll('.desktop-icon').forEach(el => {
      el.classList.toggle('selected', el.dataset.app === appId);
    });
  }

  function clearSelection() {
    DesktopState.state.selectedIcon = null;
    document.querySelectorAll('.desktop-icon.selected').forEach(el => {
      el.classList.remove('selected');
    });
  }

  /* --- Click on desktop blank area --- */
  function initDesktopClicks() {
    const root = document.getElementById('desktop-root');
    if (!root) return;
    root.addEventListener('click', (e) => {
      // Only if clicking directly on desktop / wallpaper / window-container
      if (e.target.id === 'desktop-root' ||
          e.target.id === 'wallpaper' ||
          e.target.id === 'wallpaper-overlay' ||
          e.target.id === 'window-container') {
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

  return { render, selectIcon, clearSelection, initDesktopClicks, closeStartMenu, ICONS };
})();

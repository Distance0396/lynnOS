// @ts-nocheck
/* ===== apps/my-computer.ts ===== */
import { Apps } from './registry';

Apps.register({
  id: 'my-computer', title: '我的电脑', icon: 'assets/icons/xp/32/my-computer.png', width: 750, height: 500,
  renderContent(body) {
    body.classList.add('no-scroll');

    // ---- Menu Bar ----
    const menubar = document.createElement('div');
    menubar.className = 'xp-menubar';
    ['文件(F)', '编辑(E)', '查看(V)', '收藏(A)', '工具(T)', '帮助(H)'].forEach(m => {
      const s = document.createElement('span');
      s.textContent = m;
      menubar.appendChild(s);
    });

    // ---- Toolbar ----
    const toolbar = document.createElement('div');
    toolbar.className = 'xp-toolbar';

    const tbBtns = [
      { label: '后退', icon: '◀', disabled: true },
      { label: '前进', icon: '▶', disabled: true },
      { label: '向上', icon: '▲', disabled: true },
      { sep: true },
      { label: '文件夹', icon: 'assets/icons/xp/16/folder-closed.png', disabled: true },
      { label: '视图(V)', icon: '▼', disabled: true },
    ];
    tbBtns.forEach(b => {
      if (b.sep) {
        const sep = document.createElement('div');
        sep.className = 'xp-toolbar-sep';
        toolbar.appendChild(sep);
        return;
      }
      const btn = document.createElement('button');
      btn.className = 'xp-toolbar-btn' + (b.disabled ? ' disabled' : '');
      const iconHtml = b.icon.includes('/') || b.icon.includes('.')
        ? '<img src="' + b.icon + '" alt="">'
        : '<span>' + b.icon + '</span>';
      btn.innerHTML = iconHtml + '<span>' + b.label + '</span>';
      if (b.disabled) btn.disabled = true;
      toolbar.appendChild(btn);
    });

    // ---- Address Bar ----
    const addrbar = document.createElement('div');
    addrbar.className = 'xp-addressbar';
    addrbar.innerHTML =
      '<span class="xp-addressbar-label">地址(D)</span>' +
      '<input class="xp-addressbar-input" type="text" value="我的电脑" readonly>' +
      '<button class="xp-addressbar-go">▶ 转到(G)</button>';

    // ---- Explorer Body ----
    const explorer = document.createElement('div');
    explorer.className = 'xp-explorer';

    // -- Left Sidebar --
    const sidebar = document.createElement('div');
    sidebar.className = 'xp-sidebar';

    // System Tasks
    const sysSection = document.createElement('div');
    sysSection.className = 'xp-sidebar-section';
    sysSection.innerHTML =
      '<div class="xp-sidebar-header"><span class="arrow">▼</span> 系统任务</div>' +
      '<div class="xp-sidebar-links">' +
        '<a class="xp-sidebar-link" data-app="about-me"><img src="assets/icons/xp/16/computer-tower.png"> 查看有关本机的基本信息</a>' +
        '<a class="xp-sidebar-link" data-app="settings"><img src="assets/icons/xp/16/settings-gear.png"> 添加或删除程序</a>' +
        '<a class="xp-sidebar-link" data-app="settings"><img src="assets/icons/xp/16/folder-settings.png"> 更改一个设置</a>' +
      '</div>';

    // Other Places
    const otherSection = document.createElement('div');
    otherSection.className = 'xp-sidebar-section';
    otherSection.innerHTML =
      '<div class="xp-sidebar-header"><span class="arrow">▼</span> 其他位置</div>' +
      '<div class="xp-sidebar-links">' +
        '<a class="xp-sidebar-link" data-app="article-archive"><img src="assets/icons/xp/16/folder-documents.png"> 文章档案</a>' +
        '<a class="xp-sidebar-link" data-app="photo-memory"><img src="assets/icons/xp/16/folder-pictures.png"> 照片记忆</a>' +
        '<a class="xp-sidebar-link" data-app="music-collection"><img src="assets/icons/xp/16/folder-music.png"> 音乐收藏</a>' +
        '<a class="xp-sidebar-link" data-app="tech-notes"><img src="assets/icons/xp/16/notepad-config.png"> 技术笔记</a>' +
      '</div>';

    sidebar.append(sysSection, otherSection);

    // -- Right Content Area --
    const content = document.createElement('div');
    content.className = 'xp-content';

    const grid = document.createElement('div');
    grid.className = 'xp-content-grid';

    const items = [
      { icon: 'assets/icons/xp/32/hard-drive.png', label: '本地磁盘 (C:)', app: 'article-archive' },
      { icon: 'assets/icons/xp/32/folder-documents.png', label: '文章档案', app: 'article-archive' },
      { icon: 'assets/icons/xp/32/folder-pictures.png', label: '照片记忆', app: 'photo-memory' },
      { icon: 'assets/icons/xp/32/folder-music.png', label: '音乐收藏', app: 'music-collection' },
      { icon: 'assets/icons/xp/32/notepad-config.png', label: '技术笔记', app: 'tech-notes' },
      { icon: 'assets/icons/xp/32/settings-gear.png', label: '系统设置', app: 'settings' },
    ];

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'xp-content-item';
      el.dataset.app = item.app;
      el.innerHTML = '<img src="' + item.icon + '"><span class="xp-item-label">' + item.label + '</span>';
      el.addEventListener('click', () => {
        grid.querySelectorAll('.xp-content-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
      });
      el.addEventListener('dblclick', () => {
        Apps.openApp(item.app);
      });
      grid.appendChild(el);
    });

    content.appendChild(grid);
    explorer.append(sidebar, content);

    // ---- Status Bar ----
    const statusbar = document.createElement('div');
    statusbar.className = 'window-statusbar';
    statusbar.textContent = '我的电脑 · ' + items.length + ' 个项目';

    // Sidebar link clicks
    sidebar.querySelectorAll('.xp-sidebar-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (link.dataset.app) Apps.openApp(link.dataset.app);
      });
    });

    // ---- Assemble ----
    body.append(menubar, toolbar, addrbar, explorer, statusbar);
  }
});

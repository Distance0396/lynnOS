/* ===== apps/chrome.ts — XP Window Chrome Helpers ===== */

export interface ToolbarBtn { label: string; icon: string; disabled?: boolean; sep?: boolean }
export interface SidebarLink { label: string; icon: string; app?: string; [key: string]: any }

export function createXPChrome(body: HTMLElement, cfg: {
  menus?: string[];
  toolbar?: ToolbarBtn[];
  address?: string;
  statusText?: string;
}) {
  body.classList.add('no-scroll');
  body.innerHTML = '';

  const menubar = document.createElement('div');
  menubar.className = 'xp-menubar';
  const menuItems = cfg.menus || ['文件(F)', '编辑(E)', '查看(V)', '收藏(A)', '工具(T)', '帮助(H)'];
  menuItems.forEach(m => {
    const s = document.createElement('span');
    s.textContent = m;
    menubar.appendChild(s);
  });

  const toolbar = document.createElement('div');
  toolbar.className = 'xp-toolbar';
  const tbBtns = cfg.toolbar || [
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

  const addrbar = document.createElement('div');
  addrbar.className = 'xp-addressbar';
  addrbar.innerHTML =
    '<span class="xp-addressbar-label">地址(D)</span>' +
    '<input class="xp-addressbar-input" type="text" value="' + (cfg.address || '') + '" readonly>' +
    '<button class="xp-addressbar-go">▶ 转到(G)</button>';

  const explorer = document.createElement('div');
  explorer.className = 'xp-explorer';

  const sidebar = document.createElement('div');
  sidebar.className = 'xp-sidebar';

  const content = document.createElement('div');
  content.className = 'xp-content';

  explorer.append(sidebar, content);

  const statusbar = document.createElement('div');
  statusbar.className = 'window-statusbar';
  statusbar.textContent = cfg.statusText || '';

  body.append(menubar, toolbar, addrbar, explorer, statusbar);

  return { sidebar, content, statusbar };
}

export function createSidebarSection(title: string, links: SidebarLink[]) {
  const section = document.createElement('div');
  section.className = 'xp-sidebar-section';
  section.innerHTML =
    '<div class="xp-sidebar-header"><span class="arrow">▼</span> ' + title + '</div>' +
    '<div class="xp-sidebar-links">' +
      links.map(l => '<a class="xp-sidebar-link" data-app="' + (l.app || '') + '"><img src="' + (l.icon || '') + '"> ' + l.label + '</a>').join('') +
    '</div>';
  return section;
}

export const XPChrome = { createXPChrome, createSidebarSection };

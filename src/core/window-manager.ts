/* ===== window-manager.ts — Render & Manage XP Windows (incremental) ===== */
import { DesktopState, type WindowInfo } from './state';
import { Atmosphere } from './atmosphere';
import { Taskbar } from './taskbar';
import { TASKBAR_HEIGHT } from '../constants';

const TASKBAR_H = TASKBAR_HEIGHT;

/* Narrow viewport (≤768px): windows always render maximized, drag/resize disabled */
const isNarrow = () => window.innerWidth <= 768;

// Auto-render whenever state changes (pub/sub)
DesktopState.subscribe(() => renderAll());

const container = () => document.getElementById('window-container');

/* --- Position calculation for new windows (unified: screen-centered) --- */
function calcOpenPosition(width: number, height: number) {
  const vw = window.innerWidth, vh = window.innerHeight - TASKBAR_H;
  const x = Math.max(0, Math.round((vw - width) / 2));
  const y = Math.max(0, Math.round((vh - height) / 2));
  return { x, y };
}

/* --- Compute display bounds for a window (handles maximized & narrow screens) --- */
function displayBounds(w: WindowInfo) {
  if (w.state === 'maximized' || (isNarrow() && w.state !== 'minimized')) {
    return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight - TASKBAR_H };
  }
  return { x: w.x, y: w.y, width: w.width, height: w.height };
}

/* --- Open a window --- */
function openWindow(appDef: {
  id: string;
  title: string;
  icon: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  renderContent?: (body: HTMLElement, win: WindowInfo) => void;
}) {
  const existing = DesktopState.findWindowByApp(appDef.id);
  if (existing) {
    DesktopState.activateWindow(existing.id);
    renderAll();
    return;
  }
  const pos = calcOpenPosition(appDef.width ?? 600, appDef.height ?? 450);
  DesktopState.addWindow({
    appId: appDef.id,
    title: appDef.title,
    icon: appDef.icon,
    x: pos.x,
    y: pos.y,
    width: appDef.width ?? 600,
    height: appDef.height ?? 450,
    minWidth: appDef.minWidth ?? 280,
    minHeight: appDef.minHeight ?? 160,
    renderContent: appDef.renderContent,
  });
  renderAll();
  Atmosphere.playOpen();
}

/* --- Close --- */
function closeWindow(winId: string) {
  const w = DesktopState.state.windows.get(winId);
  const el = w && w.el ? w.el : document.getElementById(winId);
  if (el) {
    const body = el.querySelector('.window-body');
    if (body && (body as any)._cleanup) (body as any)._cleanup();
    el.style.animation = 'win-close 140ms ease-in forwards';
    Atmosphere.playClose();
    setTimeout(() => {
      if (w) w.el = null;
      DesktopState.removeWindow(winId);
      renderAll();
    }, 130);
  } else {
    DesktopState.removeWindow(winId);
    renderAll();
  }
}

/* --- Minimize --- */
function minimizeWindow(winId: string) {
  const w = DesktopState.state.windows.get(winId);
  if (!w) return;
  w.state = 'minimized';
  if (DesktopState.state.activeWinId === winId) {
    DesktopState.state.activeWinId = null;
    let top: WindowInfo | null = null;
    for (const [, ww] of DesktopState.state.windows) {
      if (ww.state !== 'minimized' && (!top || ww.z > top.z)) top = ww;
    }
    if (top) DesktopState.state.activeWinId = top.id;
  }
  renderAll();
}

/* --- Maximize / Restore --- */
function toggleMaximize(winId: string) {
  const w = DesktopState.state.windows.get(winId);
  if (!w) return;
  if (w.state === 'maximized') {
    if (w.prevBounds) {
      w.x = w.prevBounds.x; w.y = w.prevBounds.y;
      w.width = w.prevBounds.width; w.height = w.prevBounds.height;
    }
    w.state = 'normal';
    w.prevBounds = null;
  } else {
    w.prevBounds = { x: w.x, y: w.y, width: w.width, height: w.height };
    w.state = 'maximized';
  }
  DesktopState.activateWindow(winId);
  renderAll();
}

/* --- Render All Windows (incremental) --- */
function renderAll() {
  const c = container();
  if (!c) return;
  const { windows, activeWinId } = DesktopState.state;
  const aliveIds = new Set<string>();

  for (const [winId, w] of windows) {
    aliveIds.add(winId);
    if (!w.el) {
      w.el = buildWindowEl(w);
      c.appendChild(w.el);
    }
    updateWindowEl(w, winId === activeWinId);
  }

  Array.from(c.children).forEach(child => {
    if (!aliveIds.has(child.id)) child.remove();
  });

  Taskbar.render();
}

/* --- Update cached window element's style/class from state --- */
function updateWindowEl(w: WindowInfo, isActive: boolean) {
  const el = w.el;
  if (!el) return;
  const b = displayBounds(w);

  el.style.left = b.x + 'px';
  el.style.top = b.y + 'px';
  el.style.width = b.width + 'px';
  el.style.height = b.height + 'px';
  el.style.zIndex = String(w.z);

  el.classList.toggle('inactive', !isActive);
  el.classList.toggle('minimized', w.state === 'minimized');
  el.classList.toggle('maximized', w.state === 'maximized' || (isNarrow() && w.state !== 'minimized'));

  const btnMax = el.querySelector('[aria-label="Maximize"], [aria-label="Restore"]') as HTMLButtonElement | null;
  if (btnMax) {
    const isMax = w.state === 'maximized';
    btnMax.setAttribute('aria-label', isMax ? 'Restore' : 'Maximize');
    btnMax.title = isMax ? '还原' : '最大化';
  }
}

/* --- Build single window DOM (called once per window; cached in w.el) --- */
function buildWindowEl(w: WindowInfo): HTMLElement {
  const el = document.createElement('div');
  el.id = w.id;
  el.className = 'window';

  const titlebar = document.createElement('div');
  titlebar.className = 'title-bar';

  const titleGroup = document.createElement('div');
  titleGroup.className = 'title-bar-left';

  const icon = document.createElement('span');
  icon.className = 'title-bar-icon';
  const titleIcon = w.icon ? w.icon.replace('/32/', '/16/').replace('/48/', '/16/') : '';
  if (titleIcon && (titleIcon.includes('/') || titleIcon.includes('.'))) {
    icon.innerHTML = '<img src="' + titleIcon + '" alt="">';
  } else {
    icon.textContent = w.icon || '';
  }

  const title = document.createElement('span');
  title.className = 'title-bar-text';
  title.textContent = w.title;

  titleGroup.append(icon, title);

  const controls = document.createElement('div');
  controls.className = 'title-bar-controls';

  const btnMin = document.createElement('button');
  btnMin.setAttribute('aria-label', 'Minimize');
  btnMin.innerHTML = '&#x2013;';
  btnMin.title = '最小化';
  btnMin.addEventListener('click', (e) => { e.stopPropagation(); minimizeWindow(w.id); });

  const btnMax = document.createElement('button');
  btnMax.setAttribute('aria-label', 'Maximize');
  btnMax.innerHTML = '&#x25A1;';
  btnMax.title = '最大化';
  btnMax.addEventListener('click', (e) => { e.stopPropagation(); toggleMaximize(w.id); });

  const btnClose = document.createElement('button');
  btnClose.setAttribute('aria-label', 'Close');
  btnClose.innerHTML = '&#x2715;';
  btnClose.title = '关闭';
  btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(w.id); });

  controls.append(btnMin, btnMax, btnClose);
  titlebar.append(titleGroup, controls);

  const body = document.createElement('div');
  body.className = 'window-body';
  el.append(titlebar, body);

  if (w.renderContent) {
    w.renderContent(body, w);
  }

  ['n','s','e','w','ne','nw','se','sw'].forEach(dir => {
    const h = document.createElement('div');
    h.className = 'resize-handle resize-' + dir;
    h.addEventListener('mousedown', (e) => startResize(e, w.id, dir));
    el.appendChild(h);
  });

  titlebar.addEventListener('mousedown', (e) => {
    if ((e.target as HTMLElement).closest('.title-bar-controls')) return;
    if (w.state === 'maximized') return;
    startDrag(e, w.id);
  });

  titlebar.addEventListener('dblclick', (e) => {
    if ((e.target as HTMLElement).closest('.title-bar-controls')) return;
    toggleMaximize(w.id);
  });

  el.addEventListener('mousedown', () => {
    if (DesktopState.state.activeWinId !== w.id) {
      DesktopState.activateWindow(w.id);
      renderAll();
    }
  });

  return el;
}

/* --- Drag Logic --- */
function startDrag(e: MouseEvent, winId: string) {
  if (isNarrow()) return;
  e.preventDefault();
  const w = DesktopState.state.windows.get(winId);
  if (!w) return;
  const win = w;
  const startX = e.clientX, startY = e.clientY;
  const origX = w.x, origY = w.y;
  const vw = window.innerWidth;
  const vh = window.innerHeight - TASKBAR_H;

  function onMove(ev: MouseEvent) {
    let nx = origX + (ev.clientX - startX);
    let ny = origY + (ev.clientY - startY);
    const minVisibleTitle = 40;
    nx = Math.max(-(win.width - minVisibleTitle), Math.min(vw - minVisibleTitle, nx));
    ny = Math.max(0, Math.min(vh - 30, ny));
    if (nx + win.width < minVisibleTitle) nx = -(win.width - minVisibleTitle);
    if (ny + win.height > vh) ny = vh - win.height;
    win.x = nx; win.y = ny;
    if (win.el) { win.el.style.left = nx + 'px'; win.el.style.top = ny + 'px'; }
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

/* --- Resize Logic --- */
function startResize(e: MouseEvent, winId: string, dir: string) {
  e.preventDefault(); e.stopPropagation();
  if (isNarrow()) return;
  const w = DesktopState.state.windows.get(winId);
  if (!w || w.state === 'maximized') return;
  const win = w;
  const startX = e.clientX, startY = e.clientY;
  const origX = w.x, origY = w.y, origW = w.width, origH = w.height;

  function onMove(ev: MouseEvent) {
    const dx = ev.clientX - startX, dy = ev.clientY - startY;
    let nx = origX, ny = origY, nw = origW, nh = origH;

    if (dir.includes('e')) nw = Math.max(win.minWidth, origW + dx);
    if (dir.includes('w')) { nw = Math.max(win.minWidth, origW - dx); nx = origX + origW - nw; }
    if (dir.includes('s')) nh = Math.max(win.minHeight, origH + dy);
    if (dir.includes('n')) { nh = Math.max(win.minHeight, origH - dy); ny = origY + origH - nh; }

    win.x = nx; win.y = ny; win.width = nw; win.height = nh;
    if (win.el) {
      win.el.style.left = nx + 'px'; win.el.style.top = ny + 'px';
      win.el.style.width = nw + 'px'; win.el.style.height = nh + 'px';
    }
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

/* Re-render on viewport resize so narrow-mode (≤768px) applies live */
let _resizeTimer: ReturnType<typeof setTimeout> | undefined;
window.addEventListener('resize', () => {
  if (_resizeTimer) clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => renderAll(), 100);
});

export const WindowManager = { openWindow, closeWindow, minimizeWindow, toggleMaximize, renderAll };

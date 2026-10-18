/* ===== window-manager.js — Render & Manage XP Windows ===== */
const WindowManager = (() => {
  const container = () => document.getElementById('window-container');
  const TASKBAR_H = 40;

  /* --- Position calculation for new windows (unified: screen-centered) --- */
  function calcOpenPosition(width, height) {
    const vw = window.innerWidth, vh = window.innerHeight - TASKBAR_H;
    const x = Math.max(0, Math.round((vw - width) / 2));
    const y = Math.max(0, Math.round((vh - height) / 2));
    return { x, y };
  }

  /* --- Open a window --- */
  function openWindow(appDef) {
    // If same app already open, just activate
    const existing = DesktopState.findWindowByApp(appDef.id);
    if (existing) {
      DesktopState.activateWindow(existing.id);
      renderAll();
      return;
    }
    const pos = calcOpenPosition(appDef.width ?? 600, appDef.height ?? 450);
    const win = DesktopState.addWindow({
      appId: appDef.id,
      title: appDef.title,
      icon: appDef.icon,
      x: pos.x,
      y: pos.y,
      width: appDef.width,
      height: appDef.height,
      minWidth: appDef.minWidth,
      minHeight: appDef.minHeight,
      renderContent: appDef.renderContent,
    });
    renderAll();
    if (typeof Atmosphere !== 'undefined') Atmosphere.playOpen();
  }

  /* --- Close --- */
  function closeWindow(winId) {
    const el = document.getElementById(winId);
    if (el) {
      // Cleanup: call _cleanup on body if it exists
      const body = el.querySelector('.window-body');
      if (body && body._cleanup) body._cleanup();
      el.style.animation = 'win-close 140ms ease-in forwards';
      if (typeof Atmosphere !== 'undefined') Atmosphere.playClose();
      setTimeout(() => {
        DesktopState.removeWindow(winId);
        renderAll();
      }, 130);
    } else {
      DesktopState.removeWindow(winId);
      renderAll();
    }
  }

  /* --- Minimize --- */
  function minimizeWindow(winId) {
    const w = DesktopState.state.windows.get(winId);
    if (!w) return;
    w.state = 'minimized';
    if (DesktopState.state.activeWinId === winId) {
      DesktopState.state.activeWinId = null;
      // find topmost
      let top = null;
      for (const [wid, ww] of DesktopState.state.windows) {
        if (ww.state !== 'minimized' && (!top || ww.z > top.z)) top = ww;
      }
      if (top) DesktopState.state.activeWinId = top.id;
    }
    renderAll();
  }

  /* --- Maximize / Restore --- */
  function toggleMaximize(winId) {
    const w = DesktopState.state.windows.get(winId);
    if (!w) return;
    if (w.state === 'maximized') {
      // restore
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

  /* --- Render All Windows --- */
  function renderAll() {
    const c = container();
    if (!c) return;
    // Clear
    c.innerHTML = '';
    const { windows, activeWinId } = DesktopState.state;

    for (const [winId, w] of windows) {
      const el = buildWindowEl(w, winId === activeWinId);
      c.appendChild(el);
    }
    Taskbar.render();
  }

  /* --- Build single window DOM --- */
  function buildWindowEl(w, isActive) {
    const vw = window.innerWidth;
    const vh = window.innerHeight - TASKBAR_H;

    let x = w.x, y = w.y, width = w.width, height = w.height;

    if (w.state === 'maximized') {
      x = 0; y = 0; width = vw; height = vh;
    }

    const el = document.createElement('div');
    el.className = 'window' + (isActive ? '' : ' inactive') + (w.state === 'minimized' ? ' minimized' : '') + (w.state === 'maximized' ? ' maximized' : '');
    el.id = w.id;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.zIndex = w.z;

    // Title bar
    const titlebar = document.createElement('div');
    titlebar.className = 'title-bar';

    // Left group: icon + title
    const titleGroup = document.createElement('div');
    titleGroup.className = 'title-bar-left';

    const icon = document.createElement('span');
    icon.className = 'title-bar-icon';
    // Use 16px version for title bar
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
    btnMax.setAttribute('aria-label', w.state === 'maximized' ? 'Restore' : 'Maximize');
    btnMax.innerHTML = '&#x25A1;';
    btnMax.title = w.state === 'maximized' ? '还原' : '最大化';
    btnMax.addEventListener('click', (e) => { e.stopPropagation(); toggleMaximize(w.id); });

    const btnClose = document.createElement('button');
    btnClose.setAttribute('aria-label', 'Close');
    btnClose.innerHTML = '&#x2715;';
    btnClose.title = '关闭';
    btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(w.id); });

    controls.append(btnMin, btnMax, btnClose);
    titlebar.append(titleGroup, controls);

    // Content body
    const body = document.createElement('div');
    body.className = 'window-body';
    el.append(titlebar, body);

    if (w.renderContent) {
      w.renderContent(body, w);
    }

    // Resize handles (only if not maximized)
    if (w.state !== 'maximized') {
      ['n','s','e','w','ne','nw','se','sw'].forEach(dir => {
        const h = document.createElement('div');
        h.className = 'resize-handle resize-' + dir;
        h.addEventListener('mousedown', (e) => startResize(e, w.id, dir));
        el.appendChild(h);
      });
    }

    // Drag from titlebar
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.title-bar-controls')) return;
      if (w.state === 'maximized') return;
      startDrag(e, w.id);
    });

    // Double-click titlebar to maximize
    titlebar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.title-bar-controls')) return;
      toggleMaximize(w.id);
    });

    // Click to activate
    el.addEventListener('mousedown', () => {
      if (DesktopState.state.activeWinId !== w.id) {
        DesktopState.activateWindow(w.id);
        renderAll();
      }
    });

    return el;
  }

  /* --- Drag Logic --- */
  function startDrag(e, winId) {
    e.preventDefault();
    const w = DesktopState.state.windows.get(winId);
    if (!w) return;
    const startX = e.clientX, startY = e.clientY;
    const origX = w.x, origY = w.y;
    const vw = window.innerWidth;
    const vh = window.innerHeight - TASKBAR_H;

    function onMove(ev) {
      let nx = origX + (ev.clientX - startX);
      let ny = origY + (ev.clientY - startY);
      // Constrain: titlebar must remain partially visible, window can't go below taskbar
      const minVisibleTitle = 40;
      nx = Math.max(-(w.width - minVisibleTitle), Math.min(vw - minVisibleTitle, nx));
      ny = Math.max(0, Math.min(vh - 30, ny));
      // Also prevent window from going off right/bottom edges completely
      if (nx + w.width < minVisibleTitle) nx = -(w.width - minVisibleTitle);
      if (ny + w.height > vh) ny = vh - w.height;
      w.x = nx; w.y = ny;
      const el = document.getElementById(winId);
      if (el) { el.style.left = nx + 'px'; el.style.top = ny + 'px'; }
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  /* --- Resize Logic --- */
  function startResize(e, winId, dir) {
    e.preventDefault(); e.stopPropagation();
    const w = DesktopState.state.windows.get(winId);
    if (!w || w.state === 'maximized') return;
    const startX = e.clientX, startY = e.clientY;
    const origX = w.x, origY = w.y, origW = w.width, origH = w.height;

    function onMove(ev) {
      let dx = ev.clientX - startX, dy = ev.clientY - startY;
      let nx = origX, ny = origY, nw = origW, nh = origH;

      if (dir.includes('e')) nw = Math.max(w.minWidth, origW + dx);
      if (dir.includes('w')) { nw = Math.max(w.minWidth, origW - dx); nx = origX + origW - nw; }
      if (dir.includes('s')) nh = Math.max(w.minHeight, origH + dy);
      if (dir.includes('n')) { nh = Math.max(w.minHeight, origH - dy); ny = origY + origH - nh; }

      w.x = nx; w.y = ny; w.width = nw; w.height = nh;
      const el = document.getElementById(winId);
      if (el) {
        el.style.left = nx + 'px'; el.style.top = ny + 'px';
        el.style.width = nw + 'px'; el.style.height = nh + 'px';
      }
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  return { openWindow, closeWindow, minimizeWindow, toggleMaximize, renderAll };
})();

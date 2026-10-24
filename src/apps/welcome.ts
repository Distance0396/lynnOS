// @ts-nocheck
/* ===== apps/welcome.ts ===== */
import { Apps } from './legacy-registry';
import { XPChrome } from './chrome';
import { DesktopState } from '../core/state';
import { WindowManager } from '../core/window-manager';

Apps.register({
  id: 'welcome',
  title: 'Welcome to my little world',
  icon: 'assets/icons/xp/32/notepad-file.png',
  width: 540, height: 370,
  renderContent(body) {
    const { content, statusbar } = XPChrome.createXPChrome(body, {
      address: 'Welcome',
      statusText: 'Welcome to my little world'
    });

    statusbar.textContent = 'Somewhere.exe v1.0.0';
    content.style.cssText = 'display:flex;flex-direction:column;height:100%;';
    content.innerHTML = `
      <div class="welcome-content" style="flex:1;">
        <div class="welcome-left"><img src="assets/icons/xp/32/windows-logo.png" alt=""></div>
        <div class="welcome-right">
          <h2>Somewhere.exe</h2>
          <p class="welcome-subtitle">Somewhere between yesterday and a dream.</p>
          <p class="welcome-msg">欢迎回来。这里保存着一些记忆、照片、文字和没有完成的事情。<br>有些记忆没有消失，只是安静地保存在这里。</p>
          <p class="welcome-meta">版本 1.0.0 · 最后更新: 2026-10-16</p>
        </div>
      </div>
      <div class="welcome-actions">
        <button class="xp-btn primary" data-nav="article-archive">Open my archive</button>
        <button class="xp-btn" data-action="close-welcome">Explore desktop</button>
        <button class="xp-btn" data-action="close-self">Close</button>
      </div>
    `;

    content.querySelector('[data-nav]').addEventListener('click', () => {
      Apps.openApp('article-archive');
    });
    content.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = DesktopState.findWindowByApp('welcome');
        if (w) WindowManager.closeWindow(w.id);
      });
    });
  }
});

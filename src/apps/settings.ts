// @ts-nocheck
/* ===== apps/settings.ts ===== */
import { Apps } from './legacy-registry';
import { XPChrome } from './chrome';
import { DesktopState } from '../core/state';
import { Atmosphere } from '../core/atmosphere';
import { STORAGE_KEYS } from '../constants';

Apps.register({
  id: 'settings', title: '系统设置', icon: 'assets/icons/xp/32/settings-gear.png', width: 580, height: 500,
  renderContent(body) {
    const wps = Atmosphere.WALLPAPERS;

    const { content, statusbar } = XPChrome.createXPChrome(body, {
      address: '系统设置',
      statusText: '系统设置'
    });

    statusbar.textContent = '系统设置';
    content.style.cssText = 'padding:20px;font-size:13px;overflow:auto;height:100%;';

    function render() {
      const cur = DesktopState.state.settings;
      content.innerHTML =
        '<h3 style="font-size:16px;color:var(--xp-blue);margin-bottom:14px;">系统设置</h3>' +

        // Wallpaper section
        '<div class="settings-section">' +
          '<h4>桌面壁纸</h4>' +
          '<div style="display:flex;flex-wrap:wrap;gap:10px;">' +
            Object.entries(wps).map(([key, wp]) =>
              '<div style="text-align:center;cursor:pointer;" data-wp="' + key + '">' +
                '<div class="wallpaper-preview ' + wp.gradient + (cur.wallpaper === key ? ' active' : '') + '"></div>' +
                '<div style="font-size:11px;margin-top:3px;' + (cur.wallpaper === key ? 'color:var(--xp-blue);font-weight:bold;' : 'color:var(--text-secondary);') + '">' + wp.label + '</div>' +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>' +

        // Toggle section
        '<div class="settings-section">' +
          '<h4>显示与效果</h4>' +
          '<div class="settings-row"><input type="checkbox" id="set-anim" ' + (cur.animationsEnabled ? 'checked' : '') + '> <label for="set-anim">启用背景动画与粒子效果</label></div>' +
          '<div class="settings-row"><input type="checkbox" id="set-sound" ' + (cur.soundEnabled ? 'checked' : '') + '> <label for="set-sound">启用系统音效</label></div>' +
          '<div class="settings-row"><input type="checkbox" id="set-icons" ' + (cur.iconsVisible ? 'checked' : '') + '> <label for="set-icons">显示桌面图标</label></div>' +
        '</div>' +

        // Actions
        '<div style="margin-top:16px;display:flex;gap:8px;">' +
          '<button class="xp-btn" id="set-reset">恢复默认布局</button>' +
          '<button class="xp-btn" id="set-clear">清除本地数据</button>' +
        '</div>' +

        // Info
        '<div style="margin-top:16px;padding:10px;background:#F0F0E8;border:1px solid #D5D2C5;font-size:11px;color:var(--text-secondary);line-height:1.6;">' +
          '设置会自动保存在浏览器本地。<br>' +
          '“清除本地数据”会删除留言板演示数据和桌面设置。' +
        '</div>';

      // Wallpaper click
      content.querySelectorAll('[data-wp]').forEach(el => {
        el.addEventListener('click', () => {
          DesktopState.state.settings.wallpaper = el.dataset.wp;
          Atmosphere.applyWallpaper();
          Atmosphere.saveSettings();
          Atmosphere.playClick();
          render();
        });
      });

      // Animation toggle
      const animCb = content.querySelector('#set-anim');
      if (animCb) animCb.addEventListener('change', () => {
        DesktopState.state.settings.animationsEnabled = animCb.checked;
        Atmosphere.applyAnimations();
        Atmosphere.saveSettings();
      });

      // Sound toggle
      const soundCb = content.querySelector('#set-sound');
      if (soundCb) soundCb.addEventListener('change', () => {
        DesktopState.state.settings.soundEnabled = soundCb.checked;
        Atmosphere.saveSettings();
        // Update tray icon
        const volIcon = document.getElementById('tray-volume');
        if (volIcon) {
          const img = volIcon.querySelector('img');
          if (img) img.src = soundCb.checked ? 'assets/icons/xp/16/volume.png' : 'assets/icons/xp/16/error.png';
        }
        if (soundCb.checked) Atmosphere.playClick();
      });

      // Icons toggle
      const iconCb = content.querySelector('#set-icons');
      if (iconCb) iconCb.addEventListener('change', () => {
        DesktopState.state.settings.iconsVisible = iconCb.checked;
        Atmosphere.applyIconsVisible();
        Atmosphere.saveSettings();
      });

      // Reset layout
      const resetBtn = content.querySelector('#set-reset');
      if (resetBtn) resetBtn.addEventListener('click', () => {
        Atmosphere.resetSettings();
        Atmosphere.playClick();
        render();
      });

      // Clear data
      const clearBtn = content.querySelector('#set-clear');
      if (clearBtn) clearBtn.addEventListener('click', () => {
        try {
          localStorage.removeItem(STORAGE_KEYS.settings);
          localStorage.removeItem(STORAGE_KEYS.guestbook);
        } catch(e) { console.warn('Failed to clear settings:', e); }
        Atmosphere.resetSettings();
        Atmosphere.playClick();
        Atmosphere.showSystemDialog({
          icon: 'assets/icons/xp/32/help.png', title: '操作完成',
          text: '本地数据已清除。<br>桌面已恢复默认设置。'
        }, 8000);
        render();
      });
    }

    render();
  }
});

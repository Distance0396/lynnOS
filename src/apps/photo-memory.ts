// @ts-nocheck
/* ===== apps/photo-memory.ts ===== */
import { Apps } from './registry';
import { XPChrome } from './chrome';
import { DesktopState } from '../core/state';
import { WindowManager } from '../core/window-manager';
import { PHOTOS } from '../data/photos';

/* Photo Viewer */
function openPhotoViewer(photo, allPhotos, currentIndex) {
  const appDef = {
    id: 'photo-viewer-' + photo.id,
    title: photo.title,
    icon: 'assets/icons/xp/32/camera.png',
    width: 600, height: 480,
    renderContent(body) {
      let idx = currentIndex;

      const { content, statusbar } = XPChrome.createXPChrome(body, {
        address: photo.title,
        statusText: '照片查看器'
      });

      function renderPhoto() {
        const p = allPhotos[idx];
        statusbar.textContent = p.title + ' (' + (idx+1) + '/' + allPhotos.length + ')';

        content.style.cssText = 'display:flex;flex-direction:column;height:100%;background:#2A2A2A;';
        content.innerHTML =
          '<div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">' +
            '<div style="width:100%;height:100%;background:' + p.gradient + ';"></div>' +
            '<button class="xp-btn" id="photo-prev" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:18px;padding:4px 10px;">◀</button>' +
            '<button class="xp-btn" id="photo-next" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:18px;padding:4px 10px;">▶</button>' +
          '</div>' +
          '<div style="padding:10px 16px;background:var(--win-bg);border-top:1px solid #D5D2C5;">' +
            '<div style="font-size:13px;font-weight:bold;color:var(--text-primary);">' + p.title + '</div>' +
            '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">' + p.date + ' · ' + p.category + ' · ' + p.mood + '</div>' +
            '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;font-style:italic;">' + p.desc + '</div>' +
          '</div>';

        content.querySelector('#photo-prev').addEventListener('click', () => {
          idx = (idx - 1 + allPhotos.length) % allPhotos.length;
          renderPhoto();
        });
        content.querySelector('#photo-next').addEventListener('click', () => {
          idx = (idx + 1) % allPhotos.length;
          renderPhoto();
        });
      }
      renderPhoto();

      // Keyboard navigation
      body._keyHandler = (e) => {
        if (e.key === 'ArrowLeft') { idx = (idx - 1 + allPhotos.length) % allPhotos.length; renderPhoto(); }
        if (e.key === 'ArrowRight') { idx = (idx + 1) % allPhotos.length; renderPhoto(); }
        if (e.key === 'Escape') {
          const w = DesktopState.findWindowByApp('photo-viewer-' + photo.id);
          if (w) WindowManager.closeWindow(w.id);
        }
      };
      document.addEventListener('keydown', body._keyHandler);
      body._cleanup = () => { document.removeEventListener('keydown', body._keyHandler); };
    }
  };
  WindowManager.openWindow(appDef);
}

Apps.register({
  id: 'photo-memory', title: '照片记忆', icon: 'assets/icons/xp/32/folder-pictures.png', width: 820, height: 560,
  renderContent(body) {
    const categories = ['所有照片','童年记忆','天空与草地','空旷空间','日常碎片','旧数码相机'];
    let currentCat = 0;

    const { sidebar, content, statusbar } = XPChrome.createXPChrome(body, {
      address: '照片记忆',
      statusText: '照片记忆'
    });

    function renderSidebar() {
      sidebar.innerHTML = '';
      const catSection = XPChrome.createSidebarSection('照片分类',
        categories.map((c, i) => ({
          label: c,
          icon: i === 0 ? 'assets/icons/xp/16/folder-pictures.png' : 'assets/icons/xp/16/folder-closed.png',
          app: ''
        }))
      );
      sidebar.appendChild(catSection);

      catSection.querySelectorAll('.xp-sidebar-link').forEach((link, i) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          currentCat = i;
          render();
        });
      });
    }

    function render() {
      const filtered = currentCat === 0 ? PHOTOS : PHOTOS.filter(p => p.category === categories[currentCat]);

      renderSidebar();
      statusbar.textContent = '共 ' + filtered.length + ' 张照片';

      content.innerHTML = '';
      content.style.cssText = 'overflow:auto;padding:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;align-content:start;';

      filtered.forEach((p, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'photo-thumb photo-vintage';
        thumb.style.cssText = 'text-align:center;cursor:pointer;padding:4px;border-radius:3px;border:2px solid transparent;';
        thumb.dataset.idx = i;
        thumb.innerHTML =
          '<div style="width:100%;height:90px;background:' + p.gradient + ';border:2px solid #D5D2C5;border-radius:2px;"></div>' +
          '<div style="font-size:11px;color:var(--text-primary);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.title + '</div>' +
          '<div style="font-size:10px;color:var(--text-secondary);">' + p.date + '</div>';
        thumb.addEventListener('mouseover', () => { thumb.style.background = '#E8ECF4'; });
        thumb.addEventListener('mouseout', () => { thumb.style.background = ''; });
        thumb.addEventListener('dblclick', () => {
          openPhotoViewer(filtered[i], filtered, i);
        });
        content.appendChild(thumb);
      });
    }

    render();
  }
});

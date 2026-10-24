// @ts-nocheck
/* ===== apps/tech-notes.ts ===== */
import { Apps } from './legacy-registry';
import { XPChrome } from './chrome';

Apps.register({
  id: 'tech-notes', title: '技术笔记', icon: 'assets/icons/xp/32/notepad-config.png', width: 760, height: 540,
  renderContent(body) {
    const { sidebar, content, statusbar } = XPChrome.createXPChrome(body, {
      address: '技术笔记',
      statusText: '技术笔记'
    });

    const categories = ['WebGIS','Vue 前端','Cesium','OpenLayers','数据处理','服务器部署','开发随笔'];
    let currentCat = 0;

    function renderSidebar() {
      sidebar.innerHTML = '';
      const catSection = XPChrome.createSidebarSection('笔记分类',
        categories.map((c) => ({
          label: c,
          icon: 'assets/icons/xp/16/notepad-config.png',
          app: ''
        }))
      );
      sidebar.appendChild(catSection);
      catSection.querySelectorAll('.xp-sidebar-link').forEach((link, i) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          currentCat = i;
          renderContent_area();
        });
      });
    }

    function renderContent_area() {
      statusbar.textContent = categories[currentCat] + ' 笔记';
      content.innerHTML =
        '<h3 style="font-size:16px;margin-bottom:12px;">' + categories[currentCat] + ' 技术笔记</h3>' +
        '<p style="font-size:13px;line-height:1.7;">这里将收录 ' + categories[currentCat] + ' 相关的技术笔记和代码片段。</p>' +
        '<pre style="margin-top:12px;padding:12px;background:#F0F0E8;border:1px solid #D5D2C5;font-family:var(--font-mono);font-size:12px;overflow:auto;">// 示例代码\nimport { Map, View } from \'ol\';\nconst map = new Map({ target: \'map\' });</pre>';
    }

    renderSidebar();
    renderContent_area();
  }
});

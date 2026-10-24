// @ts-nocheck
/* ===== apps/article-archive.ts ===== */
import { Apps } from './legacy-registry';
import { XPChrome } from './chrome';
import { WindowManager } from '../core/window-manager';
import { ARTICLES } from '../data/articles';

/* Article Reading Window */
function openArticle(article) {
  const appDef = {
    id: 'article-reader-' + article.id,
    title: article.title,
    icon: 'assets/icons/xp/32/notepad-file.png',
    width: 720, height: 560,
    renderContent(body) {
      body.innerHTML = `
        <div style="display:flex;flex-direction:column;height:100%;">
          <div style="padding:16px 28px 8px;border-bottom:1px solid #E8E8D8;">
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;"><img src="assets/icons/xp/16/folder-closed.png" alt="" width="16" height="16" style="vertical-align:-3px;margin-right:4px;">${article.category} · ${article.date}</div>
            <h1 style="font-size:var(--fs-heading);color:var(--text-primary);line-height:1.4;margin:0;">${article.title}</h1>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">标签: ${article.tags.join(' · ')}</div>
          </div>
          <div style="flex:1;overflow:auto;padding:20px 28px;font-size:var(--fs-article);line-height:1.9;color:var(--text-primary);">
            ${article.content}
          </div>
          <div style="padding:8px 28px;border-top:1px solid #D5D2C5;background:var(--win-bg);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;color:var(--text-secondary);">字数: ${article.content.replace(/<[^>]*>/g,'').length} · 阅读时间约 ${Math.ceil(article.content.replace(/<[^>]*>/g,'').length / 300)} 分钟</span>
            <div style="display:flex;gap:6px;">
              <button class="xp-btn" data-nav="archive">返回档案</button>
            </div>
          </div>
        </div>
      `;
      body.querySelector('[data-nav="archive"]').addEventListener('click', () => {
        Apps.openApp('article-archive');
      });
    }
  };
  WindowManager.openWindow(appDef);
}

Apps.register({
  id: 'article-archive',
  title: '文章档案',
  icon: 'assets/icons/xp/32/folder-documents.png',
  width: 760, height: 520,
  renderContent(body) {
    const categories = ['全部文章','日常记录','梦境日志','生活随笔','技术笔记','摄影记录','旅行记忆','未分类'];
    let currentCategory = 0;
    let searchQuery = '';

    const { sidebar, content, statusbar } = XPChrome.createXPChrome(body, {
      address: '文章档案',
      statusText: '文章档案'
    });

    // Sidebar: Categories as XP Common Tasks panel
    function renderSidebar() {
      sidebar.innerHTML = '';
      const catSection = XPChrome.createSidebarSection('文章分类',
        categories.map((c, i) => ({
          label: c,
          icon: i === 0 ? 'assets/icons/xp/16/folder-documents.png' : 'assets/icons/xp/16/folder-closed.png',
          app: '',
          catIdx: i
        }))
      );
      sidebar.appendChild(catSection);

      // Category link clicks
      catSection.querySelectorAll('.xp-sidebar-link').forEach((link, i) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          currentCategory = i;
          render();
        });
      });
    }

    function render() {
      const filtered = ARTICLES.filter(a => {
        const matchCat = currentCategory === 0 || a.category === categories[currentCategory];
        const matchSearch = !searchQuery ||
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
      });

      renderSidebar();
      statusbar.textContent = '共 ' + filtered.length + ' 篇文章';

      content.innerHTML = '';

      // Search bar
      const searchBar = document.createElement('div');
      searchBar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;background:#F5F4EF;border-bottom:1px solid #D5D2C5;';
      searchBar.innerHTML =
        '<input type="text" id="archive-search" placeholder="搜索文章..." value="' + searchQuery + '" style="flex:1;padding:3px 6px;border:1px solid #7F9DB9;font-size:12px;font-family:var(--font-system);">' +
        '<span style="font-size:11px;color:var(--text-secondary);white-space:nowrap;">共 ' + filtered.length + ' 篇</span>';
      content.appendChild(searchBar);

      // Article list
      const listArea = document.createElement('div');
      listArea.style.cssText = 'overflow:auto;flex:1;';

      if (filtered.length === 0) {
        listArea.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-secondary);font-size:13px;">没有找到匹配的文章</div>';
      } else {
        const table = document.createElement('table');
        table.style.cssText = 'width:100%;border-collapse:collapse;font-size:12px;';
        table.innerHTML =
          '<thead><tr style="background:#E8ECF4;border-bottom:1px solid #C8C8B8;">' +
            '<th style="text-align:left;padding:4px 8px;font-weight:normal;">名称</th>' +
            '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:110px;">修改日期</th>' +
            '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:70px;">类型</th>' +
            '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:90px;">标签</th>' +
          '</tr></thead>' +
          '<tbody>' +
            filtered.map(a => '<tr class="article-row" style="border-bottom:1px solid #E8E8D8;cursor:default;" data-id="' + a.id + '" onmouseover="this.style.background=\'#E8ECF4\'" onmouseout="this.style.background=\'\'">' +
              '<td style="padding:3px 8px;"><img src="assets/icons/xp/16/notepad-file.png" alt="" width="16" height="16" style="vertical-align:-3px;margin-right:4px;">' + a.title + '</td>' +
              '<td style="padding:3px 8px;color:var(--text-secondary);">' + a.date + '</td>' +
              '<td style="padding:3px 8px;color:var(--text-secondary);">' + a.category + '</td>' +
              '<td style="padding:3px 8px;color:var(--text-secondary);">' + a.tags.join(', ') + '</td>' +
            '</tr>').join('') +
          '</tbody>';
        listArea.appendChild(table);
      }
      content.appendChild(listArea);

      // Event listeners
      const searchInput = content.querySelector('#archive-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          render();
        });
      }

      content.querySelectorAll('.article-row').forEach(el => {
        el.addEventListener('dblclick', () => {
          const article = ARTICLES.find(a => a.id === el.dataset.id);
          if (article) openArticle(article);
        });
      });
    }

    render();
  }
});

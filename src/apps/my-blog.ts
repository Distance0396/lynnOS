// @ts-nocheck
/* ===== apps/my-blog.ts ===== */
import { Apps } from './legacy-registry';
import { XPChrome } from './chrome';

Apps.register({
  id: 'my-blog', title: '我的博客', icon: 'assets/icons/xp/32/notepad-file.png', width: 640, height: 480,
  renderContent(body) {
    const { content, statusbar } = XPChrome.createXPChrome(body, {
      address: '我的博客',
      statusText: '我的博客'
    });

    statusbar.textContent = '我的博客';
    content.style.cssText = 'padding:24px;line-height:1.8;font-size:14px;';
    content.innerHTML =
      '<h2 style="font-size:20px;color:var(--xp-blue);margin-bottom:12px;">我的博客</h2>' +
      '<p>这里是 Somewhere.exe 的主页。</p>' +
      '<p style="margin-top:8px;color:var(--text-secondary);">一个安静的角落，保存着记忆、文字和一些未完成的想法。</p>' +
      '<p style="margin-top:16px;font-size:13px;color:var(--text-secondary);">双击桌面「文章档案」图标浏览全部文章。</p>';
  }
});

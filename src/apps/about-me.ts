// @ts-nocheck
/* ===== apps/about-me.ts ===== */
import { Apps } from './registry';
import { XPChrome } from './chrome';

Apps.register({
  id: 'about-me', title: '关于我', icon: 'assets/icons/xp/32/user-key.png', width: 560, height: 500,
  renderContent(body) {
    const { content, statusbar } = XPChrome.createXPChrome(body, {
      address: '关于我',
      statusText: '关于我'
    });

    statusbar.textContent = '关于我';
    content.style.cssText = 'display:flex;flex-direction:column;height:100%;';
    content.innerHTML =
      '<div style="display:flex;gap:20px;padding:20px;background:linear-gradient(135deg,#E8ECF4,#F5F4EF);border-bottom:1px solid #D5D2C5;">' +
        '<div style="width:90px;height:90px;background:linear-gradient(135deg,var(--dream-blue),var(--dream-teal));border-radius:4px;display:flex;align-items:center;justify-content:center;border:3px solid #D5D2C5;flex-shrink:0;box-shadow:2px 2px 6px rgba(0,0,0,0.15);"><img src="assets/icons/xp/48/user-key.png" alt="" width="48" height="48"></div>' +
        '<div style="flex:1;">' +
          '<h2 style="font-size:20px;color:var(--xp-blue);margin:0 0 4px;">某个人</h2>' +
          '<div style="font-size:12px;color:var(--text-secondary);">前端开发者 · WebGIS 爱好者 · 梦核美学收藏家</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">某个安静的角落</div>' +
        '</div>' +
      '</div>' +
      '<div style="flex:1;overflow:auto;padding:20px;font-size:13px;line-height:1.8;">' +
        '<div style="margin-bottom:16px;">' +
          '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">简介</h3>' +
          '<p>一个喜欢安静空间的人。热爱前端开发，尤其关注 WebGIS 和地图可视化。喜欢在闲暇时光散步、拍照，收集那些被遗忘的网站和旧互联网的记忆。</p>' +
          '<p style="margin-top:6px;">这个博客就像一台旧电脑，保存着一些记忆、文字和没有完成的想法。</p>' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">技术栈</h3>' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
            ['Vue.js','OpenLayers','Cesium','WebGIS','Node.js','TypeScript','PostGIS','Python'].map(t =>
              '<span style="padding:2px 10px;background:#E8ECF4;border:1px solid #C8C8B8;border-radius:2px;font-size:11px;">' + t + '</span>'
            ).join('') +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">兴趣爱好</h3>' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
            ['旧互联网','梦核美学','摄影','散步','音乐','阅读','游戏','天文'].map(t =>
              '<span style="padding:2px 10px;background:#E8ECF4;border:1px solid #C8C8B8;border-radius:2px;font-size:11px;">' + t + '</span>'
            ).join('') +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">喜欢的音乐</h3>' +
          '<p style="font-size:12px;color:var(--text-secondary);">Dreamcore Ambient · Liminal Sounds · Nostalgic Internet · Retro Wave</p>' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">喜欢的空间</h3>' +
          '<p style="font-size:12px;color:var(--text-secondary);">空旷的走廊 · 日落时的街道 · 雨后的花园 · 旧房间的窗口</p>' +
        '</div>' +
        '<div>' +
          '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">链接</h3>' +
          '<div style="font-size:12px;color:var(--text-secondary);line-height:2;">' +
            '<div>Email：somewhere@example.com</div>' +
            '<div>GitHub：github.com/somewhere</div>' +
            '<div>Twitter：@somewhere_exe</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="padding:10px 20px;border-top:1px solid #D5D2C5;background:var(--win-bg);text-align:center;">' +
        '<div style="font-size:12px;font-style:italic;color:var(--dream-gray-blue);">"Somewhere, between memory and reality."</div>' +
      '</div>';
  }
});

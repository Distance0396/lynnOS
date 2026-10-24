// @ts-nocheck
/* ===== apps/recycle-bin.ts ===== */
import { Apps } from './registry';
import { XPChrome } from './chrome';
import { Atmosphere } from '../core/atmosphere';

Apps.register({
  id: 'recycle-bin', title: '回收站', icon: 'assets/icons/xp/32/recycle-bin.png', width: 550, height: 380,
  renderContent(body) {
    const files = [
      ['unfinished_dream.txt','C:\\Documents','2024-06-01'],
      ['old_memory.jpg','C:\\Pictures','2024-03-15'],
      ['untitled_note.txt','C:\\Documents','2023-12-20'],
    ];

    const { content, statusbar } = XPChrome.createXPChrome(body, {
      address: '回收站',
      statusText: '回收站'
    });

    statusbar.textContent = '回收站 · ' + files.length + ' 个文件';
    content.style.cssText = 'padding:12px;';
    content.innerHTML =
      '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
        '<thead><tr style="background:#E8ECF4;border-bottom:1px solid #C8C8B8;">' +
          '<th style="text-align:left;padding:4px 8px;font-weight:normal;">名称</th>' +
          '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:120px;">原始位置</th>' +
          '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:110px;">删除日期</th>' +
        '</tr></thead>' +
        '<tbody>' +
          files.map(r=>'<tr class="recycle-row" style="border-bottom:1px solid #E8E8D8;cursor:default;" data-file="' + r[0] + '" onmouseover="this.style.background=\'#E8ECF4\'" onmouseout="this.style.background=\'\'">' +
            '<td style="padding:3px 8px;"><img src="assets/icons/xp/16/notepad-file.png" alt="" width="16" height="16" style="vertical-align:-3px;margin-right:4px;">' + r[0] + '</td>' +
            '<td style="padding:3px 8px;color:var(--text-secondary);">' + r[1] + '</td>' +
            '<td style="padding:3px 8px;color:var(--text-secondary);">' + r[2] + '</td>' +
          '</tr>').join('') +
        '</tbody>' +
      '</table>' +
      '<div style="margin-top:12px;display:flex;gap:8px;">' +
        '<button class="xp-btn" id="recycle-empty">清空回收站</button>' +
        '<button class="xp-btn" id="recycle-restore">还原所有文件</button>' +
      '</div>' +
      '<div style="margin-top:8px;font-size:11px;color:var(--text-secondary);">— 双击文件查看记忆内容 —</div>';

    // Double-click file to view memory
    content.querySelectorAll('.recycle-row').forEach(el => {
      el.addEventListener('dblclick', () => {
        Atmosphere.showRecycleMemory(el.dataset.file);
      });
    });

    // Empty recycle bin
    content.querySelector('#recycle-empty').addEventListener('click', () => {
      Atmosphere.playClick();
      Atmosphere.showSystemDialog({
        icon: 'assets/icons/xp/32/recycle-bin.png', title: '回收站',
        text: '这些记忆已经被永久删除了。<br>……当然，只是演示数据。'
      }, 10000);
    });

    // Restore files
    content.querySelector('#recycle-restore').addEventListener('click', () => {
      Atmosphere.playClick();
      Atmosphere.showSystemDialog({
        icon: 'assets/icons/xp/32/help.png', title: '回收站',
        text: '文件已还原。<br>记忆又回来了。'
      }, 8000);
    });
  }
});

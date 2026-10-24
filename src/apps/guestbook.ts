// @ts-nocheck
/* ===== apps/guestbook.ts — 留言板（本地持久化） ===== */
import { Apps } from './legacy-registry';
import { XPChrome } from './chrome';
import { Atmosphere } from '../core/atmosphere';
import { STORAGE_KEYS } from '../constants';

const DEMO_MESSAGES = [
  { name: '访客A', text: '很漂亮的网站，有那种旧电脑的感觉。', date: '2024-08-10' },
  { name: '路过的人', text: 'Somewhere between yesterday and a dream. 喜欢这句话。', date: '2024-07-22' },
];

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.guestbook);
    if (!raw) return { list: DEMO_MESSAGES.slice(), persist: true };
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return { list: DEMO_MESSAGES.slice(), persist: true };
    return { list, persist: true };
  } catch {
    return { list: DEMO_MESSAGES.slice(), persist: false };
  }
}

function saveMessages(list) {
  try {
    localStorage.setItem(STORAGE_KEYS.guestbook, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function today() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}

Apps.register({
  id: 'guestbook', title: '留言板', icon: 'assets/icons/xp/32/document-edit.png', width: 640, height: 520,
  renderContent(body) {
    const { content, statusbar } = XPChrome.createXPChrome(body, {
      address: '留言板',
      statusText: '留言板'
    });

    const store = loadMessages();
    let persist = store.persist;
    const messages = store.list.slice();

    content.style.cssText = 'padding:16px;display:flex;flex-direction:column;height:100%;';

    function render() {
      statusbar.textContent = '留言板 · ' + messages.length + ' 条留言';
      const rows = messages.slice().reverse().map(m =>
        '<div style="border-bottom:1px solid #E8E8D8;padding-bottom:8px;margin-bottom:8px;">' +
          '<div style="font-size:12px;"><b>' + esc(m.name) + '</b> <span style="color:var(--text-secondary);">' + esc(m.date) + '</span></div>' +
          '<div style="font-size:13px;margin-top:4px;white-space:pre-wrap;word-break:break-word;">' + esc(m.text) + '</div>' +
        '</div>'
      ).join('');

      content.innerHTML =
        '<h3 style="font-size:15px;color:var(--xp-blue);margin-bottom:12px;">留言板</h3>' +
        '<div style="flex:1;overflow:auto;border:1px solid #D5D2C5;background:white;padding:12px;margin-bottom:12px;">' +
          (messages.length === 0
            ? '<div style="font-size:12px;color:var(--text-secondary);text-align:center;padding:20px 0;">还没有留言。</div>'
            : rows) +
          '<div style="font-size:11px;color:var(--text-secondary);text-align:center;margin-top:12px;">— 留言仅保存在你自己的浏览器中 —</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
          '<input type="text" id="gb-name" placeholder="昵称" maxlength="40" style="width:120px;padding:3px 6px;border:1px solid #7F9DB9;font-size:12px;font-family:var(--font-system);">' +
          '<input type="text" id="gb-text" placeholder="写下你的留言..." style="flex:1;min-width:200px;padding:3px 6px;border:1px solid #7F9DB9;font-size:12px;font-family:var(--font-system);">' +
          '<button class="xp-btn primary" id="gb-submit">提交</button>' +
        '</div>';

      content.querySelector('#gb-submit').addEventListener('click', submit);
      content.querySelector('#gb-text').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submit();
      });
    }

    function submit() {
      const nameEl = content.querySelector('#gb-name');
      const textEl = content.querySelector('#gb-text');
      const name = nameEl.value.trim();
      const text = textEl.value.trim();

      if (!name || name.length > 20 || !text || text.length > 200) {
        Atmosphere.playError();
        Atmosphere.showSystemDialog({
          icon: 'assets/icons/xp/32/error.png',
          title: '留言板',
          text: (!name ? '请填写昵称。<br>' : '') +
                (name.length > 20 ? '昵称不能超过 20 个字符。<br>' : '') +
                (!text ? '请填写留言内容。<br>' : '') +
                (text.length > 200 ? '留言不能超过 200 个字符。' : '')
        });
        return;
      }

      messages.push({ name, text, date: today() });
      if (persist) {
        if (!saveMessages(messages)) {
          persist = false;
          Atmosphere.showSystemDialog({
            icon: 'assets/icons/xp/32/error.png',
            title: '留言板',
            text: '浏览器存储不可用，本次留言仅在当前会话中显示。'
          });
        }
      }
      Atmosphere.playClick();
      render();
      content.querySelector('#gb-name').value = name;
    }

    render();
  }
});

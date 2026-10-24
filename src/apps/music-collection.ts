// @ts-nocheck
/* ===== apps/music-collection.ts ===== */
import { Apps } from './registry';
import { XPChrome } from './chrome';
import { TRACKS } from '../data/tracks';

Apps.register({
  id: 'music-collection', title: '音乐收藏', icon: 'assets/icons/xp/32/folder-music.png', width: 420, height: 460,
  renderContent(body) {
    let currentTrack = 0;
    let isPlaying = false;
    let progress = 0;
    let volume = 70;
    let progressInterval = null;

    const { content, statusbar } = XPChrome.createXPChrome(body, {
      address: '音乐收藏',
      statusText: '音乐收藏'
    });

    function parseDuration(dur) {
      const parts = dur.split(':');
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return m + ':' + String(s).padStart(2, '0');
    }

    function render() {
      const track = TRACKS[currentTrack];
      const totalSec = parseDuration(track.duration);
      const currentSec = Math.floor(progress / 100 * totalSec);

      statusbar.textContent = track.title + ' - ' + track.artist;

      content.innerHTML = '';
      content.style.cssText = 'display:flex;flex-direction:column;height:100%;background:linear-gradient(180deg,#E8ECF4,#F5F4EF);';

      const playerHTML =
        '<div style="padding:16px 16px 8px;display:flex;align-items:center;gap:14px;">' +
          '<div style="width:72px;height:72px;background:' + track.gradient + ';border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid #D5D2C5;"><img src="assets/icons/xp/32/folder-music.png" alt="" width="32" height="32"></div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:14px;font-weight:bold;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + track.title + '</div>' +
            '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">' + track.artist + '</div>' +
            '<div style="font-size:11px;color:var(--text-secondary);margin-top:1px;">' + track.album + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="padding:4px 16px;">' +
          '<div style="width:100%;height:6px;background:#D5D2C5;border-radius:3px;cursor:pointer;position:relative;" id="progress-bar">' +
            '<div style="width:' + progress + '%;height:100%;background:var(--xp-blue);border-radius:3px;transition:width 0.3s;"></div>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-secondary);margin-top:2px;">' +
            '<span>' + formatTime(currentSec) + '</span><span>' + track.duration + '</span>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;justify-content:center;gap:8px;padding:8px 16px;">' +
          '<button class="xp-btn" id="btn-prev" style="font-size:14px;padding:4px 12px;">⏮</button>' +
          '<button class="xp-btn primary" id="btn-play" style="font-size:16px;padding:4px 16px;min-width:60px;">' + (isPlaying ? '⏸' : '▶') + '</button>' +
          '<button class="xp-btn" id="btn-next" style="font-size:14px;padding:4px 12px;">⏭</button>' +
        '</div>' +
        '<div style="padding:4px 16px 8px;display:flex;align-items:center;gap:8px;">' +
          '<img src="assets/icons/xp/16/volume.png" alt="" width="16" height="16">' +
          '<div style="flex:1;height:4px;background:#D5D2C5;border-radius:2px;cursor:pointer;" id="volume-bar">' +
            '<div style="width:' + volume + '%;height:100%;background:var(--xp-blue);border-radius:2px;"></div>' +
          '</div>' +
          '<span style="font-size:10px;color:var(--text-secondary);min-width:28px;">' + volume + '%</span>' +
        '</div>' +
        '<div style="flex:1;border-top:1px solid #D5D2C5;overflow:auto;padding:4px 0;">' +
          '<div style="padding:4px 16px;font-size:11px;font-weight:bold;color:var(--text-secondary);border-bottom:1px solid #E8E8D8;">播放列表 (' + TRACKS.length + ' 首)</div>' +
          TRACKS.map((t, i) =>
            '<div class="track-item" style="padding:5px 16px;font-size:12px;cursor:default;display:flex;align-items:center;gap:8px;' + (i===currentTrack?'background:#316AC5;color:white;':'') + '" data-idx="' + i + '" onmouseover="if(' + i + '!==' + currentTrack + ')this.style.background=\'#E8ECF4\'" onmouseout="if(' + i + '!==' + currentTrack + ')this.style.background=\'\'">' +
              '<span style="font-size:11px;min-width:18px;color:' + (i===currentTrack?'white':'var(--text-secondary)') + ';">' + (i+1) + '.</span>' +
              '<span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + t.title + '</span>' +
              '<span style="font-size:10px;color:' + (i===currentTrack?'rgba(255,255,255,0.7)':'var(--text-secondary)') + ';">' + t.duration + '</span>' +
            '</div>'
          ).join('') +
        '</div>' +
        '<div style="padding:4px 16px 8px;font-size:10px;color:var(--text-secondary);text-align:center;border-top:1px solid #E8E8D8;">— 演示模式 · 未配置音频资源 —</div>';

      content.innerHTML = playerHTML;

      // Play/Pause
      content.querySelector('#btn-play').addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          progressInterval = setInterval(() => {
            progress += 0.5;
            if (progress >= 100) { progress = 0; nextTrack(); }
            render();
          }, 500);
        } else {
          clearInterval(progressInterval);
        }
        render();
      });

      // Prev/Next
      content.querySelector('#btn-prev').addEventListener('click', () => { prevTrack(); });
      content.querySelector('#btn-next').addEventListener('click', () => { nextTrack(); });

      // Progress bar click
      content.querySelector('#progress-bar').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        progress = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
        render();
      });

      // Volume bar click
      content.querySelector('#volume-bar').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        volume = Math.round(Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100)));
        render();
      });

      // Playlist item click
      content.querySelectorAll('.track-item').forEach(el => {
        el.addEventListener('dblclick', () => {
          currentTrack = parseInt(el.dataset.idx);
          progress = 0;
          if (!isPlaying) { isPlaying = true; }
          clearInterval(progressInterval);
          progressInterval = setInterval(() => {
            progress += 0.5;
            if (progress >= 100) { progress = 0; nextTrack(); }
            render();
          }, 500);
          render();
        });
      });
    }

    function nextTrack() {
      clearInterval(progressInterval);
      currentTrack = (currentTrack + 1) % TRACKS.length;
      progress = 0;
      render();
      if (isPlaying) {
        progressInterval = setInterval(() => {
          progress += 0.5;
          if (progress >= 100) { progress = 0; nextTrack(); }
          render();
        }, 500);
      }
    }

    function prevTrack() {
      clearInterval(progressInterval);
      if (progress > 10) {
        progress = 0;
      } else {
        currentTrack = (currentTrack - 1 + TRACKS.length) % TRACKS.length;
        progress = 0;
      }
      render();
      if (isPlaying) {
        progressInterval = setInterval(() => {
          progress += 0.5;
          if (progress >= 100) { progress = 0; nextTrack(); }
          render();
        }, 500);
      }
    }

    // Cleanup on close
    body._cleanup = () => { clearInterval(progressInterval); };

    render();
  }
});

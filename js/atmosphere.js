/* ===== atmosphere.js — Dreamcore Atmosphere System (Phase 4) ===== */
const Atmosphere = (() => {

  /* ==============================
     Wallpaper Theme Definitions
     ============================== */
  const WALLPAPERS = {
    bliss:    { label: 'Bliss Blue',       themeClass: 'theme-bliss',    gradient: 'wp-bliss' },
    hallway:  { label: 'Quiet Hallway',    themeClass: 'theme-hallway',  gradient: 'wp-hallway' },
    faded:    { label: 'Faded Afternoon',  themeClass: 'theme-faded',    gradient: 'wp-faded' },
    garden:   { label: 'Dream Garden',     themeClass: 'theme-garden',   gradient: 'wp-garden' },
    room:     { label: 'Empty Room',       themeClass: 'theme-room',     gradient: 'wp-room' },
  };

  /* ==============================
     Clock Dreams (shown in clock panel)
     ============================== */
  const CLOCK_DREAMS = [
    '时间在这里走得很慢。',
    '每一秒都是一段记忆。',
    '你有多久没有安静地坐着了？',
    '此刻即永恒。',
    'Somewhere between yesterday and a dream.',
    '旧电脑从不忘记保存。',
    '窗外永远是那个下午。',
    '有些路只能走一次。',
  ];

  /* ==============================
     Sound System (Web Audio API)
     ============================== */
  let _audioCtx = null;

  function getAudioCtx() {
    if (!_audioCtx) {
      try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { /* no audio support */ }
    }
    return _audioCtx;
  }

  function playTone(freq, duration, type, volume) {
    if (!DesktopState.state.settings.soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = volume || 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  function playClick() {
    playTone(800, 0.05, 'square', 0.04);
  }

  function playOpen() {
    if (!DesktopState.state.settings.soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    // XP-style ascending two-tone
    setTimeout(() => playTone(520, 0.12, 'sine', 0.06), 0);
    setTimeout(() => playTone(780, 0.15, 'sine', 0.06), 80);
  }

  function playClose() {
    if (!DesktopState.state.settings.soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    setTimeout(() => playTone(600, 0.1, 'sine', 0.05), 0);
    setTimeout(() => playTone(400, 0.12, 'sine', 0.04), 60);
  }

  function playError() {
    if (!DesktopState.state.settings.soundEnabled) return;
    setTimeout(() => playTone(320, 0.15, 'square', 0.06), 0);
    setTimeout(() => playTone(250, 0.2, 'square', 0.05), 150);
  }

  function playStartup() {
    if (!DesktopState.state.settings.soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'sine', 0.05), i * 120);
    });
  }

  /* ==============================
     Settings Persistence
     ============================== */
  const STORAGE_KEY = 'somewhere-settings';

  function saveSettings() {
    try {
      const s = DesktopState.state.settings;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        wallpaper: s.wallpaper,
        soundEnabled: s.soundEnabled,
        animationsEnabled: s.animationsEnabled,
        iconsVisible: s.iconsVisible,
      }));
    } catch (e) { /* storage not available */ }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      const s = DesktopState.state.settings;
      if (saved.wallpaper && WALLPAPERS[saved.wallpaper]) s.wallpaper = saved.wallpaper;
      if (typeof saved.soundEnabled === 'boolean') s.soundEnabled = saved.soundEnabled;
      if (typeof saved.animationsEnabled === 'boolean') s.animationsEnabled = saved.animationsEnabled;
      if (typeof saved.iconsVisible === 'boolean') s.iconsVisible = saved.iconsVisible;
    } catch (e) { /* ignore */ }
  }

  function resetSettings() {
    const s = DesktopState.state.settings;
    s.wallpaper = 'bliss';
    s.soundEnabled = false;
    s.animationsEnabled = true;
    s.iconsVisible = true;
    saveSettings();
    applyAllSettings();
  }

  /* ==============================
     Apply Settings to DOM
     ============================== */
  function applyWallpaper() {
    const root = document.getElementById('desktop-root');
    if (!root) return;
    // Remove all theme classes
    Object.values(WALLPAPERS).forEach(w => root.classList.remove(w.themeClass));
    // Apply current
    const wp = WALLPAPERS[DesktopState.state.settings.wallpaper];
    if (wp) root.classList.add(wp.themeClass);
  }

  function applyAnimations() {
    const root = document.getElementById('desktop-root');
    if (!root) return;
    root.classList.toggle('no-animations', !DesktopState.state.settings.animationsEnabled);
  }

  function applyIconsVisible() {
    const root = document.getElementById('desktop-root');
    if (!root) return;
    root.classList.toggle('icons-hidden', !DesktopState.state.settings.iconsVisible);
  }

  function applyAllSettings() {
    applyWallpaper();
    applyAnimations();
    applyIconsVisible();
  }

  /* ==============================
     System Dialog
     ============================== */
  let _dialogZ = 10100;

  function showSystemDialog(msg, duration) {
    const container = document.getElementById('system-dialog-container');
    if (!container) return;

    const dialog = document.createElement('div');
    dialog.className = 'sys-dialog';
    _dialogZ++;
    dialog.style.zIndex = _dialogZ;

    dialog.innerHTML = `
      <div class="sys-dialog-titlebar">
        <span class="sys-dialog-icon">${msg.icon || 'ℹ️'}</span>
        <span class="sys-dialog-title">${msg.title || '系统提示'}</span>
        <button class="sys-dialog-close" title="关闭">✕</button>
      </div>
      <div class="sys-dialog-body">
        <div class="sys-dialog-img">${msg.icon || 'ℹ️'}</div>
        <div class="sys-dialog-text">${msg.text}</div>
      </div>
      <div class="sys-dialog-actions">
        <button class="xp-btn primary sys-dialog-ok">确定</button>
      </div>
    `;

    function closeDialog() {
      dialog.classList.add('closing');
      playClose();
      setTimeout(() => { if (dialog.parentNode) dialog.parentNode.removeChild(dialog); }, 140);
    }

    dialog.querySelector('.sys-dialog-close').addEventListener('click', closeDialog);
    dialog.querySelector('.sys-dialog-ok').addEventListener('click', closeDialog);

    // Make draggable
    const titlebar = dialog.querySelector('.sys-dialog-titlebar');
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.sys-dialog-close')) return;
      e.preventDefault();
      const startX = e.clientX, startY = e.clientY;
      const origLeft = parseInt(dialog.style.left);
      const origTop = parseInt(dialog.style.top);
      function onMove(ev) {
        dialog.style.left = (origLeft + ev.clientX - startX) + 'px';
        dialog.style.top = Math.max(0, origTop + ev.clientY - startY) + 'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    container.appendChild(dialog);

    // Unified position: screen-centered (after mount so size is measurable)
    const vw = window.innerWidth;
    const vh = window.innerHeight - 40;
    dialog.style.left = Math.max(0, Math.round((vw - dialog.offsetWidth) / 2)) + 'px';
    dialog.style.top = Math.max(0, Math.round((vh - dialog.offsetHeight) / 2)) + 'px';

    playOpen();

    // Auto-close after duration
    if (duration) {
      setTimeout(closeDialog, duration);
    }
  }

  /* ==============================
     Clock Panel
     ============================== */
  let _clockPanelOpen = false;

  function toggleClockPanel() {
    const panel = document.getElementById('clock-panel');
    if (!panel) return;
    _clockPanelOpen = !_clockPanelOpen;
    if (_clockPanelOpen) {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
      const dateStr = now.getFullYear() + '年' + (now.getMonth()+1) + '月' + now.getDate() + '日 ' + days[now.getDay()];
      const dream = CLOCK_DREAMS[Math.floor(Math.random() * CLOCK_DREAMS.length)];

      panel.innerHTML = `
        <div class="clock-time">${h}:${m}:${s}</div>
        <div class="clock-date">${dateStr}</div>
        <div class="clock-separator"></div>
        <div class="clock-dream">"${dream}"</div>
      `;
      panel.hidden = false;
      playClick();
    } else {
      panel.hidden = true;
    }
  }

  function closeClockPanel() {
    _clockPanelOpen = false;
    const panel = document.getElementById('clock-panel');
    if (panel) panel.hidden = true;
  }

  /* ==============================
     Recycle Bin Easter Egg
     ============================== */
  const RECYCLE_MEMORIES = {
    'unfinished_dream.txt': {
      icon: '📝',
      title: 'unfinished_dream.txt',
      text: '"我梦见自己在一个没有尽头的走廊里走着。<br>每扇门后面都是一个不同的下午。<br>我选择了最安静的那一扇。"'
    },
    'old_memory.jpg': {
      icon: '🖼️',
      title: 'old_memory.jpg',
      text: '一张褪色的照片。<br>画面里是一片蓝天和远处的山丘。<br>照片背面写着："2007年夏天，一切都还好。"'
    },
    'untitled_note.txt': {
      icon: '📄',
      title: 'untitled_note.txt',
      text: '"今天什么也没做。<br>但什么也没做的日子，<br>有时候是最好的日子。"'
    },
  };

  function showRecycleMemory(filename) {
    const mem = RECYCLE_MEMORIES[filename];
    if (mem) showSystemDialog(mem, 12000);
  }

  /* ==============================
     Init
     ============================== */
  function init() {
    // Load saved settings
    loadSettings();
    // Apply all visual settings
    applyAllSettings();

    // Clock click handler
    const clock = document.getElementById('tray-clock');
    if (clock) {
      clock.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleClockPanel();
      });
    }

    // Volume icon click — toggle sound
    const vol = document.getElementById('tray-volume');
    if (vol) {
      vol.addEventListener('click', (e) => {
        e.stopPropagation();
        DesktopState.state.settings.soundEnabled = !DesktopState.state.settings.soundEnabled;
        const img = vol.querySelector('img');
        if (img) img.src = DesktopState.state.settings.soundEnabled ? 'assets/icons/xp/16/volume.png' : 'assets/icons/xp/16/error.png';
        vol.title = DesktopState.state.settings.soundEnabled ? '音量 (已开启)' : '音量 (已静音)';
        saveSettings();
        if (DesktopState.state.settings.soundEnabled) playClick();
      });
    }

    // Close clock panel on outside click
    document.addEventListener('click', (e) => {
      if (_clockPanelOpen) {
        const panel = document.getElementById('clock-panel');
        if (panel && !panel.contains(e.target) && e.target.id !== 'tray-clock') {
          closeClockPanel();
        }
      }
    });

    // Update volume icon to match initial state
    const volIcon = document.getElementById('tray-volume');
    if (volIcon) {
      const img = volIcon.querySelector('img');
      if (img) img.src = DesktopState.state.settings.soundEnabled ? 'assets/icons/xp/16/volume.png' : 'assets/icons/xp/16/error.png';
      volIcon.title = DesktopState.state.settings.soundEnabled ? '音量 (已开启)' : '音量 (已静音)';
    }
  }

  return {
    init,
    WALLPAPERS,
    applyWallpaper,
    applyAnimations,
    applyIconsVisible,
    applyAllSettings,
    saveSettings,
    loadSettings,
    resetSettings,
    playClick,
    playOpen,
    playClose,
    playError,
    playStartup,
    showSystemDialog,
    showRecycleMemory,
    toggleClockPanel,
    closeClockPanel,
  };
})();

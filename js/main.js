/* ===== main.js — Bootstrap ===== */
function initDesktop() {
  // Initialize atmosphere (loads saved settings, applies wallpaper, etc.)
  Atmosphere.init();

  // Render desktop icons
  Desktop.render();

  // Init desktop click handling
  Desktop.initDesktopClicks();

  // Init start menu
  Taskbar.initStartMenu();

  // Start clock
  Taskbar.startClock();

  // Open Welcome window on first load
  Apps.openApp('welcome');

  // Play startup sound (delayed slightly for audio context)
  setTimeout(() => Atmosphere.playStartup(), 300);
}

document.addEventListener('DOMContentLoaded', () => {
  // Play XP boot sequence first (skipped if already completed once)
  if (typeof BootSequence !== 'undefined') {
    BootSequence.start(initDesktop);
  } else {
    initDesktop();
  }
});

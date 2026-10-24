/* ===== main.ts — Bootstrap ===== */
import './styles/main.css';
import { Atmosphere } from './core/atmosphere';
import { Desktop } from './core/desktop';
import { Taskbar } from './core/taskbar';
import { Apps } from './apps/registry';
import { BootSequence } from './core/boot';

// Import all app modules for their side effects (registration)
import './apps/welcome';
import './apps/article-archive';
import './apps/my-blog';
import './apps/photo-memory';
import './apps/music-collection';
import './apps/tech-notes';
import './apps/about-me';
import './apps/guestbook';
import './apps/my-computer';
import './apps/recycle-bin';
import './apps/settings';

function initDesktop() {
  Atmosphere.init();
  Desktop.render();
  Desktop.initDesktopClicks();
  Taskbar.initStartMenu();
  Taskbar.startClock();
  Apps.openApp('welcome');
  setTimeout(() => Atmosphere.playStartup(), 300);
}

document.addEventListener('DOMContentLoaded', () => {
  BootSequence.start(initDesktop);
});

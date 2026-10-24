/* ===== boot.ts — Windows XP Boot Sequence ===== */
import { STORAGE_KEYS, BOOT_TIMING } from '../constants';

const STORAGE_KEY = STORAGE_KEYS.bootDone;
const BOOT_MS = BOOT_TIMING.boot;
const WELCOME_MS = BOOT_TIMING.welcome;
const LOADING_MS = BOOT_TIMING.loading;
const FADE_MS = BOOT_TIMING.fade;

let _rafId: number | null = null;

const FLAG_SVG =
  '<svg class="boot-flag" viewBox="0 0 128 120" xmlns="http://www.w3.org/2000/svg">' +
  '<path fill="#EE4023" d="M8,22 C30,10 44,10 60,18 L60,56 C44,48 30,48 8,60 Z"/>' +
  '<path fill="#77BC1F" d="M64,18 C84,28 100,26 120,14 L120,52 C100,64 84,66 64,56 Z"/>' +
  '<path fill="#00ADEF" d="M8,66 C30,54 44,54 60,62 L60,100 C44,92 30,92 8,104 Z"/>' +
  '<path fill="#FDB813" d="M64,62 C84,72 100,70 120,58 L120,96 C100,108 84,110 64,100 Z"/>' +
  '</svg>';

const POWER_SVG =
  '<svg viewBox="0 0 12 12" width="12" height="12">' +
  '<path d="M6 1v5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
  '<path d="M3.4 3a4.2 4.2 0 1 0 5.2 0" stroke="#fff" fill="none" stroke-width="1.6" stroke-linecap="round"/>' +
  '</svg>';

function shouldSkip(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; }
  catch (e) { console.warn('Failed to read boot state from localStorage:', e); return false; }
}
function markDone() {
  try { localStorage.setItem(STORAGE_KEY, '1'); }
  catch (e) { console.warn('Failed to save boot state to localStorage:', e); }
}

function start(onComplete: () => void) {
  if (shouldSkip()) { onComplete(); return; }

  const overlay = document.createElement('div');
  overlay.id = 'boot-overlay';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));

  runBootPhase(overlay, onComplete);
}

function runBootPhase(overlay: HTMLElement, onComplete: () => void) {
  overlay.innerHTML =
    '<div class="boot-screen">' +
      '<div class="boot-logo">' +
        FLAG_SVG +
        '<div class="boot-wordmark">Microsoft<sup>®</sup> ' +
          '<span class="bwm-win">Windows<sup>®</sup></span> ' +
          '<span class="bwm-xp">XP</span></div>' +
        '<div class="boot-edition">Home Edition</div>' +
      '</div>' +
      '<div class="boot-progress"><div class="boot-progress-blocks"><i></i><i></i><i></i></div></div>' +
      '<div class="boot-copyright">Copyright © Microsoft Corporation</div>' +
    '</div>';

  startProgress(overlay);

  setTimeout(() => {
    stopProgress();
    overlay.classList.add('fading');
    setTimeout(() => {
      overlay.classList.remove('fading');
      runWelcomePhase(overlay, onComplete);
    }, FADE_MS);
  }, BOOT_MS);
}

function runWelcomePhase(overlay: HTMLElement, onComplete: () => void) {
  overlay.innerHTML =
    '<div class="boot-welcome">' +
      '<div class="bw-logo">' + FLAG_SVG.replace('boot-flag', 'bw-flag') +
        '<span>Microsoft<sup>®</sup> Windows<sup>®</sup> XP</span></div>' +
      '<div class="bw-center"><div class="bw-text">欢 迎</div></div>' +
      '<div class="bw-footer"><span class="bw-power">' + POWER_SVG + '</span><span>关闭计算机</span></div>' +
    '</div>';

  playStartupSound();

  setTimeout(() => {
    const t = overlay.querySelector('.bw-text');
    if (t) {
      t.textContent = '正在加载个人设置...';
      t.classList.add('loading');
    }
  }, WELCOME_MS);

  setTimeout(() => {
    overlay.classList.add('fading');
    setTimeout(() => {
      overlay.remove();
      markDone();
      onComplete();
    }, FADE_MS);
  }, WELCOME_MS + LOADING_MS);
}

function startProgress(overlay: HTMLElement) {
  const track = overlay.querySelector('.boot-progress') as HTMLElement;
  const blocks = overlay.querySelector('.boot-progress-blocks') as HTMLElement;
  if (!track || !blocks) return;
  const trackW = track.clientWidth || 158;
  const cycle = 1.75;
  const t0 = performance.now();

  function frame(now: number) {
    const p = (((now - t0) / 1000) % cycle) / cycle;
    const eased = 0.5 - 0.5 * Math.cos(Math.PI * p);
    const x = -46 + eased * (trackW + 92);
    blocks.style.transform = 'translateX(' + x + 'px)';
    let op = 1;
    if (p < 0.1) op = p / 0.1;
    else if (p > 0.9) op = (1 - p) / 0.1;
    blocks.style.opacity = String(op);
    _rafId = requestAnimationFrame(frame);
  }
  _rafId = requestAnimationFrame(frame);
}

function stopProgress() {
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
}

function playStartupSound() {
  const audio = new Audio('assets/audio/oxp.wav');
  audio.volume = 0.9;
  const p = audio.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {
      const resume = () => {
        audio.play().catch(() => {});
        document.removeEventListener('keydown', resume);
        document.removeEventListener('pointerdown', resume);
      };
      document.addEventListener('keydown', resume);
      document.addEventListener('pointerdown', resume);
    });
  }
}

export const BootSequence = { start };

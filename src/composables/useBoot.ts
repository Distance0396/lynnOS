// 开机流程状态机：boot → welcome → loading → fading → done；完成后写入 localStorage 标记，下次跳过
import { ref } from 'vue';
import { BOOT_TIMING, STORAGE_KEYS } from '../constants';

export type BootPhase = 'boot' | 'welcome' | 'loading' | 'fading' | 'done';

const { boot: BOOT_MS, welcome: WELCOME_MS, loading: LOADING_MS, fade: FADE_MS } = BOOT_TIMING;

function hasBootedBefore(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.bootDone) === '1';
  } catch {
    return false;
  }
}

function markBooted() {
  try {
    localStorage.setItem(STORAGE_KEYS.bootDone, '1');
  } catch {
    // 无法持久化时每次都播放开机流程
  }
}

// XP 启动音：自动播放被浏览器拦截时，等待首次按键/点击重试
function playStartupSound() {
  const audio = new Audio('assets/audio/oxp.wav');
  audio.volume = 0.9;
  const pending = audio.play();
  if (pending && typeof pending.catch === 'function') {
    pending.catch(() => {
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

export function useBoot() {
  const skipped = hasBootedBefore();
  const phase = ref<BootPhase>(skipped ? 'done' : 'boot');

  if (!skipped) {
    setTimeout(() => {
      phase.value = 'welcome';
      playStartupSound();
    }, BOOT_MS);
    setTimeout(() => {
      phase.value = 'loading';
    }, BOOT_MS + WELCOME_MS);
    setTimeout(() => {
      phase.value = 'fading';
    }, BOOT_MS + WELCOME_MS + LOADING_MS);
    setTimeout(() => {
      phase.value = 'done';
      markBooted();
    }, BOOT_MS + WELCOME_MS + LOADING_MS + FADE_MS);
  }

  return { phase };
}

// 桌面设置：壁纸 / 声音 / 动画 / 图标可见性，变化即持久化到 localStorage
import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { STORAGE_KEYS, VALID_WALLPAPERS } from '../constants';
import { loadJson } from '../composables/useLocalStorage';

export interface DesktopSettings {
  wallpaper: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  iconsVisible: boolean;
}

const DEFAULTS: DesktopSettings = {
  wallpaper: 'bliss',
  soundEnabled: false,
  animationsEnabled: true,
  iconsVisible: true,
};

export const useSettingsStore = defineStore('settings', () => {
  const wallpaper = ref(DEFAULTS.wallpaper);
  const soundEnabled = ref(DEFAULTS.soundEnabled);
  const animationsEnabled = ref(DEFAULTS.animationsEnabled);
  const iconsVisible = ref(DEFAULTS.iconsVisible);

  // 恢复上次保存的设置；字段缺失或非法时保持默认
  const saved = loadJson<Partial<DesktopSettings>>(STORAGE_KEYS.settings, {});
  if (saved.wallpaper && (VALID_WALLPAPERS as readonly string[]).includes(saved.wallpaper)) {
    wallpaper.value = saved.wallpaper;
  }
  if (typeof saved.soundEnabled === 'boolean') soundEnabled.value = saved.soundEnabled;
  if (typeof saved.animationsEnabled === 'boolean') animationsEnabled.value = saved.animationsEnabled;
  if (typeof saved.iconsVisible === 'boolean') iconsVisible.value = saved.iconsVisible;

  // sync：任意设置变化立即持久化（含页面即将关闭的场景）
  watch([wallpaper, soundEnabled, animationsEnabled, iconsVisible], () => {
    const snapshot: DesktopSettings = {
      wallpaper: wallpaper.value,
      soundEnabled: soundEnabled.value,
      animationsEnabled: animationsEnabled.value,
      iconsVisible: iconsVisible.value,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(snapshot));
    } catch {
      // 存储不可用时设置仅在当前会话生效
    }
  }, { flush: 'sync' });

  function update(partial: Partial<DesktopSettings>) {
    if (partial.wallpaper !== undefined && (VALID_WALLPAPERS as readonly string[]).includes(partial.wallpaper)) {
      wallpaper.value = partial.wallpaper;
    }
    if (partial.soundEnabled !== undefined) soundEnabled.value = partial.soundEnabled;
    if (partial.animationsEnabled !== undefined) animationsEnabled.value = partial.animationsEnabled;
    if (partial.iconsVisible !== undefined) iconsVisible.value = partial.iconsVisible;
  }

  function reset() {
    wallpaper.value = DEFAULTS.wallpaper;
    soundEnabled.value = DEFAULTS.soundEnabled;
    animationsEnabled.value = DEFAULTS.animationsEnabled;
    iconsVisible.value = DEFAULTS.iconsVisible;
  }

  return { wallpaper, soundEnabled, animationsEnabled, iconsVisible, update, reset };
});

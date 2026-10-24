<script setup lang="ts">
import { ref } from 'vue';
import { useSettingsStore } from './stores/settings';
import { useWindowsStore } from './stores/windows';
import { useDialogsStore } from './stores/dialogs';
import { DESKTOP_ICONS, openApp } from './apps/registry';
import { useSound } from './composables/useSound';
import { useEscapeStack } from './composables/useEscapeStack';
import BootOverlay from './components/desktop/BootOverlay.vue';
import DesktopIcon from './components/desktop/DesktopIcon.vue';
import ClockPanel from './components/desktop/ClockPanel.vue';
import SleepOverlay from './components/desktop/SleepOverlay.vue';
import WindowLayer from './components/window/WindowLayer.vue';
import TaskBar from './components/taskbar/TaskBar.vue';
import StartMenu from './components/taskbar/StartMenu.vue';
import SystemDialog from './components/common/SystemDialog.vue';

// 桌面壳是容器组件：直接访问 store 与 composables
const settings = useSettingsStore();
const windowsStore = useWindowsStore();
const dialogs = useDialogsStore();
const sound = useSound();

const bootComplete = ref(false);
const startMenuOpen = ref(false);
const clockOpen = ref(false);
const sleeping = ref(false);
const selectedApp = ref<string | null>(null);

// Esc 逐层关闭：栈内后注册先关闭 → 对话框 > 时钟面板 > 开始菜单
const escape = useEscapeStack();
escape.push(() => {
  if (!startMenuOpen.value) return false;
  startMenuOpen.value = false;
  return true;
});
escape.push(() => {
  if (!clockOpen.value) return false;
  clockOpen.value = false;
  return true;
});
escape.push(() => dialogs.closeTop());

// 开机完成后打开欢迎窗（时序与旧 initDesktop 一致）
function onBootFinished() {
  bootComplete.value = true;
  openApp('welcome');
  setTimeout(() => sound.startup(), 300);
}

function selectIcon(appId: string) {
  selectedApp.value = appId;
}

// 点击桌面空白处：取消图标选中并收起开始菜单（与旧 initDesktopClicks 一致）
function onDesktopClick(e: MouseEvent) {
  const targetId = (e.target as HTMLElement).id;
  if (['desktop-root', 'wallpaper', 'wallpaper-overlay', 'window-container'].includes(targetId)) {
    selectedApp.value = null;
    startMenuOpen.value = false;
  }
}

function onMenuSelect(appId: string) {
  startMenuOpen.value = false;
  openApp(appId);
}

function onAllPrograms() {
  startMenuOpen.value = false;
  openApp('my-computer');
}

function onHome() {
  startMenuOpen.value = false;
  windowsStore.closeAll();
  openApp('welcome');
}

function onSleep() {
  startMenuOpen.value = false;
  sleeping.value = true;
}
</script>

<template>
  <div
    id="desktop-root"
    :class="[
      `theme-${settings.wallpaper}`,
      { 'no-animations': !settings.animationsEnabled, 'icons-hidden': !settings.iconsVisible },
    ]"
    @click="onDesktopClick"
  >
    <div id="wallpaper"></div>
    <div id="wallpaper-overlay"></div>
    <div id="film-grain"></div>
    <div id="vignette"></div>

    <div id="desktop-icons">
      <DesktopIcon
        v-for="icon in DESKTOP_ICONS"
        :key="icon.appId"
        :app-id="icon.appId"
        :label="icon.label"
        :selected="selectedApp === icon.appId"
        @select="selectIcon(icon.appId)"
        @open="openApp(icon.appId)"
      />
    </div>

    <WindowLayer />

    <TaskBar
      :menu-open="startMenuOpen"
      @toggle-start="startMenuOpen = !startMenuOpen"
      @toggle-clock="clockOpen = !clockOpen"
    />

    <StartMenu
      v-if="startMenuOpen"
      @select="onMenuSelect"
      @all-programs="onAllPrograms"
      @home="onHome"
      @sleep="onSleep"
    />

    <ClockPanel v-if="clockOpen" @close="clockOpen = false" />

    <div id="system-dialog-container">
      <SystemDialog v-for="d in dialogs.dialogs" :key="d.id" :dialog="d" />
    </div>

    <SleepOverlay v-if="sleeping" @wake="sleeping = false" />
  </div>

  <BootOverlay v-if="!bootComplete" @finished="onBootFinished" />
</template>

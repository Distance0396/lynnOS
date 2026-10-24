<script setup lang="ts">
import { useWindowsStore } from '../../stores/windows';
import SystemTray from './SystemTray.vue';
import TaskButton from './TaskButton.vue';

defineProps<{ menuOpen: boolean }>();
const emit = defineEmits<{ 'toggle-start': []; 'toggle-clock': [] }>();
const store = useWindowsStore();

// 任务按钮行为与旧版一致：最小化 → 激活；已激活 → 最小化；否则激活
function onTaskClick(winId: string) {
  const win = store.windows.find(w => w.id === winId);
  if (!win) return;
  if (win.display === 'minimized') store.activate(winId);
  else if (store.activeId === winId) store.minimize(winId);
  else store.activate(winId);
}
</script>

<template>
  <div id="taskbar">
    <button id="start-btn" :class="{ active: menuOpen }" aria-label="开始菜单" @click.stop="emit('toggle-start')">
      <img src="/assets/start.png" alt="start">
    </button>
    <div id="task-buttons">
      <TaskButton
        v-for="w in store.windows"
        :key="w.id"
        :win="w"
        :active="w.id === store.activeId"
        @click="onTaskClick(w.id)"
      />
    </div>
    <SystemTray @toggle-clock="emit('toggle-clock')" />
  </div>
</template>

<script setup lang="ts">
import { APPS } from '../../apps/registry';
import { useWindowsStore } from '../../stores/windows';
import { useSound } from '../../composables/useSound';
import WindowFrame from './WindowFrame.vue';

// 容器组件：把 WindowFrame 的事件转接到 windows store，并按注册表渲染应用组件
const store = useWindowsStore();
const sound = useSound();

function onClose(winId: string) {
  sound.close();
  store.close(winId);
}

function appDef(appId: string) {
  return APPS[appId];
}
</script>

<template>
  <div id="window-container">
    <WindowFrame
      v-for="w in store.windows"
      :key="w.id"
      :win="w"
      :active="w.id === store.activeId"
      :body-class="appDef(w.appId)?.bodyClass"
      @activate="store.activate(w.id)"
      @close="onClose(w.id)"
      @minimize="store.minimize(w.id)"
      @toggle-maximize="store.toggleMaximize(w.id)"
      @commit-bounds="bounds => store.commitBounds(w.id, bounds)"
    >
      <component :is="appDef(w.appId)?.component" v-if="appDef(w.appId)" />
      <div v-else class="app-placeholder">未知应用：{{ w.appId }}</div>
    </WindowFrame>
  </div>
</template>

<style scoped>
.app-placeholder {
  padding: 24px;
  font-size: 12px;
  color: var(--text-secondary, #666);
}
</style>

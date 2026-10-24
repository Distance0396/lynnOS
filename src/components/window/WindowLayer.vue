<script setup lang="ts">
import { useWindowsStore } from '../../stores/windows';
import { useSound } from '../../composables/useSound';
import WindowFrame from './WindowFrame.vue';

// 容器组件：把 WindowFrame 的事件转接到 windows store
const store = useWindowsStore();
const sound = useSound();

function onClose(winId: string) {
  sound.close();
  store.close(winId);
}
</script>

<template>
  <div id="window-container">
    <WindowFrame
      v-for="w in store.windows"
      :key="w.id"
      :win="w"
      :active="w.id === store.activeId"
      @activate="store.activate(w.id)"
      @close="onClose(w.id)"
      @minimize="store.minimize(w.id)"
      @toggle-maximize="store.toggleMaximize(w.id)"
      @commit-bounds="bounds => store.commitBounds(w.id, bounds)"
    >
      <!-- V4 起替换为真实应用组件 -->
      <div class="app-placeholder">{{ w.title }} 的内容将在 V4 迁移</div>
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

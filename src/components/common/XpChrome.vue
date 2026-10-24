<script setup lang="ts">
import { computed } from 'vue';

interface ToolbarBtn {
  label?: string;
  icon?: string;
  disabled?: boolean;
  sep?: boolean;
}

// XP 资源管理器窗口骨架（对照旧 apps/chrome.ts），4 个保留应用共用
const props = defineProps<{
  address?: string;
  statusText?: string;
  menus?: string[];
  toolbar?: ToolbarBtn[];
}>();

const DEFAULT_MENUS = ['文件(F)', '编辑(E)', '查看(V)', '收藏(A)', '工具(T)', '帮助(H)'];
const DEFAULT_TOOLBAR: ToolbarBtn[] = [
  { label: '后退', icon: '◀', disabled: true },
  { label: '前进', icon: '▶', disabled: true },
  { label: '向上', icon: '▲', disabled: true },
  { sep: true },
  { label: '文件夹', icon: 'assets/icons/xp/16/folder-closed.png', disabled: true },
  { label: '视图(V)', icon: '▼', disabled: true },
];

const menuItems = computed(() => props.menus ?? DEFAULT_MENUS);
const toolbarItems = computed(() => props.toolbar ?? DEFAULT_TOOLBAR);

function isImagePath(icon: string) {
  return icon.includes('/') || icon.includes('.');
}
</script>

<template>
  <div class="xp-menubar">
    <span v-for="menu in menuItems" :key="menu">{{ menu }}</span>
  </div>

  <div class="xp-toolbar">
    <template v-for="(btn, i) in toolbarItems" :key="i">
      <div v-if="btn.sep" class="xp-toolbar-sep"></div>
      <button v-else class="xp-toolbar-btn" :class="{ disabled: btn.disabled }" :disabled="btn.disabled">
        <img v-if="btn.icon && isImagePath(btn.icon)" :src="btn.icon" alt="">
        <span v-else>{{ btn.icon }}</span>
        <span>{{ btn.label }}</span>
      </button>
    </template>
  </div>

  <div class="xp-addressbar">
    <span class="xp-addressbar-label">地址(D)</span>
    <input class="xp-addressbar-input" type="text" :value="address ?? ''" readonly>
    <button class="xp-addressbar-go">▶ 转到(G)</button>
  </div>

  <div class="xp-explorer">
    <div class="xp-sidebar"><slot name="sidebar" /></div>
    <div class="xp-content"><slot /></div>
  </div>

  <div class="window-statusbar">
    <slot name="statusbar">{{ statusText }}</slot>
  </div>
</template>

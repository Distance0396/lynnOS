<script setup lang="ts">
import { onMounted, onScopeDispose, ref } from 'vue';
import { useDialogsStore, type ActiveDialog } from '../../stores/dialogs';

const props = defineProps<{ dialog: ActiveDialog }>();
const store = useDialogsStore();
const root = ref<HTMLElement | null>(null);
const pos = ref<{ x: number; y: number } | null>(null);

// 图标仅接受图片路径，其余回退到 help.png（与旧 dialogIconImg 一致）
const iconSrc = ref('');

onMounted(() => {
  const icon = props.dialog.icon;
  iconSrc.value = icon && (icon.includes('/') || icon.includes('.')) ? icon : 'assets/icons/xp/16/help.png';
  // 挂载后按真实尺寸居中（与旧 showSystemDialog 一致）
  const el = root.value;
  if (!el) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight - 40;
  pos.value = {
    x: Math.max(0, Math.round((vw - el.offsetWidth) / 2)),
    y: Math.max(0, Math.round((vh - el.offsetHeight) / 2)),
  };
});

let startX = 0;
let startY = 0;
let origX = 0;
let origY = 0;

function onMouseMove(ev: MouseEvent) {
  if (!pos.value) return;
  pos.value = { x: origX + (ev.clientX - startX), y: Math.max(0, origY + (ev.clientY - startY)) };
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

function onTitlebarMousedown(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.sys-dialog-close')) return;
  if (!pos.value) return;
  e.preventDefault();
  startX = e.clientX;
  startY = e.clientY;
  origX = pos.value.x;
  origY = pos.value.y;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

onScopeDispose(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <div ref="root" class="sys-dialog" :style="pos ? { left: `${pos.x}px`, top: `${pos.y}px` } : undefined">
    <div class="sys-dialog-titlebar" @mousedown="onTitlebarMousedown">
      <span class="sys-dialog-icon"><img :src="iconSrc" alt="" width="16" height="16"></span>
      <span class="sys-dialog-title">{{ dialog.title || '系统提示' }}</span>
      <button class="sys-dialog-close" title="关闭" @click="store.close(dialog.id)">✕</button>
    </div>
    <div class="sys-dialog-body">
      <div class="sys-dialog-img"><img :src="iconSrc" alt="" width="32" height="32"></div>
      <!-- text 为应用内受控文案（含 <br>），信任边界与 data/ 文章正文一致 -->
      <div class="sys-dialog-text" v-html="dialog.text"></div>
    </div>
    <div class="sys-dialog-actions">
      <button class="xp-btn primary sys-dialog-ok" @click="store.close(dialog.id)">确定</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CLOSE_REMOVE_DELAY_MS, RESIZE_DIRECTIONS, TASKBAR_HEIGHT } from '../../constants';
import { resolveDisplayBounds, type Bounds } from '../../utils/geometry';
import { useViewport } from '../../composables/useViewport';
import { useWindowDrag } from '../../composables/useWindowDrag';
import { useWindowResize } from '../../composables/useWindowResize';
import type { WindowState } from '../../stores/windows';

const props = defineProps<{ win: WindowState; active: boolean; bodyClass?: string }>();

const emit = defineEmits<{
  activate: [];
  close: [];
  minimize: [];
  'toggle-maximize': [];
  'commit-bounds': [bounds: Partial<Bounds>];
}>();

const { viewportWidth, viewportHeight, narrow } = useViewport();

// 关闭动画是本地 UI 态：播完 130ms 后才向 store 提交移除
const closing = ref(false);
function requestClose() {
  if (closing.value) return;
  closing.value = true;
  setTimeout(() => emit('close'), CLOSE_REMOVE_DELAY_MS);
}

const { dragPreview, startDrag } = useWindowDrag({
  getPosition: () => ({ x: props.win.x, y: props.win.y }),
  getSize: () => ({ width: props.win.width, height: props.win.height }),
  onCommit: (x, y) => emit('commit-bounds', { x, y }),
});

const { resizePreview, startResize } = useWindowResize({
  getBounds: () => ({ x: props.win.x, y: props.win.y, width: props.win.width, height: props.win.height }),
  getMinSize: () => ({ width: props.win.minWidth, height: props.win.minHeight }),
  onCommit: bounds => emit('commit-bounds', bounds),
});

const maximizedLike = computed(
  () => props.win.display === 'maximized' || (narrow.value && props.win.display !== 'minimized'),
);

const bounds = computed<Bounds>(() => {
  const b = resolveDisplayBounds(props.win, {
    narrow: narrow.value,
    viewportWidth: viewportWidth.value,
    availableHeight: viewportHeight.value - TASKBAR_HEIGHT,
  });
  // 拖拽/缩放仅在 normal 态发生，preview 直接覆盖显示区域
  const preview = dragPreview.value ?? resizePreview.value;
  return preview ? { ...b, ...preview } : b;
});

const rootStyle = computed(() => ({
  left: `${bounds.value.x}px`,
  top: `${bounds.value.y}px`,
  width: `${bounds.value.width}px`,
  height: `${bounds.value.height}px`,
  zIndex: String(props.win.z),
  ...(closing.value ? { animation: 'win-close 140ms ease-in forwards' } : {}),
}));

const hasIconPath = computed(() => props.win.icon.includes('/') || props.win.icon.includes('.'));
const titleIcon = computed(() => props.win.icon.replace('/32/', '/16/').replace('/48/', '/16/'));

function onRootMousedown() {
  if (!props.active) emit('activate');
}

function onTitlebarMousedown(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.title-bar-controls')) return;
  if (narrow.value || props.win.display === 'maximized') return;
  startDrag(e);
}

function onTitlebarDblclick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.title-bar-controls')) return;
  emit('toggle-maximize');
}

function onHandleMousedown(e: MouseEvent, dir: string) {
  if (narrow.value || props.win.display === 'maximized') return;
  startResize(e, dir);
}
</script>

<template>
  <div
    class="window"
    :class="{
      inactive: !active,
      minimized: win.display === 'minimized',
      maximized: maximizedLike,
      closing,
    }"
    :style="rootStyle"
    @mousedown="onRootMousedown"
  >
    <div class="title-bar" @mousedown="onTitlebarMousedown" @dblclick="onTitlebarDblclick">
      <div class="title-bar-left">
        <span class="title-bar-icon">
          <img v-if="hasIconPath" :src="titleIcon" alt="">
          <template v-else>{{ win.icon }}</template>
        </span>
        <span class="title-bar-text">{{ win.title }}</span>
      </div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" title="最小化" @click.stop="emit('minimize')">–</button>
        <button
          :aria-label="win.display === 'maximized' ? 'Restore' : 'Maximize'"
          :title="win.display === 'maximized' ? '还原' : '最大化'"
          @click.stop="emit('toggle-maximize')"
        >
          □
        </button>
        <button aria-label="Close" title="关闭" @click.stop="requestClose">✕</button>
      </div>
    </div>

    <div class="window-body" :class="bodyClass">
      <slot />
    </div>

    <div
      v-for="dir in RESIZE_DIRECTIONS"
      :key="dir"
      class="resize-handle"
      :class="`resize-${dir}`"
      @mousedown="onHandleMousedown($event, dir)"
    />
  </div>
</template>

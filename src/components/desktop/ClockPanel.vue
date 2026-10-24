<script setup lang="ts">
import { onMounted, onScopeDispose, ref } from 'vue';
import { useSound } from '../../composables/useSound';

const emit = defineEmits<{ close: [] }>();
const sound = useSound();
sound.click(); // 打开提示音（旧 toggleClockPanel）

const root = ref<HTMLElement | null>(null);

const now = new Date();
const timeText = [now.getHours(), now.getMinutes(), now.getSeconds()]
  .map(n => String(n).padStart(2, '0'))
  .join(':');
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const dateText = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${WEEKDAYS[now.getDay()]}`;

const DREAMS = [
  '时间在这里走得很慢。',
  '每一秒都是一段记忆。',
  '你有多久没有安静地坐着了？',
  '此刻即永恒。',
  'Somewhere between yesterday and a dream.',
  '旧电脑从不忘记保存。',
  '窗外永远是那个下午。',
  '有些路只能走一次。',
];
const dream = DREAMS[Math.floor(Math.random() * DREAMS.length)];

function onDocumentClick(e: MouseEvent) {
  const el = root.value;
  if (!el) return;
  if (!el.contains(e.target as Node) && (e.target as HTMLElement).id !== 'tray-clock') {
    emit('close');
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick));
onScopeDispose(() => document.removeEventListener('click', onDocumentClick));
</script>

<template>
  <div id="clock-panel" ref="root">
    <div class="clock-time">{{ timeText }}</div>
    <div class="clock-date">{{ dateText }}</div>
    <div class="clock-separator"></div>
    <div class="clock-dream">"{{ dream }}"</div>
  </div>
</template>

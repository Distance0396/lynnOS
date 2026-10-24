<script setup lang="ts">
import { onMounted, onScopeDispose, ref } from 'vue';
import { useSound } from '../../composables/useSound';

const emit = defineEmits<{ wake: [] }>();
const sound = useSound();
sound.close(); // 进入睡眠提示音（旧 enterSleep）

const ready = ref(false);
const waking = ref(false);
const bornAt = Date.now();
let woken = false;

// 2.5s 内不响应唤醒，防止误触（与旧行为一致）
function wake() {
  if (woken || Date.now() - bornAt < 2500) return;
  woken = true;
  document.removeEventListener('keydown', onKeydown, true);
  waking.value = true;
  sound.click();
  setTimeout(() => emit('wake'), 600);
}

function onKeydown() {
  wake();
}

onMounted(() => {
  setTimeout(() => {
    ready.value = true;
  }, 2500);
  document.addEventListener('keydown', onKeydown, true);
});

onScopeDispose(() => document.removeEventListener('keydown', onKeydown, true));
</script>

<template>
  <div id="sleep-overlay" :class="{ ready, wake: waking }" @click="wake">
    <div class="sleep-text">Somewhere.exe 正在进入睡眠…</div>
    <div class="sleep-hint">按任意键或点击唤醒</div>
  </div>
</template>

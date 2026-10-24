<script setup lang="ts">
import { onMounted, onScopeDispose, ref, watch } from 'vue';
import { useBoot } from '../../composables/useBoot';

const emit = defineEmits<{ finished: [] }>();
const { phase } = useBoot();

// 完成即通知父级卸载本层
watch(phase, p => {
  if (p === 'done') emit('finished');
});

const appeared = ref(false);
const blocks = ref<HTMLElement | null>(null);
let rafId = 0;

// 进度块动画（旧 startProgress 的 rAF 移植，数学保持一致）
function startProgress() {
  const trackWidth = blocks.value?.parentElement?.clientWidth || 158;
  const cycle = 1.75;
  const t0 = performance.now();
  const frame = (now: number) => {
    if (!blocks.value) return;
    const p = (((now - t0) / 1000) % cycle) / cycle;
    const eased = 0.5 - 0.5 * Math.cos(Math.PI * p);
    blocks.value.style.transform = `translateX(${-46 + eased * (trackWidth + 92)}px)`;
    blocks.value.style.opacity = String(p < 0.1 ? p / 0.1 : p > 0.9 ? (1 - p) / 0.1 : 1);
    rafId = requestAnimationFrame(frame);
  };
  rafId = requestAnimationFrame(frame);
}

onMounted(() => {
  if (phase.value === 'done') {
    emit('finished');
    return;
  }
  requestAnimationFrame(() => {
    appeared.value = true;
    if (phase.value === 'boot') startProgress();
  });
});

watch(phase, p => {
  if (p !== 'boot') cancelAnimationFrame(rafId);
});

onScopeDispose(() => cancelAnimationFrame(rafId));
</script>

<template>
  <div id="boot-overlay" :class="{ visible: appeared, fading: phase === 'fading' }">
    <div v-if="phase === 'boot'" class="boot-screen">
      <div class="boot-logo">
        <svg class="boot-flag" viewBox="0 0 128 120" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EE4023" d="M8,22 C30,10 44,10 60,18 L60,56 C44,48 30,48 8,60 Z" />
          <path fill="#77BC1F" d="M64,18 C84,28 100,26 120,14 L120,52 C100,64 84,66 64,56 Z" />
          <path fill="#00ADEF" d="M8,66 C30,54 44,54 60,62 L60,100 C44,92 30,92 8,104 Z" />
          <path fill="#FDB813" d="M64,62 C84,72 100,70 120,58 L120,96 C100,108 84,110 64,100 Z" />
        </svg>
        <div class="boot-wordmark">Microsoft<sup>®</sup> <span class="bwm-win">Windows<sup>®</sup></span> <span class="bwm-xp">XP</span></div>
        <div class="boot-edition">Home Edition</div>
      </div>
      <div class="boot-progress"><div ref="blocks" class="boot-progress-blocks"><i></i><i></i><i></i></div></div>
      <div class="boot-copyright">Copyright © Microsoft Corporation</div>
    </div>

    <div v-else class="boot-welcome">
      <div class="bw-logo">
        <svg class="bw-flag" viewBox="0 0 128 120" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EE4023" d="M8,22 C30,10 44,10 60,18 L60,56 C44,48 30,48 8,60 Z" />
          <path fill="#77BC1F" d="M64,18 C84,28 100,26 120,14 L120,52 C100,64 84,66 64,56 Z" />
          <path fill="#00ADEF" d="M8,66 C30,54 44,54 60,62 L60,100 C44,92 30,92 8,104 Z" />
          <path fill="#FDB813" d="M64,62 C84,72 100,70 120,58 L120,96 C100,108 84,110 64,100 Z" />
        </svg>
        <span>Microsoft<sup>®</sup> Windows<sup>®</sup> XP</span>
      </div>
      <div class="bw-center">
        <div class="bw-text" :class="{ loading: phase === 'loading' || phase === 'fading' }">
          {{ phase === 'welcome' ? '欢 迎' : '正在加载个人设置...' }}
        </div>
      </div>
      <div class="bw-footer">
        <span class="bw-power">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M6 1v5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
            <path d="M3.4 3a4.2 4.2 0 1 0 5.2 0" stroke="#fff" fill="none" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </span>
        <span>关闭计算机</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WindowState } from '../../stores/windows';

defineProps<{ win: WindowState; active: boolean }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button class="task-btn" :class="{ active }" @click="emit('click')">
    <span class="task-icon"><img :src="win.icon.replace('/32/', '/16/').replace('/48/', '/16/')" alt=""></span>
    <span class="task-title">{{ win.title }}</span>
  </button>
</template>

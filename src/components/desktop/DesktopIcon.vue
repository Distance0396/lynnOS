<script setup lang="ts">
import { APPS } from '../../apps/registry';

defineProps<{ appId: string; label: string; selected: boolean }>();
const emit = defineEmits<{ select: []; open: [] }>();
</script>

<template>
  <div class="desktop-icon" :class="{ selected }" @click.stop="emit('select')" @dblclick.stop="emit('open')">
    <div class="icon-img"><img :src="APPS[appId]?.icon" alt=""></div>
    <div class="icon-label">{{ label }}</div>
  </div>
</template>

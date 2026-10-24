<script setup lang="ts">
import { useSettingsStore } from '../../stores/settings';
import { useClock } from '../../composables/useClock';
import { useSound } from '../../composables/useSound';

const emit = defineEmits<{ 'toggle-clock': [] }>();
const settings = useSettingsStore();
const sound = useSound();
const { time } = useClock();

function toggleSound() {
  settings.update({ soundEnabled: !settings.soundEnabled });
  if (settings.soundEnabled) sound.click();
}
</script>

<template>
  <div id="system-tray">
    <span
      id="tray-volume"
      class="tray-icon"
      :title="settings.soundEnabled ? '音量 (已开启)' : '音量 (已静音)'"
      @click.stop="toggleSound"
    >
      <img
        :src="settings.soundEnabled ? 'assets/icons/xp/16/volume.png' : 'assets/icons/xp/16/error.png'"
        alt=""
        width="16"
        height="16"
      >
    </span>
    <span id="tray-network" class="tray-icon" title="网络">
      <img src="/assets/icons/xp/16/network.png" alt="" width="16" height="16">
    </span>
    <div id="tray-clock" @click.stop="emit('toggle-clock')">{{ time }}</div>
  </div>
</template>

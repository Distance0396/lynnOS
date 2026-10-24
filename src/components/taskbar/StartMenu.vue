<script setup lang="ts">
import { START_MENU_LEFT, START_MENU_RIGHT, type StartMenuItem } from '../../apps/registry';

const emit = defineEmits<{ select: [appId: string]; 'all-programs': []; sleep: [] }>();

function onSelect(item: StartMenuItem) {
  if (item.appId) emit('select', item.appId);
}
</script>

<template>
  <div id="start-menu">
    <div class="start-header">
      <span class="start-username">Lynn</span>
      <div class="start-avatar"><img src="/assets/icons/xp/48/user-key.png" alt=""></div>
    </div>
    <div class="start-body">
      <div class="start-col-left">
        <div id="start-menu-left">
          <div
            v-for="item in START_MENU_LEFT"
            :key="item.label"
            class="start-item"
            :class="{ bold: item.bold }"
            role="button"
            tabindex="0"
            @click="onSelect(item)"
            @keydown.enter.prevent="onSelect(item)"
          >
            <span class="si-icon"><img :src="item.icon" alt=""></span>
            <span class="si-label">{{ item.label }}</span>
          </div>
        </div>
        <div class="start-hsep"></div>
        <div class="start-allprograms" role="button" tabindex="0" @click="emit('all-programs')" @keydown.enter.prevent="emit('all-programs')">
          <span class="ap-icon"><img src="/assets/icons/xp/32/windows-logo.png" alt=""></span>
          <span class="ap-label">所有程序</span>
          <span class="ap-arrow">&#9654;</span>
        </div>
      </div>
      <div class="start-col-right">
        <div id="start-menu-right">
          <template v-for="item in START_MENU_RIGHT" :key="item.label">
            <div v-if="item.sep" class="start-vsep"></div>
            <div v-else class="start-item" role="button" tabindex="0" @click="onSelect(item)" @keydown.enter.prevent="onSelect(item)">
              <span class="si-icon"><img :src="item.icon" alt=""></span>
              <span class="si-label">{{ item.label }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div id="start-menu-bottom">
      <button class="start-bottom-btn" @click="emit('sleep')">
        <img src="/assets/icons/xp/16/shutdown.png" alt=""> 进入睡眠
      </button>
    </div>
  </div>
</template>

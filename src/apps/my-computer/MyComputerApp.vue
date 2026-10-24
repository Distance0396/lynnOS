<script setup lang="ts">
import { ref } from 'vue';
import { openApp } from '../../apps/registry';
import XpChrome from '../../components/common/XpChrome.vue';

interface SidebarLink {
  label: string;
  icon: string;
  appId: string;
}

interface GridItem {
  label: string;
  icon: string;
  appId: string | null;
}

// 侧栏与内容项已按保留应用范围裁剪（范围变更见 PRD）
const SYSTEM_TASKS: SidebarLink[] = [
  { label: '查看有关本机的基本信息', icon: 'assets/icons/xp/16/computer-tower.png', appId: 'about-me' },
];

const OTHER_PLACES: SidebarLink[] = [
  { label: '回收站', icon: 'assets/icons/xp/16/recycle-bin.png', appId: 'recycle-bin' },
  { label: '留言板', icon: 'assets/icons/xp/16/document-edit.png', appId: 'guestbook' },
];

const ITEMS: GridItem[] = [
  { label: '本地磁盘 (C:)', icon: 'assets/icons/xp/32/hard-drive.png', appId: null },
  { label: '关于我', icon: 'assets/icons/xp/32/user-key.png', appId: 'about-me' },
  { label: '留言板', icon: 'assets/icons/xp/32/document-edit.png', appId: 'guestbook' },
  { label: '回收站', icon: 'assets/icons/xp/32/recycle-bin.png', appId: 'recycle-bin' },
];

const selectedLabel = ref<string | null>(null);

function selectItem(item: GridItem) {
  selectedLabel.value = item.label;
}

function openItem(item: GridItem) {
  if (item.appId) openApp(item.appId);
}
</script>

<template>
  <XpChrome address="我的电脑">
    <template #sidebar>
      <div class="xp-sidebar-section">
        <div class="xp-sidebar-header"><span class="arrow">▼</span> 系统任务</div>
        <div class="xp-sidebar-links">
          <a
            v-for="link in SYSTEM_TASKS"
            :key="link.label"
            class="xp-sidebar-link"
            @click.prevent="openApp(link.appId)"
          >
            <img :src="link.icon" alt=""> {{ link.label }}
          </a>
        </div>
      </div>
      <div class="xp-sidebar-section">
        <div class="xp-sidebar-header"><span class="arrow">▼</span> 其他位置</div>
        <div class="xp-sidebar-links">
          <a
            v-for="link in OTHER_PLACES"
            :key="link.label"
            class="xp-sidebar-link"
            @click.prevent="openApp(link.appId)"
          >
            <img :src="link.icon" alt=""> {{ link.label }}
          </a>
        </div>
      </div>
    </template>

    <div class="xp-content-grid">
      <div
        v-for="item in ITEMS"
        :key="item.label"
        class="xp-content-item"
        :class="{ selected: selectedLabel === item.label }"
        @click="selectItem(item)"
        @dblclick="openItem(item)"
      >
        <img :src="item.icon" alt="">
        <span class="xp-item-label">{{ item.label }}</span>
      </div>
    </div>

    <template #statusbar>我的电脑 · {{ ITEMS.length }} 个项目</template>
  </XpChrome>
</template>

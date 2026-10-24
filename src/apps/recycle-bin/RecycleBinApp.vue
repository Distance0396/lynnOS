<script setup lang="ts">
import { useDialogsStore } from '../../stores/dialogs';
import { useSound } from '../../composables/useSound';
import XpChrome from '../../components/common/XpChrome.vue';

interface RecycleFile {
  name: string;
  origin: string;
  date: string;
}

const FILES: RecycleFile[] = [
  { name: 'unfinished_dream.txt', origin: 'C:\\Documents', date: '2024-06-01' },
  { name: 'old_memory.jpg', origin: 'C:\\Pictures', date: '2024-03-15' },
  { name: 'untitled_note.txt', origin: 'C:\\Documents', date: '2023-12-20' },
];

// 回收站记忆彩蛋（自旧 atmosphere.ts 迁入）
const MEMORIES: Record<string, { icon: string; title: string; text: string }> = {
  'unfinished_dream.txt': {
    icon: 'assets/icons/xp/32/notepad-file.png',
    title: 'unfinished_dream.txt',
    text: '"我梦见自己在一个没有尽头的走廊里走着。<br>每扇门后面都是一个不同的下午。<br>我选择了最安静的那一扇。"',
  },
  'old_memory.jpg': {
    icon: 'assets/icons/xp/32/camera.png',
    title: 'old_memory.jpg',
    text: '一张褪色的照片。<br>画面里是一片蓝天和远处的山丘。<br>照片背面写着："2007年夏天，一切都还好。"',
  },
  'untitled_note.txt': {
    icon: 'assets/icons/xp/32/notepad-file.png',
    title: 'untitled_note.txt',
    text: '"今天什么也没做。<br>但什么也没做的日子，<br>有时候是最好的日子。"',
  },
};

const dialogs = useDialogsStore();
const sound = useSound();

function showMemory(file: RecycleFile) {
  const memory = MEMORIES[file.name];
  if (memory) dialogs.show({ ...memory, duration: 12000 });
}

function onEmpty() {
  sound.click();
  dialogs.show({
    icon: 'assets/icons/xp/32/recycle-bin.png',
    title: '回收站',
    text: '这些记忆已经被永久删除了。<br>……当然，只是演示数据。',
    duration: 10000,
  });
}

function onRestore() {
  sound.click();
  dialogs.show({
    icon: 'assets/icons/xp/32/help.png',
    title: '回收站',
    text: '文件已还原。<br>记忆又回来了。',
    duration: 8000,
  });
}
</script>

<template>
  <XpChrome address="回收站">
    <div class="rb-root">
      <table class="rb-table">
        <thead>
          <tr>
            <th class="rb-name">名称</th>
            <th class="rb-origin">原始位置</th>
            <th class="rb-date">删除日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in FILES" :key="file.name" class="recycle-row" @dblclick="showMemory(file)">
            <td class="rb-cell">
              <img src="/assets/icons/xp/16/notepad-file.png" alt="" width="16" height="16">
              {{ file.name }}
            </td>
            <td class="rb-cell rb-muted">{{ file.origin }}</td>
            <td class="rb-cell rb-muted">{{ file.date }}</td>
          </tr>
        </tbody>
      </table>
      <div class="rb-actions">
        <button class="xp-btn" @click="onEmpty">清空回收站</button>
        <button class="xp-btn" @click="onRestore">还原所有文件</button>
      </div>
      <div class="rb-hint">— 双击文件查看记忆内容 —</div>
    </div>
    <template #statusbar>回收站 · {{ FILES.length }} 个文件</template>
  </XpChrome>
</template>

<style scoped>
.rb-root {
  padding: 12px;
}

.rb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.rb-table thead tr {
  background: #e8ecf4;
  border-bottom: 1px solid #c8c8b8;
}

.rb-table th {
  text-align: left;
  padding: 4px 8px;
  font-weight: normal;
}

.rb-origin {
  width: 120px;
}

.rb-date {
  width: 110px;
}

/* hover 替代旧内联 onmouseover */
.recycle-row {
  border-bottom: 1px solid #e8e8d8;
  cursor: default;
}

.recycle-row:hover {
  background: #e8ecf4;
}

.rb-cell {
  padding: 3px 8px;
}

.rb-cell img {
  vertical-align: -3px;
  margin-right: 4px;
}

.rb-muted {
  color: var(--text-secondary);
}

.rb-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.rb-hint {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}
</style>

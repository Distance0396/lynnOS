<script setup lang="ts">
import { computed } from 'vue';
import { useDialogsStore } from '../../stores/dialogs';
import { useGuestbookStore } from '../../stores/guestbook';
import { useSound } from '../../composables/useSound';
import { useGuestbookForm } from './useGuestbookForm';
import XpChrome from '../../components/common/XpChrome.vue';

const store = useGuestbookStore();
const dialogs = useDialogsStore();
const sound = useSound();
const form = useGuestbookForm();

// 列表按时间倒序展示（旧 render 的 reverse 行为）
const reversed = computed(() => store.messages.slice().reverse());

function showError(text: string) {
  sound.error();
  dialogs.show({ icon: 'assets/icons/xp/32/error.png', title: '留言板', text });
}

function onSubmit() {
  const result = form.submit();
  if (Array.isArray(result)) {
    showError(result.join('<br>'));
    return;
  }
  if (!store.add(result)) {
    showError('浏览器存储不可用，本次留言仅在当前会话中显示。');
    return;
  }
  sound.click();
}
</script>

<template>
  <XpChrome address="留言板">
    <div class="gb-wrap">
      <h3 class="gb-title">留言板</h3>
      <div class="gb-list">
        <div v-if="store.messages.length === 0" class="gb-empty">还没有留言。</div>
        <template v-else>
          <div v-for="(msg, i) in reversed" :key="`${msg.date}-${i}`" class="gb-item">
            <div class="gb-meta"><b>{{ msg.name }}</b> <span class="gb-date">{{ msg.date }}</span></div>
            <div class="gb-text">{{ msg.text }}</div>
          </div>
        </template>
        <div class="gb-note">— 留言仅保存在你自己的浏览器中 —</div>
      </div>
      <div class="gb-form">
        <input v-model="form.name.value" class="gb-name" type="text" placeholder="昵称" maxlength="40">
        <input v-model="form.text.value" class="gb-input" type="text" placeholder="写下你的留言..." @keydown.enter="onSubmit">
        <button class="xp-btn primary" @click="onSubmit">提交</button>
      </div>
    </div>
    <template #statusbar>留言板 · {{ store.messages.length }} 条留言</template>
  </XpChrome>
</template>

<style scoped>
.gb-wrap {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.gb-title {
  font-size: 15px;
  color: var(--xp-blue);
  margin: 0 0 12px;
}

.gb-list {
  flex: 1;
  overflow: auto;
  border: 1px solid #d5d2c5;
  background: white;
  padding: 12px;
  margin-bottom: 12px;
}

.gb-empty {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  padding: 20px 0;
}

.gb-item {
  border-bottom: 1px solid #e8e8d8;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.gb-meta {
  font-size: 12px;
}

.gb-date {
  color: var(--text-secondary);
}

.gb-text {
  font-size: 13px;
  margin-top: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.gb-note {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 12px;
}

.gb-form {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.gb-name,
.gb-input {
  padding: 3px 6px;
  border: 1px solid #7f9db9;
  font-size: 12px;
  font-family: var(--font-system);
}

.gb-name {
  width: 120px;
}

.gb-input {
  flex: 1;
  min-width: 200px;
}
</style>

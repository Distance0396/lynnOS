// 留言数据 + localStorage 持久化（行为对照旧 guestbook.ts）
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { STORAGE_KEYS } from '../constants';
import { saveJson } from '../composables/useLocalStorage';

export interface GuestbookMessage {
  name: string;
  text: string;
  date: string;
}

const DEMO_MESSAGES: GuestbookMessage[] = [
  { name: '访客A', text: '很漂亮的网站，有那种旧电脑的感觉。', date: '2024-08-10' },
  { name: '路过的人', text: 'Somewhere between yesterday and a dream. 喜欢这句话。', date: '2024-07-22' },
];

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const useGuestbookStore = defineStore('guestbook', () => {
  const messages = ref<GuestbookMessage[]>(DEMO_MESSAGES.slice());
  // 存储损坏时保持只读展示，避免覆盖原数据（与旧行为一致）
  const persist = ref(true);

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.guestbook);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) messages.value = parsed as GuestbookMessage[];
    }
  } catch {
    persist.value = false;
  }

  // 返回是否成功持久化；失败时调用方提示「仅当前会话显示」
  function add(draft: { name: string; text: string }): boolean {
    messages.value.push({ ...draft, date: today() });
    if (!persist.value) return false;
    if (!saveJson(STORAGE_KEYS.guestbook, messages.value)) {
      persist.value = false;
      return false;
    }
    return true;
  }

  return { messages, persist, add };
});

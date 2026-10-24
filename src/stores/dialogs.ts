// 系统提示对话框队列（旧 atmosphere.showSystemDialog 的状态部分）
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useSound } from '../composables/useSound';

export interface SystemDialogMessage {
  icon?: string;
  title?: string;
  text: string;
  duration?: number; // ms 后自动关闭
}

export interface ActiveDialog extends SystemDialogMessage {
  id: number;
}

export const useDialogsStore = defineStore('dialogs', () => {
  const dialogs = ref<ActiveDialog[]>([]);
  let nextId = 1;
  const timers = new Map<number, ReturnType<typeof setTimeout>>();

  function show(message: SystemDialogMessage): number {
    const id = nextId++;
    dialogs.value.push({ ...message, id });
    useSound().open();
    if (message.duration) {
      timers.set(id, setTimeout(() => close(id), message.duration));
    }
    return id;
  }

  function close(id: number) {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    const before = dialogs.value.length;
    dialogs.value = dialogs.value.filter(d => d.id !== id);
    if (dialogs.value.length < before) useSound().close();
  }

  // Esc 栈用：关闭最上层对话框，无对话框时返回 false 交由下一层处理
  function closeTop(): boolean {
    const top = dialogs.value[dialogs.value.length - 1];
    if (!top) return false;
    close(top.id);
    return true;
  }

  return { dialogs, show, close, closeTop };
});

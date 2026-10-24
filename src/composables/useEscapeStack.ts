// Esc 逐层关闭浮层：栈内后注册先关闭；close 返回 false 表示该层未打开、继续向下找
import { onScopeDispose } from 'vue';

type LayerClose = () => boolean;

const stack: LayerClose[] = [];
let listening = false;

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return;
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i]()) return;
  }
}

function ensureListener() {
  if (listening) return;
  listening = true;
  document.addEventListener('keydown', onKeydown);
}

export function useEscapeStack() {
  ensureListener();

  function push(close: LayerClose) {
    stack.push(close);
    onScopeDispose(() => {
      const i = stack.indexOf(close);
      if (i >= 0) stack.splice(i, 1);
    });
  }

  return { push };
}

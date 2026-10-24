// 标题栏拖拽：过程更新本地 preview（不写 store），mouseup 时一次性 commit
import { onScopeDispose, ref, type Ref } from 'vue';
import { clampDragPosition } from '../utils/geometry';
import { TASKBAR_HEIGHT } from '../constants';

interface DragOptions {
  getPosition: () => { x: number; y: number };
  getSize: () => { width: number; height: number };
  onCommit: (x: number, y: number) => void;
}

export function useWindowDrag(opts: DragOptions) {
  const dragPreview: Ref<{ x: number; y: number } | null> = ref(null);
  let startX = 0;
  let startY = 0;
  let origX = 0;
  let origY = 0;

  function onMouseMove(ev: MouseEvent) {
    const { width, height } = opts.getSize();
    dragPreview.value = clampDragPosition(
      origX + (ev.clientX - startX),
      origY + (ev.clientY - startY),
      width,
      height,
      window.innerWidth,
      window.innerHeight - TASKBAR_HEIGHT,
    );
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (dragPreview.value) {
      const { x, y } = dragPreview.value;
      dragPreview.value = null;
      opts.onCommit(x, y);
    }
  }

  function startDrag(e: MouseEvent) {
    e.preventDefault();
    const pos = opts.getPosition();
    startX = e.clientX;
    startY = e.clientY;
    origX = pos.x;
    origY = pos.y;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onScopeDispose(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  });

  return { dragPreview, startDrag };
}

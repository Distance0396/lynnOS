// 八方向缩放：过程更新本地 preview（不写 store），mouseup 时一次性 commit
import { onScopeDispose, ref, type Ref } from 'vue';
import { computeResize, type Bounds } from '../utils/geometry';

interface ResizeOptions {
  getBounds: () => Bounds;
  getMinSize: () => { width: number; height: number };
  onCommit: (bounds: Bounds) => void;
}

export function useWindowResize(opts: ResizeOptions) {
  const resizePreview: Ref<Bounds | null> = ref(null);
  let dir = '';
  let startX = 0;
  let startY = 0;
  let orig: Bounds = { x: 0, y: 0, width: 0, height: 0 };

  function onMouseMove(ev: MouseEvent) {
    const { width: minWidth, height: minHeight } = opts.getMinSize();
    resizePreview.value = computeResize(dir, orig, ev.clientX - startX, ev.clientY - startY, minWidth, minHeight);
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (resizePreview.value) {
      const bounds = resizePreview.value;
      resizePreview.value = null;
      opts.onCommit(bounds);
    }
  }

  function startResize(e: MouseEvent, direction: string) {
    e.preventDefault();
    e.stopPropagation();
    dir = direction;
    startX = e.clientX;
    startY = e.clientY;
    orig = opts.getBounds();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onScopeDispose(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  });

  return { resizePreview, startResize };
}

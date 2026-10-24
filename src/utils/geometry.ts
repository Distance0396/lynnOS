// 窗口拖拽/缩放/定位的几何计算，全部纯函数（行为逐行对照旧 window-manager.ts）
import type { WindowDisplay } from './display';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MIN_VISIBLE_TITLE = 40;

// 打开窗口时在工作区内居中
export function centeredPosition(
  width: number,
  height: number,
  viewportWidth: number,
  availableHeight: number,
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.round((viewportWidth - width) / 2)),
    y: Math.max(0, Math.round((availableHeight - height) / 2)),
  };
}

// 拖拽落点钳制：标题至少 40px 可见，且窗口不得整体拖出工作区
export function clampDragPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  viewportWidth: number,
  availableHeight: number,
): { x: number; y: number } {
  let nx = Math.max(-(width - MIN_VISIBLE_TITLE), Math.min(viewportWidth - MIN_VISIBLE_TITLE, x));
  let ny = Math.max(0, Math.min(availableHeight - 30, y));
  if (nx + width < MIN_VISIBLE_TITLE) nx = -(width - MIN_VISIBLE_TITLE);
  if (ny + height > availableHeight) ny = availableHeight - height;
  return { x: nx, y: ny };
}

// 八方向缩放：e/s 只改尺寸，w/n 同步反向移动原点，最小值钳制
export function computeResize(
  dir: string,
  orig: Bounds,
  dx: number,
  dy: number,
  minWidth: number,
  minHeight: number,
): Bounds {
  let { x, y, width, height } = orig;
  if (dir.includes('e')) width = Math.max(minWidth, orig.width + dx);
  if (dir.includes('w')) {
    width = Math.max(minWidth, orig.width - dx);
    x = orig.x + orig.width - width;
  }
  if (dir.includes('s')) height = Math.max(minHeight, orig.height + dy);
  if (dir.includes('n')) {
    height = Math.max(minHeight, orig.height - dy);
    y = orig.y + orig.height - height;
  }
  return { x, y, width, height };
}

// 窗口实际显示区域：最大化或窄屏（非最小化）时铺满整个工作区
export function resolveDisplayBounds(
  win: { display: WindowDisplay; x: number; y: number; width: number; height: number },
  opts: { narrow: boolean; viewportWidth: number; availableHeight: number },
): Bounds {
  if (win.display === 'maximized' || (opts.narrow && win.display !== 'minimized')) {
    return { x: 0, y: 0, width: opts.viewportWidth, height: opts.availableHeight };
  }
  return { x: win.x, y: win.y, width: win.width, height: win.height };
}

// geometry.test.ts — 窗口几何纯函数
import { describe, expect, it } from 'vitest';
import {
  centeredPosition,
  clampDragPosition,
  computeResize,
  resolveDisplayBounds,
} from './geometry';

describe('centeredPosition', () => {
  it('centers within the available area', () => {
    expect(centeredPosition(600, 450, 1024, 728)).toEqual({ x: 212, y: 139 });
  });

  it('clamps to 0 when the window is larger than the area', () => {
    expect(centeredPosition(2000, 1000, 1024, 728)).toEqual({ x: 0, y: 0 });
  });
});

describe('clampDragPosition', () => {
  it('keeps the position inside the working area', () => {
    expect(clampDragPosition(100, 50, 600, 400, 1024, 728)).toEqual({ x: 100, y: 50 });
  });

  it('keeps at least 40px of the title visible horizontally', () => {
    // 左侧：不允许拖出超过 width - 40
    expect(clampDragPosition(-700, 50, 600, 400, 1024, 728)).toEqual({ x: -560, y: 50 });
    // 右侧：不允许超过 viewport - 40
    expect(clampDragPosition(1200, 50, 600, 400, 1024, 728)).toEqual({ x: 984, y: 50 });
  });

  it('keeps the window bottom inside the working area', () => {
    // y + height > availableHeight 时贴底
    expect(clampDragPosition(100, 600, 600, 400, 1024, 728)).toEqual({ x: 100, y: 328 });
    // y 不为负
    expect(clampDragPosition(100, -10, 600, 400, 1024, 728)).toEqual({ x: 100, y: 0 });
  });
});

describe('computeResize', () => {
  const orig = { x: 100, y: 100, width: 400, height: 300 };

  it('resizes from east without moving the origin', () => {
    expect(computeResize('e', orig, 50, 0, 280, 160)).toEqual({ x: 100, y: 100, width: 450, height: 300 });
  });

  it('resizes from west and shifts the origin', () => {
    expect(computeResize('w', orig, -50, 0, 280, 160)).toEqual({ x: 50, y: 100, width: 450, height: 300 });
  });

  it('respects minWidth on west resize', () => {
    // 向右拖西边缘 dx=+120 → 收窄到 minWidth
    const b = computeResize('w', orig, 120, 0, 280, 160);
    expect(b.width).toBe(280);
    expect(b.x).toBe(220); // orig.x + orig.width - minWidth
  });

  it('resizes from north and shifts the origin', () => {
    expect(computeResize('n', orig, 0, -30, 280, 160)).toEqual({ x: 100, y: 70, width: 400, height: 330 });
  });

  it('handles diagonal (se) resize', () => {
    expect(computeResize('se', orig, 30, 30, 280, 160)).toEqual({ x: 100, y: 100, width: 430, height: 330 });
  });
});

describe('resolveDisplayBounds', () => {
  const win = { display: 'normal' as const, x: 10, y: 20, width: 300, height: 200 };
  const area = { narrow: false, viewportWidth: 1024, availableHeight: 728 };

  it('returns own bounds for a normal window', () => {
    expect(resolveDisplayBounds(win, area)).toEqual({ x: 10, y: 20, width: 300, height: 200 });
  });

  it('fills the working area when maximized', () => {
    expect(resolveDisplayBounds({ ...win, display: 'maximized' }, area)).toEqual({
      x: 0, y: 0, width: 1024, height: 728,
    });
  });

  it('keeps minimized windows untouched on narrow screens', () => {
    expect(resolveDisplayBounds({ ...win, display: 'minimized' }, { ...area, narrow: true })).toEqual({
      x: 10, y: 20, width: 300, height: 200,
    });
  });

  it('forces fullscreen on narrow screens for visible windows', () => {
    expect(resolveDisplayBounds(win, { ...area, narrow: true })).toEqual({
      x: 0, y: 0, width: 1024, height: 728,
    });
  });
});

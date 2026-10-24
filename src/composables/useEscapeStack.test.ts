// useEscapeStack.test.ts — Esc 逐层关闭
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { effectScope } from 'vue';
import { useEscapeStack } from './useEscapeStack';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
}

// 在独立 effect scope 中注册，返回 scope.stop 以模拟组件卸载
function withScope(fn: () => void): () => void {
  const scope = effectScope();
  scope.run(fn)!;
  return () => scope.stop();
}

it('closes the most recently registered layer first', () => {
  const calls: string[] = [];
  const { push } = useEscapeStack();
  withScope(() => {
    push(() => {
      calls.push('menu');
      return true;
    });
    push(() => {
      calls.push('dialog');
      return true;
    });
  });

  pressEscape();
  expect(calls).toEqual(['dialog']);
});

it('falls through to lower layers when a layer is not open', () => {
  const calls: string[] = [];
  const { push } = useEscapeStack();
  withScope(() => {
    push(() => {
      calls.push('menu');
      return true;
    });
    push(() => {
      calls.push('dialog');
      return false;
    });
  });

  pressEscape();
  expect(calls).toEqual(['dialog', 'menu']);
});

it('ignores non-Escape keys', () => {
  const { push } = useEscapeStack();
  let called = false;
  withScope(() => push(() => {
    called = true;
    return true;
  }));

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  expect(called).toBe(false);
});

it('removes the layer when the scope stops', () => {
  const calls: string[] = [];
  const { push } = useEscapeStack();
  const stop = withScope(() => push(() => {
    calls.push('menu');
    return true;
  }));

  stop();
  pressEscape();
  expect(calls).toEqual([]);
});

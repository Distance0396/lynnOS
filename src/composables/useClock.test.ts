// useClock.test.ts — 任务栏时钟
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { effectScope } from 'vue';
import { useClock } from './useClock';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 25, 10, 5, 30));
});

afterEach(() => {
  vi.useRealTimers();
});

function withScope<T>(fn: () => T): T {
  // 不 stop：保持 interval 存活到测试结束（作用域随测试进程释放）
  const scope = effectScope();
  let result!: T;
  scope.run(() => {
    result = fn();
  })!;
  return result;
}

it('formats the current time as HH:MM', () => {
  const { time } = withScope(() => useClock());
  expect(time.value).toBe('10:05');
});

it('refreshes every 15 seconds', () => {
  const { time } = withScope(() => useClock());
  expect(time.value).toBe('10:05'); // 10:05:30
  vi.advanceTimersByTime(15000);
  expect(time.value).toBe('10:05'); // 10:05:45
  vi.advanceTimersByTime(15000);
  expect(time.value).toBe('10:06'); // 10:06:00
});

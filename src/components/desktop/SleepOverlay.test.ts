// SleepOverlay.test.ts — 睡眠遮罩
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import SleepOverlay from './SleepOverlay.vue';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// useSound 依赖 settings store，挂载时需安装 Pinia
function mountOverlay() {
  return mount(SleepOverlay, { global: { plugins: [createPinia()] } });
}

it('marks itself ready after 2.5s', async () => {
  const wrapper = mountOverlay();
  expect(wrapper.classes()).not.toContain('ready');
  vi.advanceTimersByTime(2500);
  await wrapper.vm.$nextTick();
  expect(wrapper.classes()).toContain('ready');
});

it('ignores wake attempts during the first 2.5s', async () => {
  const wrapper = mountOverlay();
  await wrapper.trigger('click');
  vi.advanceTimersByTime(1000);
  expect(wrapper.emitted('wake')).toBeUndefined();
});

it('wakes on click after ready and emits wake 600ms later', async () => {
  const wrapper = mountOverlay();
  vi.advanceTimersByTime(2500);
  await wrapper.trigger('click');
  expect(wrapper.classes()).toContain('wake');
  expect(wrapper.emitted('wake')).toBeUndefined();
  vi.advanceTimersByTime(600);
  expect(wrapper.emitted('wake')).toHaveLength(1);
});

it('wakes on any keydown (capture) after ready', async () => {
  const wrapper = mountOverlay();
  vi.advanceTimersByTime(2500);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
  vi.advanceTimersByTime(600);
  expect(wrapper.emitted('wake')).toHaveLength(1);
});

it('only wakes once', async () => {
  const wrapper = mountOverlay();
  vi.advanceTimersByTime(2500);
  await wrapper.trigger('click');
  await wrapper.trigger('click');
  vi.advanceTimersByTime(600);
  expect(wrapper.emitted('wake')).toHaveLength(1);
});

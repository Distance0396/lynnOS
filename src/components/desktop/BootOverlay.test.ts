// BootOverlay.test.ts — 开机画面组件
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BootOverlay from './BootOverlay.vue';
import { BOOT_TIMING, STORAGE_KEYS } from '../../constants';

const { boot: BOOT_MS, welcome: WELCOME_MS, loading: LOADING_MS, fade: FADE_MS } = BOOT_TIMING;

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('boot phases', () => {
  it('shows the XP boot screen first', () => {
    const wrapper = mount(BootOverlay);
    vi.advanceTimersByTime(32); // rAF：挂载 visible
    expect(wrapper.find('.boot-screen').exists()).toBe(true);
    expect(wrapper.find('.boot-wordmark').exists()).toBe(true);
  });

  it('switches to the welcome screen with startup sound timing', async () => {
    const wrapper = mount(BootOverlay);
    vi.advanceTimersByTime(BOOT_MS);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.boot-welcome').exists()).toBe(true);
    expect(wrapper.find('.bw-text').text()).toBe('欢 迎');

    vi.advanceTimersByTime(WELCOME_MS);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.bw-text').text()).toBe('正在加载个人设置...');
    expect(wrapper.find('.bw-text').classes()).toContain('loading');
  });

  it('applies fading class, emits finished and marks bootDone', async () => {
    const wrapper = mount(BootOverlay);
    vi.advanceTimersByTime(BOOT_MS + WELCOME_MS + LOADING_MS);
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain('fading');

    vi.advanceTimersByTime(FADE_MS);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('finished')).toHaveLength(1);
    expect(localStorage.getItem(STORAGE_KEYS.bootDone)).toBe('1');
  });
});

describe('skip', () => {
  it('emits finished immediately when the boot flag is set', () => {
    localStorage.setItem(STORAGE_KEYS.bootDone, '1');
    const wrapper = mount(BootOverlay);
    expect(wrapper.emitted('finished')).toHaveLength(1);
  });
});

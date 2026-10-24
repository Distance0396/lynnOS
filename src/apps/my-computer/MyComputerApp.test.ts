// MyComputerApp.test.ts — 我的电脑应用
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import MyComputerApp from './MyComputerApp.vue';
import { useWindowsStore } from '../../stores/windows';

function mountApp() {
  return mount(MyComputerApp, { global: { plugins: [createPinia()] } });
}

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('rendering', () => {
  it('renders pruned sidebar sections and content grid', () => {
    const wrapper = mountApp();
    expect(wrapper.text()).toContain('系统任务');
    expect(wrapper.text()).toContain('其他位置');
    expect(wrapper.findAll('.xp-content-item').length).toBe(4);
    expect(wrapper.text()).toContain('本地磁盘 (C:)');
    expect(wrapper.text()).toContain('我的电脑 · 4 个项目');
    // 已移除指向被裁剪应用的条目
    expect(wrapper.text()).not.toContain('文章档案');
    expect(wrapper.text()).not.toContain('系统设置');
  });
});

describe('interactions', () => {
  it('selects an item on single click without opening', async () => {
    const wrapper = mountApp();
    await wrapper.findAll('.xp-content-item')[0].trigger('click');
    expect(wrapper.findAll('.xp-content-item')[0].classes()).toContain('selected');
    expect(useWindowsStore().windows.length).toBe(0);
  });

  it('opens the linked app on double-click', async () => {
    const wrapper = mountApp();
    await wrapper.findAll('.xp-content-item')[1].trigger('dblclick');
    const store = useWindowsStore();
    expect(store.windows.length).toBe(1);
    expect(store.windows[0].appId).toBe('about-me');
  });

  it('opens the app from a sidebar link', async () => {
    const wrapper = mountApp();
    await wrapper.findAll('.xp-sidebar-link')[0].trigger('click');
    expect(useWindowsStore().windows[0].appId).toBe('about-me');
  });
});

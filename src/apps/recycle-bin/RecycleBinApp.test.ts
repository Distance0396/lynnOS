// RecycleBinApp.test.ts — 回收站应用
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RecycleBinApp from './RecycleBinApp.vue';
import { useDialogsStore } from '../../stores/dialogs';

function mountApp() {
  return mount(RecycleBinApp, { global: { plugins: [createPinia()] } });
}

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('rendering', () => {
  it('lists the 3 demo files with hover rows', () => {
    const wrapper = mountApp();
    expect(wrapper.findAll('.recycle-row').length).toBe(3);
    expect(wrapper.text()).toContain('unfinished_dream.txt');
    expect(wrapper.text()).toContain('回收站 · 3 个文件');
  });
});

describe('memory easter eggs', () => {
  it('shows the memory dialog on row double-click', async () => {
    const wrapper = mountApp();
    await wrapper.find('.recycle-row').trigger('dblclick');
    const dialogs = useDialogsStore();
    expect(dialogs.dialogs.length).toBe(1);
    expect(dialogs.dialogs[0].title).toBe('unfinished_dream.txt');
    expect(dialogs.dialogs[0].duration).toBe(12000);
  });

  it('清空回收站 opens an auto-closing dialog', async () => {
    const wrapper = mountApp();
    const buttons = wrapper.findAll('button');
    const emptyBtn = buttons.find(b => b.text() === '清空回收站')!;
    await emptyBtn.trigger('click');
    const dialogs = useDialogsStore();
    expect(dialogs.dialogs.length).toBe(1);
    expect(dialogs.dialogs[0].duration).toBe(10000);
  });

  it('还原所有文件 opens an auto-closing dialog', async () => {
    const wrapper = mountApp();
    const restoreBtn = wrapper.findAll('button').find(b => b.text() === '还原所有文件')!;
    await restoreBtn.trigger('click');
    expect(useDialogsStore().dialogs.length).toBe(1);
  });
});

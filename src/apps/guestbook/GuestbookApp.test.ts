// GuestbookApp.test.ts — 留言板应用
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import GuestbookApp from './GuestbookApp.vue';
import { useDialogsStore } from '../../stores/dialogs';
import { useGuestbookStore } from '../../stores/guestbook';

function mountApp() {
  return mount(GuestbookApp, { global: { plugins: [createPinia()] } });
}

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

describe('rendering', () => {
  it('shows demo messages reversed and the count in statusbar', () => {
    const wrapper = mountApp();
    const names = wrapper.findAll('.gb-meta b').map(el => el.text());
    expect(names).toEqual(['路过的人', '访客A']);
    expect(wrapper.find('.window-statusbar').text()).toBe('留言板 · 2 条留言');
  });
});

describe('submit', () => {
  it('opens an error dialog when fields are empty', async () => {
    const wrapper = mountApp();
    await wrapper.find('.gb-form .xp-btn').trigger('click');
    const dialogs = useDialogsStore();
    expect(dialogs.dialogs.length).toBe(1);
    expect(dialogs.dialogs[0].text).toContain('请填写昵称。');
    expect(useGuestbookStore().messages.length).toBe(2);
  });

  it('adds a message on valid submit and persists it', async () => {
    const wrapper = mountApp();
    await wrapper.find('.gb-name').setValue('测试者');
    await wrapper.find('.gb-input').setValue('新留言');
    await wrapper.find('.gb-form .xp-btn').trigger('click');

    const store = useGuestbookStore();
    expect(store.messages.length).toBe(3);
    expect(store.messages[2].name).toBe('测试者');
    expect(JSON.parse(localStorage.getItem('somewhere-guestbook')!).length).toBe(3);
    // 昵称保留、留言清空（与旧行为一致）
    expect((wrapper.find('.gb-name').element as HTMLInputElement).value).toBe('测试者');
    expect((wrapper.find('.gb-input').element as HTMLInputElement).value).toBe('');
  });
});

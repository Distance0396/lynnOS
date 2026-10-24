// XpChrome.test.ts — XP 资源管理器骨架
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import XpChrome from './XpChrome.vue';

describe('XpChrome', () => {
  it('renders default menubar and toolbar with separators', () => {
    const wrapper = mount(XpChrome, {
      slots: { default: '<div class="content-test">内容</div>' },
    });
    expect(wrapper.find('.xp-menubar').text()).toContain('文件(F)');
    const toolbarButtons = wrapper.findAll('.xp-toolbar-btn');
    expect(toolbarButtons.length).toBe(5);
    expect(toolbarButtons[0].classes()).toContain('disabled');
    expect(wrapper.findAll('.xp-toolbar-sep').length).toBe(1);
    expect(wrapper.find('.xp-content .content-test').exists()).toBe(true);
  });

  it('renders address bar and static status text', () => {
    const wrapper = mount(XpChrome, {
      props: { address: '回收站', statusText: '回收站 · 3 个文件' },
      slots: { default: '' },
    });
    expect(wrapper.find('.xp-addressbar-input').element as HTMLInputElement).toBeTruthy();
    expect((wrapper.find('.xp-addressbar-input').element as HTMLInputElement).value).toBe('回收站');
    expect(wrapper.find('.window-statusbar').text()).toBe('回收站 · 3 个文件');
  });

  it('renders sidebar slot and keeps the 180px sidebar element', () => {
    const wrapper = mount(XpChrome, {
      slots: {
        sidebar: '<div class="sidebar-test">侧栏</div>',
        default: '',
      },
    });
    expect(wrapper.find('.xp-sidebar .sidebar-test').exists()).toBe(true);
  });

  it('renders dynamic statusbar slot over static text', () => {
    const wrapper = mount(XpChrome, {
      props: { statusText: '静态' },
      slots: { default: '', statusbar: '留言板 · 2 条留言' },
    });
    expect(wrapper.find('.window-statusbar').text()).toBe('留言板 · 2 条留言');
  });
});

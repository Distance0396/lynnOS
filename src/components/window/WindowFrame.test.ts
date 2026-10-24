// WindowFrame.test.ts — XP 窗口壳组件
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import WindowFrame from './WindowFrame.vue';
import type { WindowState } from '../../stores/windows';

function makeWin(overrides: Partial<WindowState> = {}): WindowState {
  return {
    id: 'win-1',
    appId: 'app',
    title: 'Test Window',
    icon: '📄',
    x: 100,
    y: 80,
    width: 600,
    height: 450,
    minWidth: 280,
    minHeight: 160,
    display: 'normal',
    z: 200,
    prevBounds: null,
    ...overrides,
  };
}

function mountFrame(win: WindowState = makeWin(), active = true) {
  return mount(WindowFrame, { props: { win, active } });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('rendering', () => {
  it('renders title text and 8 resize handles', () => {
    const wrapper = mountFrame();
    expect(wrapper.find('.title-bar-text').text()).toBe('Test Window');
    expect(wrapper.findAll('.resize-handle').length).toBe(8);
  });

  it('renders emoji icon as text and path icon as img', () => {
    expect(mountFrame().find('.title-bar-icon img').exists()).toBe(false);
    const wrapper = mountFrame(makeWin({ icon: 'assets/icons/xp/32/folder-music.png' }));
    expect(wrapper.find('.title-bar-icon img').attributes('src')).toBe('assets/icons/xp/16/folder-music.png');
  });

  it('applies normal bounds as inline style', () => {
    const style = mountFrame().attributes('style');
    expect(style).toContain('left: 100px');
    expect(style).toContain('top: 80px');
    expect(style).toContain('width: 600px');
    expect(style).toContain('z-index: 200');
  });

  it('fills the working area when maximized', () => {
    const style = mountFrame(makeWin({ display: 'maximized' })).attributes('style');
    expect(style).toContain('left: 0px');
    expect(style).toContain('width: 1024px'); // jsdom innerWidth
    expect(style).toContain('height: 728px'); // 768 - 40 taskbar
  });

  it('toggles inactive class and the maximized button label', () => {
    const wrapper = mountFrame(makeWin(), false);
    expect(wrapper.classes()).toContain('inactive');
    expect(wrapper.get('[aria-label="Maximize"]').attributes('title')).toBe('最大化');

    const maxed = mountFrame(makeWin({ display: 'maximized' }));
    expect(maxed.get('[aria-label="Restore"]').attributes('title')).toBe('还原');
  });
});

describe('control buttons', () => {
  it('emits minimize / toggle-maximize / close', async () => {
    const wrapper = mountFrame();
    await wrapper.get('[aria-label="Minimize"]').trigger('click');
    await wrapper.get('[aria-label="Maximize"]').trigger('click');
    expect(wrapper.emitted('minimize')).toHaveLength(1);
    expect(wrapper.emitted('toggle-maximize')).toHaveLength(1);
  });

  it('delays the close commit until the animation ends', async () => {
    const wrapper = mountFrame();
    await wrapper.get('[aria-label="Close"]').trigger('click');
    expect(wrapper.emitted('close')).toBeUndefined();
    expect(wrapper.classes()).toContain('closing');

    vi.advanceTimersByTime(130);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('ignores repeated close clicks during the animation', async () => {
    const wrapper = mountFrame();
    await wrapper.get('[aria-label="Close"]').trigger('click');
    await wrapper.get('[aria-label="Close"]').trigger('click');
    vi.advanceTimersByTime(130);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});

describe('activation', () => {
  it('emits activate on mousedown when inactive', async () => {
    const wrapper = mountFrame(makeWin(), false);
    await wrapper.trigger('mousedown');
    expect(wrapper.emitted('activate')).toHaveLength(1);
  });

  it('does not emit activate when already active', async () => {
    const wrapper = mountFrame();
    await wrapper.trigger('mousedown');
    expect(wrapper.emitted('activate')).toBeUndefined();
  });
});

describe('drag commit', () => {
  it('commits clamped position on mouseup', async () => {
    const wrapper = mountFrame();
    await wrapper.find('.title-bar').trigger('mousedown', { clientX: 100, clientY: 100 });
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 160, clientY: 60 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    // dx=60, dy=-40 → (160, 40)
    expect(wrapper.emitted('commit-bounds')).toEqual([[{ x: 160, y: 40 }]]);
  });

  it('does not start drag on maximized windows', async () => {
    const wrapper = mountFrame(makeWin({ display: 'maximized' }));
    await wrapper.find('.title-bar').trigger('mousedown', { clientX: 100, clientY: 100 });
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(wrapper.emitted('commit-bounds')).toBeUndefined();
  });
});

describe('resize commit', () => {
  it('commits resized bounds from the east handle', async () => {
    const wrapper = mountFrame();
    await wrapper.find('.resize-e').trigger('mousedown', { clientX: 100, clientY: 100 });
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 180, clientY: 100 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(wrapper.emitted('commit-bounds')).toEqual([[{ x: 100, y: 80, width: 680, height: 450 }]]);
  });

  it('does not start resize on maximized windows', async () => {
    const wrapper = mountFrame(makeWin({ display: 'maximized' }));
    await wrapper.find('.resize-e').trigger('mousedown', { clientX: 100, clientY: 100 });
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 100 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(wrapper.emitted('commit-bounds')).toBeUndefined();
  });
});

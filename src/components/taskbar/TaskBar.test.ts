// TaskBar.test.ts — 任务栏壳
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TaskBar from './TaskBar.vue';
import { useWindowsStore } from '../../stores/windows';

beforeEach(() => {
  setActivePinia(createPinia());
});

function mountBar() {
  const wrapper = mount(TaskBar, { props: { menuOpen: false } });
  return { wrapper, store: useWindowsStore() };
}

describe('task buttons', () => {
  it('renders one task button per window', async () => {
    const { wrapper, store } = mountBar();
    store.open({ id: 'a', title: 'A' });
    store.open({ id: 'b', title: 'B' });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.task-btn').length).toBe(2);
  });

  it('marks the active window button', async () => {
    const { wrapper, store } = mountBar();
    store.open({ id: 'a', title: 'A' });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.task-btn').classes()).toContain('active');
  });

  it('minimizes the active window when its task button is clicked', async () => {
    const { wrapper, store } = mountBar();
    const win = store.open({ id: 'a', title: 'A' });
    await wrapper.vm.$nextTick();
    await wrapper.find('.task-btn').trigger('click');
    expect(win.display).toBe('minimized');
  });
});

describe('start button', () => {
  it('emits toggle-start and reflects menuOpen state', async () => {
    const wrapper = mount(TaskBar, { props: { menuOpen: true } });
    expect(wrapper.find('#start-btn').classes()).toContain('active');
    await wrapper.find('#start-btn').trigger('click');
    expect(wrapper.emitted('toggle-start')).toHaveLength(1);
  });
});

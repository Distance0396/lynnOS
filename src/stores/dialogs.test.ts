// dialogs.test.ts — 系统对话框 store
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useDialogsStore } from './dialogs';

beforeEach(() => {
  setActivePinia(createPinia());
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('show / close', () => {
  it('pushes a dialog with an id and plays no error in jsdom', () => {
    const store = useDialogsStore();
    const id = store.show({ text: 'hello' });
    expect(store.dialogs.length).toBe(1);
    expect(store.dialogs[0].id).toBe(id);
    expect(store.dialogs[0].title).toBeUndefined();
  });

  it('close removes only the target dialog', () => {
    const store = useDialogsStore();
    const a = store.show({ text: 'a' });
    store.show({ text: 'b' });
    store.close(a);
    expect(store.dialogs.map(d => d.text)).toEqual(['b']);
  });
});

describe('duration', () => {
  it('auto-closes after the given duration', () => {
    const store = useDialogsStore();
    store.show({ text: 'temp', duration: 12000 });
    expect(store.dialogs.length).toBe(1);
    vi.advanceTimersByTime(12000);
    expect(store.dialogs.length).toBe(0);
  });

  it('close cancels the pending auto-close timer', () => {
    const store = useDialogsStore();
    const id = store.show({ text: 'temp', duration: 12000 });
    store.close(id);
    vi.advanceTimersByTime(12000);
    expect(store.dialogs.length).toBe(0);
  });
});

describe('closeTop', () => {
  it('closes the last dialog and reports handled', () => {
    const store = useDialogsStore();
    store.show({ text: 'a' });
    store.show({ text: 'b' });
    expect(store.closeTop()).toBe(true);
    expect(store.dialogs.map(d => d.text)).toEqual(['a']);
  });

  it('returns false when no dialog is open', () => {
    expect(useDialogsStore().closeTop()).toBe(false);
  });
});

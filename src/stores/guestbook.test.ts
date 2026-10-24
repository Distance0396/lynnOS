// guestbook.test.ts — 留言 store 与表单校验
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { STORAGE_KEYS } from '../constants';
import { useGuestbookStore } from './guestbook';
import { useGuestbookForm } from '../apps/guestbook/useGuestbookForm';

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

describe('guestbook store', () => {
  it('seeds demo messages when storage is empty', () => {
    const store = useGuestbookStore();
    expect(store.messages.length).toBe(2);
    expect(store.persist).toBe(true);
  });

  it('restores saved messages', () => {
    localStorage.setItem(STORAGE_KEYS.guestbook, JSON.stringify([{ name: '某人', text: '你好', date: '2026-01-01' }]));
    setActivePinia(createPinia());
    const store = useGuestbookStore();
    expect(store.messages).toEqual([{ name: '某人', text: '你好', date: '2026-01-01' }]);
  });

  it('add stamps today\'s date and persists', () => {
    const store = useGuestbookStore();
    expect(store.add({ name: '路人', text: '测试' })).toBe(true);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.guestbook)!);
    expect(saved.length).toBe(3);
    expect(saved[2].name).toBe('路人');
    expect(saved[2].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('enters read-only mode on corrupt storage and stops persisting', () => {
    localStorage.setItem(STORAGE_KEYS.guestbook, '{not json');
    setActivePinia(createPinia());
    const store = useGuestbookStore();
    expect(store.persist).toBe(false);
    expect(store.add({ name: '路人', text: '测试' })).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.guestbook)).toBe('{not json');
  });
});

describe('useGuestbookForm', () => {
  it('rejects empty fields with problem list', () => {
    const form = useGuestbookForm();
    expect(form.submit()).toEqual(['请填写昵称。', '请填写留言内容。']);
  });

  it('rejects overlong name and text', () => {
    const form = useGuestbookForm();
    form.name.value = 'a'.repeat(21);
    form.text.value = 'b'.repeat(201);
    expect(form.submit()).toEqual(['昵称不能超过 20 个字符。', '留言不能超过 200 个字符。']);
  });

  it('returns the draft on success and clears text but keeps name', () => {
    const form = useGuestbookForm();
    form.name.value = '  路人  ';
    form.text.value = '  留言内容  ';
    const result = form.submit();
    expect(result).toEqual({ name: '路人', text: '留言内容' });
    expect(form.text.value).toBe('');
    expect(form.name.value).toBe('  路人  ');
  });
});

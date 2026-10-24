// 留言表单状态与校验（规则对照旧 guestbook.ts：昵称 ≤20，留言 ≤200）
import { ref } from 'vue';

export interface GuestbookDraft {
  name: string;
  text: string;
}

export function useGuestbookForm() {
  const name = ref('');
  const text = ref('');

  // 校验通过返回 draft 并清空留言（昵称保留，与旧行为一致）；否则返回问题列表
  function submit(): GuestbookDraft | string[] {
    const trimmedName = name.value.trim();
    const trimmedText = text.value.trim();
    const problems: string[] = [];
    if (!trimmedName) problems.push('请填写昵称。');
    else if (trimmedName.length > 20) problems.push('昵称不能超过 20 个字符。');
    if (!trimmedText) problems.push('请填写留言内容。');
    else if (trimmedText.length > 200) problems.push('留言不能超过 200 个字符。');
    if (problems.length > 0) return problems;

    const draft: GuestbookDraft = { name: trimmedName, text: trimmedText };
    text.value = '';
    return draft;
  }

  return { name, text, submit };
}

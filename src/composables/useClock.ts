// 任务栏时钟：每 15s 刷新（保持旧版行为，分钟最多慢 15s）
import { onScopeDispose, ref } from 'vue';

function format(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function useClock() {
  const time = ref(format(new Date()));
  const timer = setInterval(() => {
    time.value = format(new Date());
  }, 15000);
  onScopeDispose(() => clearInterval(timer));
  return { time };
}

// 视口尺寸与窄屏判断（模块级单例：全应用共享一份 resize 监听）
import { ref } from 'vue';
import { NARROW_BREAKPOINT } from '../constants';

const viewportWidth = ref(window.innerWidth);
const viewportHeight = ref(window.innerHeight);
const narrow = ref(window.innerWidth <= NARROW_BREAKPOINT);

window.addEventListener('resize', () => {
  viewportWidth.value = window.innerWidth;
  viewportHeight.value = window.innerHeight;
  narrow.value = window.innerWidth <= NARROW_BREAKPOINT;
});

export function useViewport() {
  return { viewportWidth, viewportHeight, narrow };
}

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        // legacy: 旧版 vanilla 入口（V5 阶段删除）
        main: 'index.html',
        legacy: 'legacy.html',
      },
    },
  },
});

import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import globals from 'globals';

export default defineConfigWithVueTs(
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },
  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
      // 遗留 vanilla 代码（V5 删除）以 @ts-nocheck 跳过类型检查
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-nocheck': false }],
      // 遗留 vanilla 代码大量使用 any；新 Vue 代码约定避免 any
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);

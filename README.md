# Somewhere.exe

一个 Windows XP 风格的桌面模拟式个人主页：开机动画 → Bliss 桌面 → 窗口化应用，叠加克制的 Dreamcore 梦核氛围（胶片颗粒、暗角）。视觉基准为 Windows XP Luna 经典蓝色主题，设计标准见 `skills/windows-xp-ui/SKILL.md`。

## 技术栈

- Vue 3（SFC + `<script setup>`）+ Pinia + TypeScript
- Vite 6 构建，Vitest + jsdom + @vue/test-utils 测试
- 零 UI 框架依赖的 XP 主题 CSS（`src/styles/`）

## 开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vue-tsc 类型检查 + vite 构建
npm test         # vitest
npm run lint     # eslint
```

子路径部署（如 GitHub Pages）：`BASE_PATH=/lynnOS/ npm run build`。

## 应用

| 应用 | 说明 |
|------|------|
| 关于我 | 个人介绍（静态页） |
| 留言板 | 本地持久化留言（localStorage，不上传） |
| 我的电脑 | XP 风格资源管理器入口 |
| 回收站 | 记忆彩蛋 |

## 结构

```
src/
├── App.vue              # 桌面壳（容器组件）
├── stores/              # windows / settings / dialogs / guestbook（action 唯一修改点）
├── composables/         # useWindowDrag / useWindowResize / useBoot / useSound / useClock 等
├── components/          # desktop / window / taskbar / common（展示组件，禁止访问 store）
├── apps/                # 注册表 + 4 个应用（每应用一个目录，App.vue + 就近 composable）
├── utils/geometry.ts    # 拖拽/缩放纯函数
├── constants/
└── styles/              # XP 主题 CSS（全局引入，零改动复用）
```

工程约定：严格数据单向流（state → computed → props 向下，事件向上 → store action）；页面级逻辑封装 composables；注释只写「为什么」，每文件至多一行职责说明。

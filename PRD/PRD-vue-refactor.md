# lynnOS Vue 重构 PRD

| 字段 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 日期 | 2026-10-25 |
| 适用范围 | lynnOS 前端代码库（`D:\code\lynnOS`） |
| 决策性质 | **推翻先前约束的重大架构决策**：引入 Vue 3，替代 PRD-refactor.md「不更换 UI 框架」非目标与 PRD-engineering-hygiene.md 的 `el()` 自研工具层方案 |
| 取代关系 | 取代 PRD-engineering-hygiene.md 的 H2~H5；其 H1（仓库卫生）并入本 PRD V1 阶段 |
| 执行前置 | 开始任何 UI 改造前，必须先阅读 `skills/windows-xp-ui/SKILL.md`（项目最高优先级 UI 规则） |

---

## 1. 背景与决策

### 1.1 决策变更说明

先前的两份 PRD 均将「不引入框架」列为非目标，理由是重写风险大于收益。经重新评估，现推翻该约束，依据如下：

| 依据 | 说明 |
|------|------|
| 双轨渲染问题的根源 | 现有 pub/sub + 手动 `renderAll` 混用导致的重复渲染、漏渲染风险，本质是**手写状态→DOM 同步**的固有缺陷，`el()` 只治书写可读性、不治此病；Vue 响应式从模型上消除这类问题 |
| innerHTML 不可读 | 13 个应用全部以字符串拼接构建 UI，已由工程卫生审查确认；Vue 模板从根源替代该写法 |
| 状态联动需求增长预期 | 后续若出现跨窗口共享状态（如全局播放器），响应式 + 单向流的架构收益将快速放大 |
| 成本可接受 | 项目约 2600 行，可在独立分支分阶段完成；视觉零回归通过双入口 A/B 截图对比保障 |

**同时接受的代价**：运行时体积增加约 34KB gzip；现有渲染层代码全部重写。

### 1.2 目标

- 以 Vue 3 SFC 重写整个渲染层，行为与视觉零回归
- **严格数据单向流**：状态只经 store action 修改，视图只经 props 接收数据、经 emit 上报事件
- **页面级逻辑全部收敛到 composables（hooks）**，SFC 保持薄壳
- 工程化补全：ESLint、`vue-tsc` 类型检查、组件测试、统一目录规范
- 注释简洁不冗余（见 2.6）

### 1.3 非目标

- 不改动任何用户可见交互行为与视觉（可访问性增强除外，且仅限 V5 明确列出的项）
- 不引入服务端渲染 / SSR、Nuxt
- 不使用 JSX / render function（见 2.1 术语约定）
- 不新增用户功能；不做移动端适配
- 不修 P2 遗留缺陷清单中与渲染无关的项（如时钟 15 秒偏差）；但**因响应式重写而自然消失的缺陷**（双重渲染、播放器 500ms 全量重建）无需刻意复刻

---

## 2. 技术方案

### 2.1 术语约定

| 术语 | 本 PRD 中的定义 |
|------|----------------|
| Vue 传统写法 | SFC 单文件组件 + `<template>` 模板语法；区别于 `h()`/JSX 渲染函数写法 |
| hooks / composables | Vue 3 Composition API 的 `useXxx()` 可组合函数，与 SFC 同目录就近放置 |

组件统一使用 `<script setup lang="ts">`；**逻辑一律在 composables 中，SFC 内只做装配**（`ref`/`computed` 引入、事件转发），SFC 的 `<script setup>` 超过约 30 行视为未拆干净。

### 2.2 技术栈与依赖变更

| 类别 | 新增 | 用途 |
|------|------|------|
| 运行时 | `vue`、`pinia` | 视图层与全局状态 |
| 构建 | `@vitejs/plugin-vue`、`vue-tsc` | SFC 编译；`build` 脚本改为 `vue-tsc --noEmit && vite build` |
| 测试 | `@vue/test-utils` | 组件挂载测试（vitest/jsdom 沿用） |
| 规范 | `eslint`、`eslint-plugin-vue`、`@vue/eslint-config-typescript` | 新增 `lint` 脚本，强制 `vue/no-mutating-props` 等 |

同时移除：`xp.css`（已确认全库无引用，样式全部来自自带 `xp-theme.css`）。

### 2.3 目标目录结构

```
src/
├── main.ts                      # createApp + pinia + 全局样式（XP CSS 原样保留）
├── App.vue                      # 桌面根：壁纸层 / 图标区 / 窗口层 / 任务栏 / 开始菜单 / 浮层
├── stores/                      # 全局状态（唯一可变全局数据源）
│   ├── windows.ts               # 窗口集合、z 序、激活、开/关/最小化/最大化、单例
│   ├── settings.ts              # 壁纸/声音/动画/图标可见性 + localStorage 持久化
│   └── guestbook.ts             # 留言数据 + 持久化
├── composables/
│   ├── useWindowDrag.ts         # 拖拽（clamp 纯函数抽至 utils/geometry.ts 供测试）
│   ├── useWindowResize.ts       # 八方向缩放
│   ├── useViewport.ts           # ≤768px 窄屏判断
│   ├── useSound.ts              # WebAudio 音效（自 atmosphere.ts 拆出）
│   ├── useClock.ts              # 任务栏时钟 + 时钟面板
│   ├── useBoot.ts               # 开机流程状态机
│   ├── useEscapeStack.ts        # Esc 逐层关闭浮层（开始菜单/对话框/时钟面板）
│   └── useLocalStorage.ts       # 受 localStorage 异常保护的读写
├── components/
│   ├── desktop/                 # DesktopIcon / WallpaperLayer / BootOverlay / SleepOverlay
│   ├── window/                  # WindowLayer / WindowFrame（标题栏、控制按钮、resize 手柄）
│   ├── taskbar/                 # Taskbar / TaskButton / StartMenu / SystemTray
│   └── common/                  # XpChrome（菜单栏/工具栏/地址栏/侧栏/状态栏）、SystemDialog
├── apps/                        # 每应用一个目录：App.vue + 就近 composable
│   ├── registry.ts              # id → { component, title, icon, width?, height? }（纯数据）
│   ├── music-collection/        # MusicCollectionApp.vue + usePlayer.ts
│   ├── guestbook/               # GuestbookApp.vue + useGuestbookForm.ts
│   ├── article-archive/         # ArticleArchiveApp.vue + useArticleFilter.ts
│   ├── photo-memory/            # PhotoMemoryApp.vue + usePhotoViewer.ts
│   └── welcome/ tech-notes/ about-me/ my-blog/ my-computer/ recycle-bin/ settings/
├── utils/geometry.ts            # 拖拽/缩放 clamp 纯函数
├── data/                        # articles / photos / tracks（纯数据，原样不动）
├── constants/
└── styles/                      # XP 主题 CSS 全部原样保留，main.ts 全局引入
```

### 2.4 数据单向流规范（硬约束）

```
用户事件 → 组件 emit / composable 暴露的 action → store action → state 变更
   ↑                                                        ↓
   └────── props（只读） ←── computed/getter ←───────────────┘
```

| 规则 | 强制手段 |
|------|----------|
| 全局状态只存于 Pinia store；**修改只能发生在 store action 内部** | 评审 checklist；组件中禁止出现 `store.state.xxx = ` 式直接赋值 |
| 父子通信只走 props 向下、emit 向上；禁止父组件持有子组件 ref 直接改其内部状态 | ESLint `vue/no-mutating-props` + 评审 |
| 通用展示组件（`components/common`、`components/window`）**禁止 import store**，数据一律来自 props | 评审 checklist |
| 派生数据一律 `computed` / getter，禁止把 state 复制到本地再手动同步 | 评审 checklist |
| 组件本地 UI 态（输入框草稿、拖拽中的临时坐标）允许用 `ref`，但提交时机必须明确（如 mouseup 时 commit 进 store） | 评审 checklist |
| 副作用（定时器、document 级监听、localStorage）只存在于 composables，且必须在 `onUnmounted`/`onScopeDispose` 清理 | 评审 checklist |

分层说明：`apps/*` 的应用组件视为**容器组件**，允许访问 store 与自身 composables；其下的一切子组件是展示组件。

### 2.5 旧代码 → 新结构映射

| 旧实现 | 去向 |
|--------|------|
| `core/state.ts`（pub/sub + 手动 renderAll） | `stores/windows.ts` + `stores/settings.ts`（响应式替代发布订阅） |
| `core/window-manager.ts`（构建 DOM + 拖拽缩放 + renderAll） | `WindowFrame.vue` + `useWindowDrag`/`useWindowResize` + windows store actions |
| `core/desktop.ts` / `core/taskbar.ts` | `App.vue` + `components/desktop`、`components/taskbar` |
| `core/atmosphere.ts`（408 行大杂烩） | `useSound` / `useClock` / `SystemDialog.vue` / `SleepOverlay.vue` / settings store 持久化；`RECYCLE_MEMORIES` 归入 `apps/recycle-bin/` |
| `core/boot.ts` | `useBoot.ts` + `BootOverlay.vue` |
| `apps/chrome.ts`（XP 窗口骨架） | `components/common/XpChrome.vue`（slots：sidebar / content / statusbar） |
| `apps/registry.ts` + 13 个应用文件 | `apps/registry.ts`（纯数据映射）+ 每应用目录 |
| `data/`、`constants/`、`styles/` | 原样保留 |

**与 XP 主题的兼容策略**：全部 CSS 文件零改动；组件模板必须逐字保留 `xp-theme.css`/`windows.css` 所依赖的 class 名与 DOM 层级（`window` / `title-bar` / `title-bar-text` / `xp-menubar` 等）。Vue 只改变「DOM 由谁生成」，不改变「生成什么」。

### 2.6 注释规范（简洁不冗余）

- 文件顶部**最多一行**职责说明，可省略（目录与文件名已自解释时）
- 注释只写「为什么 / 约束 / 陷阱」，不复述代码行为
- 删除现有 `/* ===== xxx ===== */` 分隔横幅风格；禁止注释掉的代码、日志式注释
- 复杂算法（如八方向缩放的坐标推导）保留一段说明性注释

### 2.7 迁移策略：双入口 A/B

- 在分支 `feat/vue-refactor` 上开发，`main` 保持旧版可运行
- 开发期 Vite 双入口：`index.html`（新版 Vue）与 `legacy.html`（旧版 vanilla），用于逐屏截图 A/B 对比
- **每个应用迁移完成后立即与旧版截图对比**（真实浏览器，遵守 CLAUDE.md 规则 9），确认一致后进入下一个
- 合并前删除 `legacy.html` 及全部旧渲染代码（`core/`、旧 `apps/*.ts`、`dom.ts` 若已存在）

---

## 3. 阶段划分

| 阶段 | 名称 | 核心交付物 | 依赖 |
|------|------|-----------|------|
| V1 | 基建与卫生 | 依赖安装与脚本（`lint`/`vue-tsc`）；tsconfig 纳入 `.vue`；ESLint 配置；目录骨架；双入口跑通空 Vue 应用；**吸收原 H1**：`.gitattributes`+renormalize（单独 commit）、删除根目录 `assets/`、删除 `iconPositions`、`vite.config.ts` 增加 `base: process.env.BASE_PATH ?? '/'`、移除 `xp.css` 死依赖 | 无 |
| V2 | 状态层与窗口系统 | `stores/windows.ts`（开/关/最小化/最大化/激活/z 序/单例）+ 单测；`stores/settings.ts` + 持久化；`WindowFrame.vue`（XP 窗口壳、控制按钮、8 向 resize 手柄）；`useWindowDrag`/`useWindowResize`/`useViewport`/`utils/geometry.ts` + 纯函数单测 | V1 |
| V3 | 桌面壳 | `App.vue`（壁纸/胶片颗粒/暗角层）；`BootOverlay.vue`+`useBoot`；桌面图标区；`Taskbar`/`TaskButton`/`StartMenu`/`SystemTray`+`useClock`；`SystemDialog.vue`/`ClockPanel.vue`/`SleepOverlay.vue`；`useSound`；`useEscapeStack`。至此新壳可在 `index.html` 完整运行（应用先以占位内容渲染） | V2 |
| V4 | 应用迁移（一应用一 commit） | `XpChrome.vue`；按依赖顺序迁移 13 个应用：welcome → article-archive → my-blog → tech-notes → about-me → guestbook（store+表单校验）→ photo-memory（`usePhotoViewer`）→ music-collection（`usePlayer`，样板先行评审）→ my-computer → recycle-bin → settings；静态应用不强制建 composable | V3 |
| V5 | 收尾与验收 | 删除 `legacy.html` 与旧渲染代码（`core/`、旧 `apps/*.ts`）；基础可访问性（图标/菜单 button 语义、Enter/Space/Esc，吸收原 H3）；全量测试、lint 清零、构建产物检查；截图回归报告；更新 CLAUDE.md 技术栈描述与 README | V4 |

实施顺序严格串行：V1 → V2 → V3 → V4 → V5；V4 内每应用独立 commit，截图对比通过才允许进入下一个。

---

## 4. 验收标准

- [ ] **视觉零回归**：13 个应用 + 开机流程 + 桌面/任务栏/开始菜单/对话框，新旧截图逐屏对比一致（报告附于合并 PR）
- [ ] **单向流检查清单全过**：无组件直接写 store state；无 props mutation（lint 强制）；通用展示组件零 store import（grep `components/` 下 `useWindowsStore\|useSettingsStore` 应为 0 命中）
- [ ] `npm run lint`、`npm run build`（含 `vue-tsc`）全绿
- [ ] 测试全绿且覆盖：windows/settings/guestbook store、geometry 纯函数、useBoot 状态机、usePlayer、`WindowFrame`/`StartMenu` 挂载测试
- [ ] 全库 `grep -rn "innerHTML" src/` 仅允许出现在 `data/` 的文章内容字段（受控数据）
- [ ] SFC 无超重逻辑壳（`<script setup>` ≤30 行，超出的必须下沉 composable）
- [ ] 键盘走查：Tab 聚焦图标 → Enter 打开 → Esc 逐层关闭浮层
- [ ] `legacy.html` 与旧代码已删除；`xp.css` 已移除；`.gitattributes` 生效（`git ls-files --eol` 无 mixed）

---

## 5. 风险与对策

| 风险 | 对策 |
|------|------|
| XP 主题 CSS 依赖特定 class/层级，Vue 模板重构时结构走样 | 2.7 兼容策略：class 名与层级逐字保留；每应用迁移后立即截图 A/B |
| 拖拽/缩放高频更新若直接写 store 造成性能问题或单向流争议 | 拖拽过程坐标走组件内 `ref`（本地 UI 态），`mouseup` 时一次性 commit 进 store（2.4 规则第 5 条） |
| 全量重写中途不可运行、难以回归 | 双入口 A/B + 阶段串行 + V3 起新壳即可运行；`main` 分支始终保持可用旧版 |
| 响应式重写「顺手」改变行为（如播放器 500ms 重建消失） | 1.3 明确：自然消失的缺陷不复刻；其余行为逐项对照截图与手测 |
| 定时器/监听器在组件卸载后泄漏 | 2.4 第 6 条：副作用强制收敛 composables 并清理；`usePlayer` 等纳入单测（卸载后 interval 停止） |
| jsdom 无法覆盖拖拽等真实交互 | clamp 几何抽纯函数测数学；交互靠截图 A/B 与键盘走查人工验证 |
| 体积增加 34KB gzip | 已在 1.1 接受；V5 检查构建产物并在 README 记录基线 |

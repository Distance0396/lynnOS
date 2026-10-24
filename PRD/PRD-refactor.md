# lynnOS 代码库工程化重构 PRD

| 字段 | 内容 |
|------|------|
| 文档版本 | v1.1 |
| 适用范围 | lynnOS 前端代码库（`d:\code\lynnOS`） |
| 目标用户 | 维护该项目的开发者 |
| 文档性质 | 工程化重构需求规格 |

---

## 1. 背景与目标

### 1.1 现状问题

当前 lynnOS 是一个纯原生 HTML/CSS/JS 实现的 Windows XP 桌面模拟器，功能完整、视觉还原度高，但在工程化和可维护性上存在以下可观测的问题：

| 问题 | 证据 | 影响 |
|------|------|------|
| 单文件过大 | `js/apps.js` 约 65 KB，包含 11 个应用定义、3 类数据、通用工具函数 | 定位代码困难，合并冲突频发 |
| 文案不可读 | `apps.js` 中所有中文以 `\uXXXX` Unicode 转义形式存在 | 文案审查与修改无法直接进行 |
| 全量重绘 | `WindowManager.renderAll()` 每次状态变化清空并重建所有窗口 DOM | 应用内部状态（播放器进度、滚动位置、输入内容）丢失；窗口越多性能越差 |
| 隐式模块依赖 | 8 个 JS 文件通过 `<script>` 顺序加载，依赖全局变量通信 | 加载顺序错误即运行失败，无法静态分析依赖 |
| 数据与视图耦合 | 文章、照片、音乐数据硬编码在 `apps.js` 内 | 数据变更需改动应用代码，无法独立管理 |
| 裸全局状态 | `DesktopState.state` 为可直接修改的对象，无变更通知 | 修改后需手动调用渲染，易遗漏 |
| 无类型约束 | 纯 JS，函数参数与返回值无类型声明 | IDE 无法提供可靠补全，重构易引入类型错误 |

### 1.2 目标

本次重构不改变任何用户可见的产品行为（开机动画、窗口交互、应用功能、视觉样式全部保持一致），仅改善代码库的工程质量。可观测的完成标志：

- 开发者可在独立文件中定位单个应用的全部代码
- 中文文案可在源码中直接阅读和编辑
- 切换窗口、最小化/最大化时，应用内部状态不丢失
- 模块间依赖通过 `import` 显式声明，可被静态分析
- 数据与渲染逻辑分离，数据可独立维护
- 核心对象与函数具备类型声明

### 1.3 非目标

- 不新增用户功能
- 不修改视觉样式与交互行为
- 不更换 UI 框架（仍为原生 DOM 操作）
- 不引入后端服务

---

## 2. 范围

### 2.1 P0（必须完成）

按以下顺序实施，每步独立可交付、可验证：

| 阶段 | 名称 | 核心交付物 |
|------|------|-----------|
| S1 | 代码模块化拆分 | `apps.js` 拆分为多文件；Unicode 转义还原为中文字面量 |
| S2 | 增量渲染改造 | `renderAll` 改为按需更新 DOM，保留应用内部状态 |
| S3 | ES Modules + Vite + CSS 迁移 | 引入 ES Module 语法、Vite 构建流程；CSS 迁移至 `src/styles` 并通过 import 引入 |
| S4 | 状态管理 + 数据抽离 | 引入状态变更通知；数据文件独立于应用代码 |
| S5 | TypeScript 迁移（渐进式） | 核心类型定义，逐步覆盖，允许部分文件暂留 JS |
| S6 | 单元测试 | 核心逻辑（窗口拖拽、缩放、状态流转、状态仓库）补充单元测试 |

### 2.2 P1（可选增强）

- 引入 ESLint + Prettier 代码规范
- `xp-theme.css`（250 KB）按需裁剪
- 键盘导航补全（Tab 切换窗口等）

### 2.3 范围外

- 后端服务化
- 多用户 / 权限系统
- 真实媒体资源（照片、音频）接入
- 移动端适配

---

## 3. 产品模型（重构后代码库结构）

### 3.1 目录结构

```
lynnOS/
├── src/
│   ├── main.ts               # 启动入口
│   ├── state/
│   │   └── store.ts          # 状态管理（发布订阅）
│   ├── core/
│   │   ├── window-manager.ts # 窗口渲染与交互
│   │   ├── desktop.ts        # 桌面图标
│   │   ├── taskbar.ts        # 任务栏/开始菜单/时钟
│   │   ├── atmosphere.ts     # 壁纸/音效/设置/弹窗
│   │   └── boot.ts           # 开机动画
│   ├── apps/
│   │   ├── registry.ts       # 应用注册中心
│   │   ├── chrome.ts         # XP chrome 通用构建器
│   │   ├── welcome.ts
│   │   ├── article-archive.ts
│   │   ├── article-reader.ts
│   │   ├── photo-memory.ts
│   │   ├── photo-viewer.ts
│   │   ├── music-collection.ts
│   │   ├── tech-notes.ts
│   │   ├── about-me.ts
│   │   ├── guestbook.ts
│   │   ├── my-computer.ts
│   │   ├── recycle-bin.ts
│   │   └── settings.ts
│   ├── data/
│   │   ├── articles.ts       # 文章数据
│   │   ├── photos.ts         # 照片数据
│   │   └── tracks.ts         # 音乐数据
│   ├── types/
│   │   └── index.ts          # AppDef / WindowState / Article 等类型
│   ├── styles/               # 原 css/ 迁移至此
│   │   ├── xp-theme.css
│   │   ├── variables.css
│   │   ├── desktop.css
│   │   ├── taskbar.css
│   │   ├── windows.css
│   │   ├── animations.css
│   │   ├── atmosphere.css
│   │   └── boot.css
│   ├── constants/
│   │   └── index.ts          # 动画时长、尺寸、z-index 等常量
│   └── assets/               # 原 assets/ 迁移至此（icons/fonts/audio/bliss.png/start.png）
├── tests/                    # 单元测试
│   ├── window-manager.test.ts
│   ├── store.test.ts
│   └── boot.test.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### 3.2 核心对象模型

| 对象 | 定义 | 关键字段 |
|------|------|---------|
| `AppDef` | 应用注册定义 | `id`, `title`, `icon`, `width`, `height`, `renderContent(body)` |
| `WindowState` | 窗口运行时状态 | `id`, `appId`, `x`, `y`, `width`, `height`, `state` (normal/maximized/minimized), `z`, `prevBounds` |
| `Article` | 文章数据 | `id`, `title`, `date`, `category`, `tags`, `content` |
| `Photo` | 照片数据 | `id`, `title`, `date`, `category`, `mood`, `gradient`, `desc` |
| `Track` | 音乐数据 | `id`, `title`, `artist`, `album`, `duration`, `gradient` |

---

## 4. 功能需求

### FR-S1：代码模块化拆分

**目的**：消除单文件过大问题，使每个应用可独立阅读与修改。

**触发**：开发者需要查看或修改某个应用的代码。

**处理规则**：

1. `apps.js` 按以下维度拆分：
   - 通用工具（`createXPChrome`、`createSidebarSection`）→ `apps/chrome.ts`
   - 应用注册中心（`register`、`openApp`、`REGISTRY`）→ `apps/registry.ts`
   - 每个应用一个独立文件（`welcome.ts`、`article-archive.ts` 等）
   - 数据（`ARTICLES`、`PHOTOS`、`TRACKS`）→ `data/` 目录独立文件

2. Unicode 转义还原：
   - 所有 `\uXXXX` 形式的中文转义还原为 UTF-8 中文字面量
   - 文件统一保存为 UTF-8 无 BOM
   - 还原后通过 `git diff` 确认仅编码形式变化，文案内容不变

3. 依赖方向：应用文件 `import` 数据文件与 `chrome.ts`；`registry.ts` `import` 各应用文件。禁止循环依赖。

**结果与状态变更**：
- 单个应用代码可在对应文件中完整找到
- 中文文案可直接搜索与编辑
- 构建后行为与重构前完全一致

**异常处理**：
- 若某个应用拆分后出现循环依赖，将共享逻辑下沉到 `chrome.ts` 或新建 `apps/_shared.ts`
- 若 Unicode 还原工具不可用，使用编辑器批量替换或脚本处理，逐文件校验文案不变

---

### FR-S2：增量渲染改造

**目的**：解决窗口状态变化时应用内部状态丢失与全量重绘的性能问题。

**触发**：任何窗口状态变更（打开、关闭、激活、最小化、最大化、拖拽、缩放）。

**处理规则**：

1. **窗口 DOM 持久化**：窗口首次打开时创建 DOM 元素并缓存到 `WindowState.el`，后续状态变化只更新该元素的属性（`style.left/top/width/height/zIndex`、`className`），不重建。

2. **激活态更新**：窗口激活时仅更新新旧两个窗口的 `class`（`active`/`inactive`）与 `zIndex`，不触碰其他窗口 DOM。

3. **最小化/最大化**：通过切换 `class` 控制显示隐藏，最大化时仅更新尺寸与位置，保留窗口内容 DOM。

4. **关闭**：移除该窗口的 DOM 元素并清理其 `_cleanup` 回调，不影响其他窗口。

5. **拖拽与缩放**：直接操作缓存 DOM 的 `style`，不触发全量渲染。

**结果与状态变更**：
- 切换窗口时，音乐播放器进度、文章滚动位置、输入框内容保持不变
- 打开第 N 个窗口的耗时与已打开窗口数无关（原为 O(N) 重建）

**异常处理**：
- 若某窗口 DOM 缓存丢失（如被外部脚本移除），回退到重建该窗口内容
- 拖拽过程中若窗口被关闭，`mousemove` 监听需正确解绑

---

### FR-S3：ES Modules + Vite + CSS 迁移

**目的**：建立显式模块依赖、可维护的构建流程，并完成样式体系迁移。

**触发**：开发者运行 `npm install` 后启动开发服务器。

**处理规则**：

1. **模块语法**：所有 JS 文件改为 ES Module（`import` / `export`），移除 IIFE 全局变量模式。`index.html` 中脚本标签改为 `<script type="module" src="/src/main.ts">`。

2. **构建工具**：引入 Vite，配置：
   - 开发服务器 `npm run dev`
   - 生产构建 `npm run build`，产出 `dist/`
   - 预览 `npm run preview`
   - **部署方式已确认**：统一通过 Vite 构建产物部署，不再支持直接双击 `index.html` 打开

3. **依赖声明**：模块间通过 `import` 显式引用，禁止通过 `window` 全局变量通信。原有全局对象（`DesktopState`、`WindowManager` 等）改为具名导出。

4. **CSS 迁移**（Q3 已确认）：
   - 原 `css/` 目录迁移至 `src/styles/`
   - 在 `main.ts` 中通过 `import './styles/xp-theme.css'` 等语句引入全部样式，移除 `index.html` 中的 `<link rel="stylesheet">`
   - CSS 文件内容保持不变，不引入 CSS Modules 或预处理器，仅改变加载方式
   - 静态资源（图片、字体、音频）迁移至 `src/assets/`，通过 Vite 资源机制引用

5. **静态资源处理**：图片、字体、音频通过 Vite 的资源处理机制加载，路径引用统一为相对 `src/assets`。

**结果与状态变更**：
- 模块依赖可被静态分析，加载顺序不再敏感
- 开发时支持热更新（HMR）
- 生产构建自动压缩与 Tree-shaking
- 样式与脚本统一由 Vite 管理，`index.html` 仅保留结构与入口

**异常处理**：
- 若全局变量被第三方脚本依赖，提供 `window.DesktopState = DesktopState` 等过渡导出，标记为 `@deprecated`
- CSS 中引用的资源路径（如 `url()`）需同步调整为相对 `src/assets` 的路径，逐文件校验视觉不变

---

### FR-S4：状态管理 + 数据抽离

**目的**：建立可预测的状态流转机制，分离数据与渲染。

**触发**：应用状态发生变更或数据需要更新。

**处理规则**：

1. **状态仓库**：实现轻量发布订阅模式（约 30 行），`DesktopState` 改为 `store`：
   - `getState()` / `setState(partial)`
   - `subscribe(key, callback)` 订阅指定字段变更
   - 状态变更时自动通知订阅者，渲染层订阅并执行增量更新

2. **数据抽离**：
   - `ARTICLES`、`PHOTOS`、`TRACKS` 移至 `src/data/` 独立文件
   - 应用通过 `import { ARTICLES } from '../data/articles'` 获取数据
   - 数据变更不触碰应用代码

3. **常量集中**：动画时长（`BOOT_MS`、`WELCOME_MS`）、窗口尺寸、z-index 起始值等魔法数字集中到 `src/constants/`。

4. **错误处理**：
   - `localStorage` 操作失败时 `console.warn` 并降级为默认值，不再静默吞错
   - 音频播放失败给出可感知提示

**结果与状态变更**：
- 状态变更有单一入口，渲染响应自动化
- 数据可独立维护，未来接入 Markdown 或后端无需改应用
- 常量可全局查找与统一调整

**异常处理**：
- 状态订阅回调执行异常时，捕获并 `console.error`，不中断其他订阅者
- 数据文件加载失败时使用空数组降级

---

### FR-S5：TypeScript 迁移

**目的**：为核心对象与函数提供类型安全，降低重构与维护风险。

**触发**：开发者编写或修改核心模块代码。

**处理规则**：

1. **渐进式迁移**：保留现有 JS 可运行，新增 `tsconfig.json` 配置 `allowJs: true`，逐步将核心文件改为 `.ts`。

2. **类型定义**（`src/types/index.ts`）：
   - `AppDef`、`WindowState`、`Article`、`Photo`、`Track`
   - `AppRegistry`、`WindowManager` 接口
   - 事件回调签名

3. **覆盖优先级**：
   - P0：`types/`、`state/store.ts`、`apps/registry.ts`、`apps/chrome.ts`
   - P1：各应用 `renderContent` 函数签名
   - P2：`window-manager.ts` 内部函数

4. **严格度**（Q2 已确认为渐进式）：
   - `tsconfig.json` 启用 `strict: true`，`allowJs: true`，`checkJs: false`
   - 已迁移为 `.ts` 的文件必须通过 `strict` 类型检查
   - 未迁移的 `.js` 文件不参与类型检查，允许与 `.ts` 文件共存
   - 第三方库无类型声明时，使用 `declare module 'xp.css'` 占位
   - 迁移顺序：types → state → apps/registry & chrome → 各应用 → core

**结果与状态变更**：
- IDE 提供可靠的类型补全与跳转
- 编译期捕获类型错误
- 重构核心模块时类型系统提供安全网

**异常处理**：
- 迁移过程中允许部分文件暂留 JS，`tsconfig` 不强制全量通过
- 第三方库无类型声明时，使用 `declare module 'xp.css'` 占位

---

### FR-S6：单元测试

**目的**：为核心逻辑建立自动化验证，确保重构过程中行为不退化。

**触发**：S2（增量渲染）、S4（状态管理）、S5（TypeScript）完成后，对核心逻辑编写测试。

**处理规则**：

1. **测试框架**：引入 Vitest（与 Vite 天然集成，零额外配置），配置 `vitest.config.ts`，通过 `npm run test` 运行。

2. **测试覆盖范围**（Q4 已确认补单元测试）：
   - **窗口管理器**（`window-manager.test.ts`）：
     - 窗口打开：创建窗口后状态正确、位置居中、z-index 递增
     - 窗口关闭：DOM 移除、`_cleanup` 回调被调用、激活态正确转移
     - 最小化/还原：状态切换、显示隐藏正确
     - 最大化/还原：`prevBounds` 保存与恢复正确
     - 激活：新窗口 z-index 提升、旧窗口降级
     - 拖拽边界约束：标题栏可见、不超出任务栏区域
     - 缩放约束：不小于 `minWidth`/`minHeight`
   - **状态仓库**（`store.test.ts`）：
     - `getState` 返回当前状态
     - `setState` 正确合并 partial
     - `subscribe` 订阅指定字段变更时回调被触发
     - 未订阅字段变更不触发回调
     - 回调异常不影响其他订阅者
   - **开机动画**（`boot.test.ts`）：
     - 首次访问执行完整三阶段时序
     - 已访问（localStorage 标记）直接跳过

3. **测试隔离**：
   - 使用 `jsdom` 环境模拟 DOM
   - 每个测试用例前重置 `localStorage` 与全局状态
   - 不依赖真实音频与图片资源

4. **断言风格**：使用 Vitest 内置 `expect`，不引入额外断言库。

**结果与状态变更**：
- 核心逻辑行为有自动化回归保护
- 重构时可通过 `npm run test` 快速验证行为不变
- CI 中可集成测试命令

**异常处理**：
- 涉及 DOM 操作的测试若 jsdom 不支持（如 `getBoundingClientRect`），手动 mock 该方法
- 涉及 `requestAnimationFrame` 的测试，使用 Vitest 的 `vi.useFakeTimers` 控制时间

---

## 5. 共享规则与约束

### 5.1 行为不变约束

贯穿所有阶段的硬性约束：**重构后用户可见行为必须与重构前完全一致**。

验证方式：
- 开机动画三阶段时序不变（黑屏 5.2s → 欢迎 2.6s → 加载 1.6s）
- 窗口拖拽边界约束不变（标题栏可见、不超出任务栏）
- 窗口缩放最小尺寸约束不变
- 所有应用功能与文案不变
- 本地存储键名不变（`somewhere-boot-done`、`somewhere-settings`）

### 5.2 阶段间依赖

| 阶段 | 前置依赖 | 说明 |
|------|---------|------|
| S2 增量渲染 | 无（可先于 S1） | 直接修改 `window-manager.js` |
| S3 ES Modules + Vite + CSS | S1（建议） | 拆分后再改模块语法更清晰 |
| S4 状态管理 | S3 | 发布订阅依赖模块系统 |
| S5 TypeScript（渐进式） | S3 | 类型定义需 ES Module 结构 |
| S6 单元测试 | S2、S4 | 针对窗口管理器与状态仓库编写测试 |

S1 与 S2 无依赖，可并行；S3 必须在 S4、S5 之前；S6 依赖 S2 与 S4 的产出。

### 5.3 验证规则

每个阶段完成后需通过：
1. **功能回归**：手动走查开机 → 桌面 → 打开各应用 → 窗口交互 → 关闭，行为与重构前一致
2. **构建验证**：`npm run build` 无错误（S3 起）
3. **类型检查**：`npx tsc --noEmit` 无错误（S5 起，仅针对已迁移为 `.ts` 的文件）
4. **单元测试**：`npm run test` 全部通过（S6 起）

---

## 6. 已确认决策

以下决策已由需求方确认，作为各阶段实施的约束条件：

| ID | 决策项 | 确认结论 | 影响章节 |
|----|--------|---------|---------|
| D1 | 部署方式 | 统一通过 Vite 构建产物部署，不再支持直接双击 `index.html` 打开 | FR-S3 |
| D2 | TypeScript 迁移策略 | 渐进式迁移，已迁移为 `.ts` 的文件启用 `strict`，未迁移的 `.js` 文件不参与类型检查 | FR-S5 |
| D3 | CSS 处理方式 | CSS 迁移至 `src/styles/` 并通过 `import` 引入，不使用 CSS Modules 或预处理器，CSS 内容保持不变 | FR-S3 |
| D4 | 单元测试 | 补充核心逻辑单元测试（窗口管理器、状态仓库、开机动画），纳入 P0，使用 Vitest | FR-S6 |

无剩余开放问题。

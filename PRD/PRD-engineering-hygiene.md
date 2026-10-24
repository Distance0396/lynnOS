# lynnOS 工程卫生专项 PRD（P3）

> **⚠️ 状态：部分取代（2026-10-25）** —— H2~H5（DOM 工具层、可访问性、atmosphere 拆分、测试补盲）已由 [PRD-vue-refactor.md](./PRD-vue-refactor.md) 吸收取代；仅 H1（仓库卫生快改）仍然有效，已并入 Vue 重构 V1 阶段执行。

| 字段 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 日期 | 2026-10-25 |
| 适用范围 | lynnOS 前端代码库（`D:\code\lynnOS`） |
| 前置状态 | PRD-refactor.md S1~S6 已落地（commit `16c8616`），测试 30/30 通过 |
| 文档性质 | 代码质量专项重构需求规格（不含 P2 缺陷修复） |
| 执行前置 | 开始任何 UI 相关改造前，必须先阅读 `skills/windows-xp-ui/SKILL.md`（项目最高优先级 UI 规则） |

---

## 1. 背景与目标

### 1.1 问题清单

代码审查（2026-10-25）确认的 P3 工程卫生问题：

| # | 问题 | 证据 | 影响 |
|---|------|------|------|
| 1 | **innerHTML 字符串拼接是全库默认的 UI 构建方式** | `music-collection.ts:42-81`（40 行 `+` 拼接）、`chrome.ts:81-86`、`atmosphere.ts:194-207`、`boot.ts:47-58`、`desktop.ts:26-29`、`taskbar.ts:73-103` 等，13 个应用无一幸免 | 结构不可读：多层引号括号手工配对，DOM 层级完全淹没在字符串里；变量插值无转义防护；事件依赖 innerHTML 后 querySelector 重绑，结构与逻辑割裂 |
| 2 | 内联事件处理器 | `music-collection.ts:74`、`article-archive.ts:119`、`recycle-bin.ts:31` 的 `onmouseover`/`onmouseout` | 表现逻辑混入 HTML 字符串；与任何 CSP 策略不兼容 |
| 3 | 大量内联 style | 上述拼接串内 `style="..."` 遍布 | 样式不可复用、不走 `variables.css` 设计 token，违反 CLAUDE.md「所有系统组件必须使用统一的设计 token」要求 |
| 4 | 根目录 `assets/` 与 `public/assets/` 完全重复 | `diff -rq` 零差异，2.7MB × 2 | 构建只打包 `public/`，根目录那份是死重量；存在改错副本的风险 |
| 5 | 死代码 `iconPositions` | `state.ts:46`，全库无任何引用 | 误导维护者以为桌面图标可拖动 |
| 6 | 缺 `.gitattributes` | `git add` 输出整屏 LF→CRLF 警告 | 换行符 churn，后续产生无意义 diff |
| 7 | `vite.config.ts` 无 `base` | 构建产物使用绝对路径 `/assets/...` | 部署到 GitHub Pages 等子路径时资源 404 |
| 8 | 可访问性缺失 | `desktop.ts:22-42` 图标为 `div` + `dblclick`；开始菜单项为 `div`；Esc 不关闭开始菜单/对话框/时钟面板 | 键盘完全无法操作；语义角色缺失 |
| 9 | `atmosphere.ts` 大杂烩 | 408 行：声音合成 + 壁纸 + 设置持久化 + 系统对话框 + 时钟面板 + 回收站彩蛋 + 睡眠模式 | 单一职责破坏，定位与修改困难 |
| 10 | 测试盲区 | 现有测试仅覆盖 state / window-manager / boot | taskbar、desktop、全部 13 个应用、拖拽/缩放几何逻辑零覆盖 |

### 1.2 目标

- UI 构建方式收敛到统一的小型 DOM 工具层：结构可读、插值默认转义、事件与结构同处声明
- 内联事件与静态内联样式清零；样式进入设计 token 体系
- 仓库无重复资源、无死代码、换行符受控、构建支持子路径部署
- 基础键盘可达：图标/菜单可 Tab 聚焦、Enter 打开、Esc 关闭浮层
- `atmosphere.ts` 按职责拆分；测试盲区补齐
- **全程视觉零回归**：所有改造在真实浏览器截图对比下不可感知（H3 可访问性为唯一行为增强例外）

### 1.3 非目标

- 不引入任何 UI 框架、虚拟 DOM 或运行时第三方依赖（延续 PRD-refactor 非目标，工具层零依赖自研）
- 不修 P2 缺陷（播放器进度条点击定位、时钟 15 秒偏差、双重渲染、循环依赖等，另立专项）
  - 例外说明：H2 迁移 `music-collection` 时保留其现有「每 500ms 全量重建」行为不变，仅更换构建方式；行为优化留给 P2 专项
- 不做移动端适配
- 不改动 XP 视觉辨识度（CLAUDE.md 硬约束）

---

## 2. 核心设计：DOM 构建层（本 PRD 重点）

### 2.1 问题样本

现状（`music-collection.ts:43-49` 节选，真实代码）：

```ts
content.innerHTML =
  '<div style="padding:16px 16px 8px;display:flex;align-items:center;gap:14px;">' +
    '<div style="width:72px;height:72px;background:' + track.gradient + ';border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid #D5D2C5;">' +
      '<img src="assets/icons/xp/32/folder-music.png" alt="" width="32" height="32">' +
    '</div>' +
    '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:14px;font-weight:bold;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + track.title + '</div>' +
      ...
```

具体问题：

1. **结构不可读**：需要人工配对多层引号与括号才能还原 DOM 树；DOM 层级与字符串拼接顺序完全不一致
2. **改一处要在字符串堆里考古**：加一个节点 = 找对 `+` 的位置、配对引号、补分号
3. **插值无防护**：`track.title` 直接拼进 HTML，安全完全依赖调用者自觉
4. **样式与结构纠缠**：静态样式（固定 padding、字号）和动态样式（`track.gradient`）混在同一段内联串里

### 2.2 方案选型

| 方案 | 结论 |
|------|------|
| 引入框架（Vue/React/preact） | 否决：违反 PRD-refactor 非目标，本项目刻意保持原生 DOM |
| 引入 lit-html / uhtml 等微库 | 否决：新增运行时依赖，收益不值得；且 tagged template 语法可自研 |
| **自研零依赖工具层 `src/ui/dom.ts`（选定）** | 预计 ~150 行，提供 `el()` + `html` 模板标签 + 显式信任边界；类型完备，可单测 |

### 2.3 新增 `src/ui/dom.ts` API 规范

```ts
/* el：结构化创建元素。children 中的字符串一律作为文本（天然转义） */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: ElAttrs | null,
  ...children: DomChild[]
): HTMLElementTagNameMap[K];

interface ElAttrs {
  class?: string;
  id?: string;
  dataset?: Record<string, string>;
  style?: string;   // 仅限动态值（如 track.gradient）；静态样式一律走 CSS 类
  on?: Record<string, (e: Event) => void>;  // addEventListener 语义，非内联属性
  [key: string]: unknown;  // 其余键按 attribute 设置；value/checked/disabled 等按 property 处理
}

/* html：模板标签。所有插值默认转义，返回 DocumentFragment */
export function html(strings: TemplateStringsArray, ...values: unknown[]): DocumentFragment;

/* 唯一信任边界：仅用于受控 HTML——文章正文（data 层已存 HTML）、含 <br> 的系统文案、内联 SVG */
export function unsafeHtml(fragment: string): TrustedHtml;
```

**插值处理规则**（`html` 与 `el` 的 children 共用）：

| 插值类型 | 处理 |
|----------|------|
| `string` / `number` | HTML 转义后作为文本节点 |
| `Node` / `DocumentFragment` | 原样插入（可与 `el()` 结果任意嵌套组合） |
| `TrustedHtml`（仅 `unsafeHtml()` 产物） | 原样插入，来源可审计 |
| 数组 | 递归展平 |
| `null` / `undefined` / `false` | 忽略（便于条件渲染） |
| 其他对象 | **抛错**（禁止静默渲染成 `[object Object]`） |

设计要点：

- **默认安全**：转义是默认行为，不转义必须显式 `unsafeHtml()`，grep 信任边界即可审计
- **两个入口各司其职**：结构性/带事件的节点用 `el()`；大块静态标记用 `html``；两者可互相嵌套
- **`el()` 的事件用 `on` 属性声明**，与结构同处；杜绝 `onmouseover="..."` 字符串属性

### 2.4 改造前后对比示例

**Before**（`music-collection.ts:73-79`，播放列表行 + 内联事件）：

```ts
TRACKS.map((t, i) =>
  '<div class="track-item" style="padding:5px 16px;font-size:12px;..."' +
  ' data-idx="' + i + '"' +
  ' onmouseover="if(' + i + '!==' + currentTrack + ')this.style.background=\'#E8ECF4\'"' +
  ' onmouseout="if(' + i + '!==' + currentTrack + ')this.style.background=\'\'">' +
    '<span style="...">' + (i + 1) + '.</span>' +
    '<span style="...">' + t.title + '</span>' +
  '</div>'
).join('')
```

**After**：

```ts
import { el } from '../ui/dom';

const trackList = el('div', { class: 'mc-track-list' },
  ...TRACKS.map((t, i) =>
    el('div', {
      class: 'track-item' + (i === currentTrack ? ' current' : ''),
      dataset: { idx: String(i) },
      on: { dblclick: () => selectTrack(i) },
    },
      el('span', { class: 'track-no' }, `${i + 1}.`),
      el('span', { class: 'track-title' }, t.title),      // 字符串 → 文本节点，天然转义
      el('span', { class: 'track-duration' }, t.duration),
    ),
  ),
);
```

hover 效果从 JS 内联事件迁移为纯 CSS（新建 `src/styles/apps.css` 或并入 `desktop.css`）：

```css
/* 值与原内联 onmouseover 完全一致，视觉零变化 */
.track-item:not(.current):hover,
.article-row:hover,
.recycle-row:hover { background: #E8ECF4; }
```

样式类化规则：

- 静态样式（原 `style="padding:5px 16px;font-size:12px;..."`）→ 提取为 CSS 类，属性值逐项保持不变，颜色/字体改用 `variables.css` 中等值 token
- 动态样式（如 `track.gradient`、窗口坐标）→ 保留内联，这是内联样式的合法用途

### 2.5 迁移范围与步骤

| 文件 | innerHTML/拼接块 | 迁移要点 |
|------|------------------|----------|
| `apps/music-collection.ts` | 全应用（最重灾区） | **先做样板**，评审通过后铺开；保留全量重建行为 |
| `apps/article-archive.ts`、`apps/recycle-bin.ts` | 列表行 + `onmouseover` | hover 迁 CSS；行事件改 `el()` 声明 |
| `apps/guestbook.ts` | 模板 + 手工 `esc()` | 删除手工 `esc()`，依赖默认转义；保留长度校验 |
| `apps/chrome.ts` | 侧栏/工具栏构建 | 供所有应用复用，属基础设施，随样板一起迁 |
| `core/atmosphere.ts` | 系统对话框、时钟面板 | `msg.text` 中 `<br>` 等受控 HTML 走 `unsafeHtml()` |
| `core/boot.ts` | 开机画面（SVG 字符串） | 迁 `html`` 模板 |
| `core/desktop.ts`、`core/taskbar.ts` | 图标/任务按钮/开始菜单 | 与 H3 的 button 化同步进行，避免二次返工 |
| 其余 8 个应用 | 各自 innerHTML 块 | 按样板模式逐个迁移 |

**每个应用的迁移六步**（一应用一 commit）：

1. 梳理该应用全部 innerHTML 块与插值来源
2. 映射为 `el()` / `html`` 结构
3. 静态内联 style 提取为 CSS 类（值不变，颜色换 token）
4. 删除内联事件，改 `on` 属性或 CSS `:hover`
5. 核对每个插值：用户输入走默认转义；受控 HTML 显式 `unsafeHtml()`
6. 真实浏览器截图对比（迁移前 vs 迁移后），确认像素级一致

### 2.6 验收门（可 grep）

```bash
grep -rn "onmouseover\|onmouseout\|onclick=" src/   # 期望 0 命中
grep -rln "innerHTML" src/                           # 期望仅 src/ui/dom.ts
grep -rn "iconPositions" src/                        # 期望 0 命中
test ! -d assets/                                    # 根目录重复资源已删
npm test && npm run build                            # 全绿
```

---

## 3. 阶段划分

| 阶段 | 名称 | 核心交付物 | 依赖 |
|------|------|-----------|------|
| H1 | 仓库卫生快改 | ① `.gitattributes`（`* text=auto eol=lf` + `*.png/*.woff/*.woff2/*.wav binary`）并 `git add --renormalize .`，**单独 commit**；② 删除根目录 `assets/`；③ 删除 `iconPositions` 及相关测试断言；④ `vite.config.ts` 增加 `base: process.env.BASE_PATH ?? '/'` | 无 |
| H2 | **DOM 构建层与 innerHTML 清退（重点）** | ① `src/ui/dom.ts`（`el`/`html`/`unsafeHtml`，零依赖）+ `src/ui/dom.test.ts`（转义、嵌套、事件、非法对象抛错）；② hover CSS 类替换全部内联事件；③ 静态内联样式类化并入 token 体系；④ 13 应用 + chrome + atmosphere + boot + desktop + taskbar 按第 2.5 节迁移；⑤ 移除手工 `esc()` | H1 |
| H3 | 可访问性 | ① 桌面图标、开始菜单项 `div` → `button`（或补 `role`/`tabindex`），Enter/Space 触发；② Esc 关闭开始菜单/系统对话框/时钟面板（次序：最后打开的先关）；③ `sys-dialog` 增加 `role="dialog"`、`aria-modal`、打开时焦点落到「确定」；④ `:focus-visible` 样式符合 XP 视觉 | H2 |
| H4 | atmosphere 拆分 | 拆为 `core/sound.ts`（AudioContext + play*）、`core/wallpaper.ts`（WALLPAPERS + apply）、`core/dialog.ts`（系统对话框；`RECYCLE_MEMORIES` 移交 `apps/recycle-bin.ts`）、`core/clock-panel.ts`、`core/sleep.ts`；直接更新约 6 处引用，不保留 facade | 无，可与 H2 并行 |
| H5 | 测试补盲 | ① taskbar / desktop / 开始菜单渲染测试；② 拖拽与缩放的 clamp/边界逻辑抽为纯函数（如 `clampDragPosition()`）后单测，DOM 侧薄封装；③ a11y 冒烟（角色存在、Esc 行为）；④ 覆盖率报告确认无 0 覆盖模块 | H2、H3 |

实施顺序：H1 → H2 → H3 → H4/H5（H4 可与 H2 并行，H5 收尾）。

---

## 4. 总体验收标准

- [ ] 第 2.6 节全部 grep 门通过
- [ ] `npm test`、`npm run build` 全绿，新增测试覆盖 dom / taskbar / desktop / 拖拽几何
- [ ] 13 个应用迁移前后截图对比一致（截图记录附于各 commit/PR 描述，遵守 CLAUDE.md 规则 9：真实浏览器验证，禁止仅凭代码判断）
- [ ] 键盘走查通过：Tab 聚焦桌面图标 → Enter 打开窗口 → Esc 依次关闭浮层
- [ ] `.gitattributes` 生效：`git ls-files --eol` 无 mixed 行尾
- [ ] 复用统一设计 token，无现代风格污染（对照 `skills/windows-xp-ui/SKILL.md` 检查清单）

---

## 5. 风险与对策

| 风险 | 对策 |
|------|------|
| 默认转义导致「应该渲染的 HTML」被双重转义（文章正文、`<br>` 文案） | 信任边界唯一化（`unsafeHtml`）；迁移六步中第 5 步强制逐插值核对来源 |
| 13 个应用同时迁移回归面大 | 先做 `music-collection` 样板并评审；此后一应用一 commit，截图对比后再进下一个 |
| `renormalize` 产生巨型换行 diff | `.gitattributes` + renormalize 单独成 commit，不与任何功能改动混合 |
| jsdom 无真实布局，拖拽/缩放难测 | 几何 clamp 逻辑抽纯函数后测试，DOM 事件侧不做 jsdom 布局模拟 |
| 键盘/Esc 改动影响现有鼠标交互 | H3 只做增量行为（原交互一律不变）；手测 + 截图双验证 |
| 样式类化时 token 与原值存在细微色差 | 规则明确：token 无等值时保留原字面量并注释，不为「统一」引入视觉变化 |

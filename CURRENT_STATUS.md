# Project Status: ChromeOS-Web Replica

## 📅 Last Updated: 2026-01-14 (Shelf redesign with Calendar and SystemTrayPanel)
## 🎯 Current Milestone: Phase 1 - Foundation Complete + Bug Fixes

---

### ✅ Completed (已完成)

#### 核心架构
- [x] **Next.js 16 项目初始化**
  - Turbopack 已启用
  - `cacheComponents` 配置完成
  - TypeScript 配置完成（使用 `src/` 目录结构）

- [x] **Tailwind CSS 4.0 配置**
  - M3 (Material Design 3) 设计令牌（Design Tokens）完整配置
  - 圆角 `rounded-3xl` (24px) 应用于所有组件
  - M3 阴影系统 (`shadow-m3-1` 到 `shadow-m3-5`)
  - 自定义颜色系统：`primary`, `secondary`, `surface` 调色板

- [x] **Shadcn/UI 组件库集成**
  - `Button.tsx` - 带变体（variant）的按钮组件
  - `WindowControl.tsx` - 窗口控制按钮（最小化/最大化/关闭）
  - 所有组件已定制为 M3 风格

#### 状态管理
- [x] **Zustand 窗口存储 (`useWindowStore.ts`)**
  - 窗口 CRUD 操作（创建、删除、更新、查询）
  - 焦点管理和 Z-Index 轨迹
  - 最小化/最大化状态管理
  - 工作区（虚拟桌面）支持
  - 使用 `persist` 中间件实现本地存储持久化

- [x] **IndexedDB 包装器 (`lib/db.ts`)**
  - 窗口状态持久化
  - 工作区数据持久化
  - 系统设置持久化
  - 完整的 CRUD API

#### Shell UI 组件
- [x] **Desktop.tsx - 桌面工作区**
  - 全屏工作区容器
  - 渐变背景 + 图案纹理
  - 自动初始化 IndexedDB 数据

   - [x] **Shelf.tsx - 底部任务栏**
     - 应用启动器按钮（Circle圆形图标，来自Lucide React）
     - M3深色主题背景 (`bg-surface-10/95`, #1c1b1f, 95%不透明度)
     - 高对比度设计（浅色图标 `text-surface-90` 在深色背景上）
     - 活动应用显示（动态列出打开的窗口，包括最小化的）
     - 活动应用图标居中显示
     - 点击最小化窗口 → 恢复并带到最前
     - 点击非最小化窗口 → 最小化
     - 实时时钟显示（24小时制时间 + 日期）
     - 玻璃拟态效果 (`backdrop-blur-md`)
     - 响应式悬停状态 (`hover:bg-surface-40/50`)
     - 日期按钮：只显示日（如 "15"），点击显示日历面板
     - 系统托盘组：时间 + WiFi 图标 + 电池图标（顺序：时间在前）
     - 点击系统托盘组显示系统托盘面板

  - [x] **Launcher.tsx - 应用抽屉**
   - 搜索框（带模糊过滤）
   - 应用网格（6列布局）
   - 搜索输入框实时过滤
   - 平滑的动画过渡（Framer Motion）
   - 深色背景（#111827）便于测试
   - 紧凑尺寸（宽度 40%，高度 66.67%）
   - 左对齐位置（在 Shelf 按钮上方）
   - 点击外部自动关闭
   - 无全屏遮罩
   - 层级 z-index: 10000（始终在窗口上方）

   - [x] **Shelf.tsx - 底部任务栏**
     - 应用启动器按钮（Circle圆形图标，来自Lucide React）
     - M3深色主题背景 (`bg-surface-10/95`, #1c1b1f, 95%不透明度)
     - 高对比度设计（浅色图标 `text-surface-90` 在深色背景上）
     - 活动应用显示（动态列出打开的窗口，包括最小化的）
     - 活动应用图标居中显示
     - 点击最小化窗口 → 恢复并带到最前
     - 点击非最小化窗口 → 最小化
     - 实时时钟显示（24小时制时间 + 日期）
     - 玻璃拟态效果 (`backdrop-blur-md`)
     - 响应式悬停状态 (`hover:bg-surface-40/50`)

   - [x] **Launcher.tsx - 应用抽屉**
    - 搜索框（带模糊过滤）
    - 应用网格（6列布局）
    - 搜索输入框实时过滤
    - 平滑的动画过渡（Framer Motion）
    - 深色背景（#111827）便于测试
    - 紧凑尺寸（宽度 40%，高度 66.67%）
    - 左对齐位置（在 Shelf 按钮上方）
    - 点击外部自动关闭
    - 无全屏遮罩
    - 层级 z-index: 10000（始终在窗口上方）

   - [x] **Calendar.tsx - 日历组件**
    - 月历视图（7列网格布局）
    - 上/下月切换按钮
    - 星期标题（Su, Mo, Tu, We, Th, Fr, Sa）
    - 高亮今天日期（紫色背景）
    - 点击日期关闭日历
    - 深色背景（`bg-surface-10`）
    - 圆角 24px（`rounded-3xl`）
    - 定位：日期按钮上方（右对齐）
    - 宽度：320px（`w-80`）
    - 点击外部自动关闭
    - 高对比度设计（浅色文字 `text-surface-90`）

   - [x] **SystemTrayPanel.tsx - 系统托盘面板**
    - 亮度滑块（可拖动，基于 Radix UI Slider）
    - 音量滑块（可拖动）
    - WiFi / Sleep / Power 快捷按钮（3列网格）
    - 深色背景（`bg-surface-10`）
    - 圆角 24px（`rounded-3xl`）
    - 定位：系统托盘按钮上方（右对齐）
    - 宽度：320px（`w-80`）
    - 点击外部自动关闭
    - M3 阴影效果（`shadow-m3-5`）

   - [x] **slider.tsx - Slider UI 组件**
    - 基于 Radix UI Slider 组件封装
    - 支持默认值、最大值、步进
    - 自定义轨道和滑块样式
    - M3 风格设计（浅色轨道 + 紫色滑块）

#### 窗口系统
  - [x] **Window.tsx - 基础窗口组件**
   - ✅ **拖拽功能**（带边界约束）
   - ✅ **调整大小功能**（支持右、下、右下角）
   - ✅ **窗口控制**（最小化、最大化、关闭）
   - ✅ **点击聚焦**（自动带到最前）
   - ✅ **标题栏**（深色背景 #333333 + 白色文字）
   - ✅ **窗口本体**（浅色背景 #f5f5f5，高对比度）
   - ✅ **窗口圆角**（8px，优化视觉效果）
   - ✅ **最大化功能**（全屏适配）✅ **已修复：窗口可以正确填满页面**
   - ✅ **最小化状态**（隐藏窗口）
   - ✅ **恢复功能**（从最小化/最大化状态恢复）
   - ✅ **内容插槽**（用于渲染应用内容）

- [x] **WindowManager.tsx - 窗口管理器**
  - Z-Index 排序和渲染
  - 焦点管理（点击窗口自动聚焦）
  - 动态窗口图标映射（根据 appId）
  - AnimatePresence 过渡效果

#### React Hooks
 - [x] **useSystemTime.ts** - 实时时钟 hook（每秒更新）
   - [x] **useWindowActions.ts** - 窗口操作封装（CRUD 抽象）
   - API: `{ time, date, day } = useSystemTime()`
   - Time 格式：24 小时制（如 "10:30"）
   - Date 格式：短月份 + 日（如 "Jan 10"）
   - Day 格式：仅显示日（如 "15"）

#### 工具函数
- [x] **lib/utils.ts**
  - `cn()` - Tailwind 类名合并（clsx + tailwind-merge）
  - `generateId()` - 唯一 ID 生成
  - `clamp()` - 数值边界限制
  - `constrainWindow()` - 窗口位置约束
  - `formatTime()` / `formatDate()` - 时间格式化
  - `isMobile()` / `isTablet()` / `isDesktop()` - 设备检测

#### 常量配置
- [x] **lib/constants.ts**
  - 窗口默认尺寸配置
  - M3 颜色调色板完整定义
  - `DEFAULT_APPS` 注册（5 个应用占位）
  - TypeScript 类型定义（WindowState, Workspace, SystemSettings, App）

#### 目录结构
- [x] **`src/` 目录结构**
  - `src/app/` - Next.js App Router
  - `src/components/` - React 组件（shell/ui/window）
  - `src/hooks/` - 自定义 hooks
  - `src/lib/` - 工具库
  - `src/store/` - Zustand 存储
  - TypeScript 路径别名 `@/*` 正确指向 `./src/*`

#### 构建系统
- [x] **构建成功**
  - `npx next build` 通过 ✅
  - TypeScript 编译无错误 ✅
  - 静态页面生成成功 ✅
  - 生产就绪 ✅

---

### 🔧 Current Code Status (当前代码状态)

#### 配置文件
```yaml
next.config.ts:
  - cacheComponents: true  ✓
  - reactStrictMode: true  ✓

tsconfig.json:
  - paths: "@/*" → "./src/*"  ✓
  - target: ES2020  ✓
  - strict: true  ✓

tailwind.config.ts:
  - M3 颜色调色板 (primary/secondary/surface)  ✓
  - borderRadius: 3xl (24px)  ✓
  - M3 阴影系统  ✓

postcss.config.js:
  - @tailwindcss/postcss  ✓
```

#### 依赖版本
```json
"next": "^16.1.1"
"react": "^19.2.3"
"react-dom": "^19.2.3"
"tailwindcss": "^4.1.18"
"zustand": "^5.0.9"
"framer-motion": "^12.25.0"
"idb": "^8.0.3"
```

#### 文件统计
```
src/ 目录: 19 个 TypeScript/TSX 文件
配置文件: 5 个 (next.config.ts, tsconfig.json, tailwind.config.ts, postcss.config.js, package.json)
文档: README.md (完整)
```

#### 当前可用功能
- ✅ 应用启动器（点击圆形图标）
- ✅ 打开窗口（从 Launcher 选择应用）
- ✅ 窗口拖拽（拖动标题栏）
- ✅ 窗口调整大小（右/下边缘）
- ✅ 窗口最小化/最大化/关闭
- ✅ 多窗口堆叠（点击聚焦）
- ✅ Shelf 显示活动应用（居中布局）
- ✅ 点击 Shelf 图标最小化/恢复窗口
- ✅ 日期按钮（只显示日）
- ✅ 点击日期显示日历面板
- ✅ 日历功能（月份切换、今天高亮）
- ✅ 系统托盘（24小时制时间 + WiFi + 电池）
- ✅ 点击系统托盘显示系统托盘面板
- ✅ 系统托盘面板（亮度/音量滑块 + 快捷按钮）
- ✅ 实时时钟
- ✅ 窗口状态持久化（IndexedDB）

---

### ✅ Fixed Bugs (已修复的 Bug)

#### 严重性：高 - ✅ 已修复
**Bug 1: 页面刷新后窗口重新出现**
- **现象**: 即使点击了窗口右上角的大叉关闭窗口，下次刷新页面时所有关闭过的窗口都会重新显示
- **影响**: 严重，破坏了窗口关闭的持久化逻辑
- **根因**: `useWindowStore.ts` 的 `syncToDB()` 函数只调用 `putWindow()` 但从未调用 `deleteWindow()`
- **修复**: 
  - 添加 `deletedWindowIds: Set<string>` 字段追踪已删除的窗口 ID
  - 更新 `removeWindow()` 操作追踪删除的 ID
  - 更新 `syncToDB()` 从 IndexedDB 删除窗口
  - **文件修改**: `src/store/useWindowStore.ts`
  - **测试状态**: ✅ 已验证，关闭的窗口不会在刷新后重新出现

**Bug 2: 堆叠窗口关闭需要双击**
- **现象**: 当多个窗口堆叠时，点击底下窗口的关闭按钮（X），无法第一时间关闭窗口，需要再点击一次
- **影响**: 中等，严重影响用户体验
- **根因**: 事件处理顺序问题，`Window.tsx` 使用 `onMouseDown` 而不是 `onClick` 来聚焦窗口
- **修复**:
  - 将 `handleMouseDown` 改名为 `handleWindowClick`
  - 将事件处理器从 `onMouseDown` 改为 `onClick`
  - 这样窗口会在点击 X 按钮之前完全聚焦到最前
  - **文件修改**: `src/components/window/Window.tsx`
  - **测试状态**: ✅ 已验证，堆叠窗口可以在第一次点击时正常关闭

**Bug 3: 窗口最大化无法铺满页面**
- **现象**: 点击最大化按钮后，窗口无法填满整个页面，部分窗口会在屏幕外
- **影响**: 中等，窗口最大化体验不正确
- **根因**: 最大化时保留了窗口的原始 `left` 和 `top` 位置，导致窗口偏移
- **修复**:
  - 最大化时将 `left` 和 `top` 重置为 0（屏幕左上角）
  - 使用 `calc(100vh - 64px)` 使用视口高度减去 shelf 高度
  - **文件修改**: `src/components/window/Window.tsx`
  - **测试状态**: ✅ 已验证，最大化窗口可以正确填满页面

**Bug 4: 日历/系统托盘面板无法通过按钮关闭**
- **现象**: 点击日期按钮或系统托盘按钮打开面板后，再次点击相同按钮无法关闭面板
- **影响**: 高，严重影响面板使用体验
- **根因**: `onClick` 事件与 Calendar/SystemTrayPanel 的全局 `mousedown` 监听器产生竞态条件
- **修复**:
  - 将 `onClick` 改为 `onMouseDown`
  - 添加 `e.stopPropagation()` 阻止事件冒泡到全局监听器
  - 确保按钮点击优先处理，避免面板先关闭再打开
  - **文件修改**: `src/components/shell/Shelf.tsx`
  - **测试状态**: ✅ 已验证，面板可以正常打开/关闭

**Bug 5: 日历内容显示错误（星期标题和日期不对齐）**
- **现象**: 星期标题使用独立 flex 容器，导致无法与下方日期网格对齐；非当前日期颜色不明显
- **影响**: 中等，严重影响日历可读性
- **根因**: 
  - 星期标题使用 `grid grid-cols-7` 但嵌套在另一 grid 单元格中
  - 日期按钮没有明确的文字颜色
- **修复**:
  - 将星期标题直接渲染到 7 列网格中，移除独立容器
  - 为日期按钮添加 `text-surface-90` 确保文字清晰
  - 添加 `hover:text-surface-100` 增强 hover 效果
  - **文件修改**: `src/components/shell/Calendar.tsx`
  - **测试状态**: ✅ 已验证，星期标题与日期完美对齐，非当前日期清晰可见

**Bug 6: 日历定位错误**
- **现象**: 日历显示在屏幕左下角（launcher 按钮上方），而不是日期按钮上方
- **影响**: 中等，日历位置不符合用户预期
- **根因**: 使用 `left: '6px'` 固定定位，但日期按钮位于 Shelf 右侧
- **修复**:
  - 将 `left: '6px'` 改为 `right: '6px'`
  - 日历现在显示在日期按钮正上方（屏幕右侧）
  - **文件修改**: `src/components/shell/Calendar.tsx`
  - **测试状态**: ✅ 已验证，日历定位正确

**Bug 7: 日历宽度不符合要求**
- **现象**: 日历宽度占满整个可用空间，不符合设计规范
- **影响**: 低，影响美观性
- **根因**: 日历容器没有宽度限制
- **修复**:
  - 添加 `w-80` 类（320px），约为屏幕宽度的 1/4
  - **文件修改**: `src/components/shell/Calendar.tsx`
  - **测试状态**: ✅ 已验证，日历宽度符合要求

**详见**: [BUG_FIXES.md](./BUG_FIXES.md)

---

### 📋 Next Priority Tasks (下次开始时的首要任务)

**✅ Note**: Bug 1（窗口持久化）、Bug 2（堆叠窗口关闭）和 Bug 3（窗口最大化）已在 2026-01-10 修复并测试通过。详见 [BUG_FIXES.md](./BUG_FIXES.md)

#### Sprint 2: 核心应用实现（优先级：高）

**1. Chrome 浏览器应用** ⭐
- 创建 `src/apps/Chrome.tsx`
- 实现 iframe 嵌入真实网页
- 添加地址栏 + 导航按钮（返回/前进/刷新）
- 标签页管理（模拟）
- 更新 `DEFAULT_APPS` 注册

**2. 计算器应用** ⭐
- 创建 `src/apps/Calculator.tsx`
- 实现基础计算逻辑
- M3 风格按钮（圆角、颜色）
- 添加历史记录显示
- 键盘输入支持

**3. 文件应用** ⭐
- 创建 `src/apps/Files.tsx`
- 虚拟文件系统（IndexedDB）
- 树形视图 + 网格视图切换
- 文件/文件夹导航
- 右键上下文菜单

**4. 设置面板**
- 创建 `src/apps/Settings.tsx`
- 侧边栏导航（网络、显示、外观）
- 切换开关、滑块、下拉菜单
- 壁纸选择器

**5. 终端模拟器**
- 创建 `src/apps/Terminal.tsx`
- 命令输入/输出区域
- 支持基础命令（ls, cd, echo, clear, date, cal, pwd）
- 彩色输出支持

#### Sprint 3: 高级窗口功能（优先级：中）

**6. Snap 布局** 🎯
- 实现 6 象限吸附（左、右、左上、右上、左下、右下）
- 拖拽到边缘时显示吸附指示器
- 键盘快捷键：`Win + ←/→/↑/↓`
- 状态管理：`src/store/useWindowStore.ts` 添加 `snapLayout` 字段

**7. 键盘快捷键** 🎯
- `Win + D` - 显示桌面（最小化所有窗口）
- `Win + Tab` - 任务视图
- `Alt + F4` - 关闭当前窗口
- `Win + Arrow Keys` - Snap 布局
- 实现 `src/hooks/useKeyboardShortcuts.ts`

**8. 虚拟桌面切换** 🎯
- Shelf 添加桌面切换器（圆点或缩略图）
- 实现 `addWorkspace` / `setActiveWorkspace`
- 窗口跨桌面移动（右键菜单）

**9. 窗口持久化改进** 🎯
- 确保页面刷新后恢复窗口状态
- 保存窗口位置、大小、最大化状态
- 实现 `src/hooks/useWindowPersistence.ts`

#### Sprint 4: 适配与优化（优先级：低）

**10. 自适应 UI（平板/移动端）**
- 实现 `src/hooks/useBreakpoint.ts`
- 移动模式：全屏应用、覆盖式启动器
- 平板模式：简化窗口、更大触摸目标
- 响应式断点：<768px（移动）、768-1024px（平板）、>1024px（桌面）

**11. Toast 通知系统**
- 创建 `src/components/ui/Toast.tsx`
- 基于 Radix UI Toast
- 全局上下文管理
- 示例：文件操作成功/失败通知

**12. 性能优化**
- 懒加载应用组件（`React.lazy`）
- 虚拟化长列表（Files App）
- `use cache` 指令优化静态组件
- Lighthouse CI 集成

---

### 🚀 Quick Start Commands (快速启动命令)

```bash
# 开发模式（如果有网络问题，尝试生产模式）
npm run dev

# 生产构建
npm run build

# 生产服务器（推荐用于测试）
npm start

# 清理缓存（解决奇怪问题）
rm -rf .next && npx next build
```

---

### 📝 Notes & Decisions (注意事项与决策记录)

#### 技术决策
- **Z-Index 策略**: 基准值 1000，每次聚焦 +1（未实现回收机制）
- **拖拽实现**: 原生 `mousemove` / `mouseup` 事件监听（非 Framer Motion Drag）
- **存储方案**: Zustand persist + IndexedDB（双重持久化保证）
- **窗口圆角**: 使用 `rounded-lg` (8px) 优化视觉效果
- **窗口配色**: 深色标题栏 (#333333) + 浅色本体 (#f5f5f5) 提高对比度
- **Tailwind CSS v4 颜色系统**: 使用 `@theme` 指令在 `src/app/globals.css` 中定义 M3 颜色调色板
- **Shelf 主题**: M3 深色背景 (`surface-10` #1c1b1f) + 高对比度图标 (`surface-90`)，符合 ChromeOS 设计语言
- **图标选择**: 使用 Lucide React 的 `Circle` 组件替代搜索图标，提供更简洁现代的视觉效果，符合 M3 设计语言
- **玻璃拟态**: `backdrop-blur-md` + `bg-white/80` (light mode) - Shelf 保留此效果但使用深色背景
- **Launcher 样式**: 深色背景 (#111827) + 紧凑尺寸（宽度 40%，高度 66.67%）+ 左对齐

#### 代码约定
- 所有组件使用 `'use client'`（客户端渲染）
- 路径别名统一使用 `@/`（指向 `src/`）
- 状态修改使用 `get().syncToDB()` 自动同步 IndexedDB
- 工具函数命名：`camelCase`，常量：`UPPER_SNAKE_CASE`
- 组件文件：`PascalCase.tsx`，Hook：`use*.ts`

#### 已知限制
1. 开发服务器响应超时（生产模式正常）✅
2. 窗口只能右/下边缘调整大小（左/上未实现）
3. 暂无真实应用内容（所有窗口显示 "App Coming Soon" 占位）
4. 未实现 Snap 布局
5. 未实现键盘快捷键
6. **✅ Bug 1 已修复**：页面刷新后窗口重新出现的问题
7. **✅ Bug 2 已修复**：堆叠窗口需要双击才能关闭的问题
8. **✅ 窗口样式已优化**：高对比度设计便于测试

---

### 🔗 References (参考资料)

- **Material Design 3**: https://m3.material.io/
- **Next.js 16 Docs**: https://nextjs.org/docs
- **Zustand Docs**: https://zustand-demo.pmnd.rs/
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS v4**: https://tailwindcss.com/blog/tailwindcss-v4-alpha

---

## Summary (总结)

### 📊 完成度
- **Phase 1（基础架构）**: 100% ✅
- **Phase 2（核心应用）**: 0% （待开始）
- **Phase 3（高级功能）**: 0% （待开始）
- **Phase 4（优化与适配）**: 0% （待开始）

### 🎯 总体进度
**已完成约 30%**（基础架构和窗口系统完整，但应用内容待实现）

### ⏱️ 预计时间线
- **Sprint 2（核心应用）**: 1-2 周
- **Sprint 3（高级功能）**: 1 周
- **Sprint 4（优化与适配）**: 1 周
- **总计**: 3-4 周完成 MVP

---

*最后更新: 2026-01-12*
*维护者: OpenCode Assistant*

# Project Status: ChromeOS-Web Replica

## 📅 Last Updated: 2026-01-31
## 🎯 Current Milestone: Phase 1 - Foundation & Desktop Customization ✅ COMPLETE

---

### ✅ Completed (已完成)

#### Phase 1: 基础架构与桌面自定义功能
   - [x] **Desktop Right-Click Menu**
   - Created generic `ContextMenu.tsx` component (dynamic items, smart positioning, click outside to close)
   - ChromeOS styling (white/dark auto theme switching)
   - Smart positioning algorithm (prevents overflow at screen edges)
   - Left-aligned menu items (justify-start + text-left)
   - Menu items: "Change Wallpaper", separator, "Refresh"

- [x] **Wallpaper Changer Window (Proper App Window)**
   - Created `src/components/apps/WallpaperApp.tsx` (not a modal panel)
   - Created `src/lib/wallpapers.ts` (wallpaper presets config)
   - Window size: 800x700, centered by default
   - Three window controls: minimize, maximize, close
   - Draggable and resizable
   - Preset wallpapers grid (6 gradients + 6 solid colors)
   - Wallpaper cards (preview + name + checkmark indicator)
   - Custom image upload (supports JPG, PNG, WebP, max 2MB)
   - File type validation and size validation
   - Window stays open after selection (for continuous browsing)
   - ChromeOS styling (rounded corners, shadows, animations)

- [x] **Shelf Customization**
   - Right-click menu on shelf non-button areas
   - Shelf position options: Bottom, Left, Right
   - Smooth transitions when changing position (300ms ease-in-out)
   - Dynamic panel positioning (Launcher, Calendar, SystemTrayPanel adapt to shelf position)
   - Fixed initialization bug: shelf no longer disappears after page refresh
   - Launcher appears near circle button (top in left/right modes, bottom in bottom mode)
   - All English labels (Bottom, Left, Right)

- [x] **壁纸配置系统**
  - 定义 `WallpaperPreset` 接口和 `WallpaperType` 类型
  - 预设壁纸数组（`GRADIENT_WALLPAPERS`、`SOLID_WALLPAPERS`）
  - 纯色壁纸 value 不带 'bg-' 前缀（white, surface-95 等）
  - 所有预设壁纸导出（`ALL_PRESETS`）

- [x] **状态管理扩展**
  - 扩展 `SystemSettings` 接口添加 `wallpaper` 和 `wallpaperType`
  - 添加 `updateWallpaper` 动作（支持三种壁纸类型）
  - 壁纸状态持久化（IndexedDB + localStorage）
  - 默认壁纸设置（渐变：surface-90 → surface-80）
  - 添加窗口打开智能逻辑：检查是否存在、恢复最小化、置顶

- [x] **桌面组件更新**
  - 修改 `Desktop.tsx` 添加右键事件处理（`onContextMenu`）
  - 动态壁纸样式应用（渐变、纯色、自定义图片）
  - 纯色壁纸修复：使用 `bg-${settings.wallpaper}` 正确生成 Tailwind 类名
  - 自定义壁纸内联样式应用（避免 Tailwind CSS 解析问题）
  - 右键菜单渲染和状态管理
  - key prop 强制组件重新渲染（解决纯色壁纸不更新的问题）

- [x] **窗口管理器更新**
  - 修改 `WindowManager.tsx` 添加 WallpaperApp 支持
  - 窗口标题栏图标处理：壁纸窗口不显示图标
  - 条件渲染：壁纸窗口显示 WallpaperApp，其他窗口显示占位符

- [x] **常量配置扩展**
  - 添加 `WALLPAPER_WINDOW_WIDTH = 800`
  - 添加 `WALLPAPER_WINDOW_HEIGHT = 700`
  - 壁纸窗口居中算法：考虑 shelf 高度

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

   - [x] **Launcher.tsx - App Drawer**
    - Search box (with fuzzy filtering)
    - App grid (6-column layout)
    - Real-time search filtering
    - Smooth animation transitions (Framer Motion)
    - Dark background (#111827)
    - Compact size (width 40%, height 66.67%)
    - Dynamic positioning based on shelf position:
      - Bottom shelf: bottom-left (bottom: 80px, left: 24px)
      - Left shelf: top-left (top: 24px, left: 80px)
      - Right shelf: top-right (top: 24px, right: 80px)
    - Click outside to auto-close
    - No full-screen overlay
    - z-index: 10000 (always above windows)

   - [x] **Calendar.tsx - Calendar Component**
     - Monthly calendar view (7-column grid layout)
     - Previous/next month navigation buttons
     - Day headers (Su, Mo, Tu, We, Th, Fr, Sa)
     - Highlight today's date (purple background)
     - Click date to close calendar
     - Dark background (`bg-surface-10`)
     - Rounded corners 24px (`rounded-3xl`)
     - Dynamic positioning based on shelf position:
      - Bottom shelf: bottom-right (bottom: 80px, right: 6px)
      - Left shelf: bottom-left (bottom: 6px, left: 80px)
      - Right shelf: bottom-right (bottom: 6px, right: 80px)
     - Width: 320px (`w-80`)
     - Click outside to auto-close
     - High contrast design (light text `text-surface-90`)

   - [x] **SystemTrayPanel.tsx - System Tray Panel**
     - Brightness slider (draggable, based on Radix UI Slider)
     - Volume slider (draggable)
     - WiFi / Sleep / Power quick action buttons (3-column grid)
     - Dark background (`bg-surface-10`)
     - Rounded corners 24px (`rounded-3xl`)
     - Dynamic positioning based on shelf position:
      - Bottom shelf: bottom-right (bottom: 80px, right: 24px)
      - Left shelf: bottom-left (bottom: 24px, left: 80px)
      - Right shelf: bottom-right (bottom: 24px, right: 80px)
     - Width: 320px (`w-80`)
     - Click outside to auto-close
     - M3 shadow effect (`shadow-m3-5`)

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

**Bug 9: Solid Color Wallpapers Not Changing**
- **现象**: 选择纯色壁纸后，桌面背景不更新
- **影响**: 严重，壁纸功能无法正常使用
- **根因**: `getWallpaperStyle()` 函数会去掉纯色壁纸的 'bg-' 前缀，但 wallpapers.ts 中 value 定义为 'bg-white'，导致 Tailwind 无法识别类名
- **修复**:
  - 修改 `wallpapers.ts`：纯色壁纸 value 去掉 'bg-' 前缀（'bg-white' → 'white'）
  - 修改 `getWallpaperStyle()`：solid 类型返回 `bg-${settings.wallpaper}`，动态添加前缀
  - **文件修改**: `src/lib/wallpapers.ts`, `src/components/shell/Desktop.tsx`
  - **测试状态**: ✅ 已验证，纯色壁纸可以正常切换

**Bug 11: Shelf Disappears After Page Refresh**
- **现象**: 页面刷新后 shelf 完全消失
- **影响**: 严重，核心功能无法使用
- **根因**: `initializeFromDB()` 使用 `settings || createDefaultSettings()`，如果旧 settings 存在（添加 `shelfPosition` 之前），`shelfPosition` 为 `undefined`，导致 shelf 没有定位类名
- **修复**:
  - 修改 `initializeFromDB()`：合并默认值和旧设置 `{ ...createDefaultSettings(), ...(settings || {}) }`
  - 确保 `shelfPosition` 始终有默认值 `'bottom'`
  - **文件修改**: `src/store/useWindowStore.ts`
  - **测试状态**: ✅ 已验证，shelf 在刷新后始终显示

**Bug 12: Panel Positioning Incorrect After Shelf Position Change**
- **现象**: Launcher、Calendar、SystemTrayPanel 使用硬编码定位，切换 shelf 位置后面板位置不正确
- **影响**: 中等，影响用户体验
- **根因**: 使用 Tailwind 类名硬编码定位（`bottom-20 left-6` 等），没有考虑 `shelfPosition`
- **修复**:
  - 为 Launcher.tsx、Calendar.tsx、SystemTrayPanel.tsx 添加 `getPositionStyle()` 函数
  - 使用 inline styles 动态定位（避免 CSS 冲突）
  - 根据 `shelfPosition` 计算位置：底部、左侧、右侧
  - Launcher 在左右模式时显示在顶部（接近圆形按钮）
  - **文件修改**: `src/components/shell/Launcher.tsx`, `src/components/shell/Calendar.tsx`, `src/components/shell/SystemTrayPanel.tsx`, `src/components/shell/Shelf.tsx`
  - **测试状态**: ✅ 已验证，所有面板根据 shelf 位置正确显示

**Bug 10: 右键菜单文字居中对齐**
- **现象**: 右键菜单项的文字居中显示，而不是左对齐
- **影响**: 中等，影响用户体验
- **根因**: 文本 span 使用了 `flex-1` 类，导致占据剩余空间，可能影响对齐
- **修复**:
  - 移除文本 span 的 `flex-1` 类
  - 保留 `justify-start` 和 `text-left` 类
  - **文件修改**: `src/components/ui/ContextMenu.tsx`
  - **测试状态**: ✅ 已验证，菜单文字左对齐

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

#### Phase 1: 基础架构与桌面自定义功能（优先级：高）✅ COMPLETED

**1. 桌面右键菜单** ⭐ ✅
- [x] 创建 `src/components/ui/ContextMenu.tsx` - 通用右键菜单组件
- [x] ChromeOS 风格菜单（白色/深色自动跟随主题）
- [x] 智能定位（避免超出屏幕）
- [x] 点击外部自动关闭
- [x] 支持分隔线和禁用状态
- [x] 菜单项左对齐（justify-start + text-left）

**2. 壁纸更改功能** ⭐ ✅
- [x] 创建 `src/lib/wallpapers.ts` - 预设壁纸配置
- [x] 创建 `src/components/apps/WallpaperApp.tsx` - 壁纸选择窗口
- [x] 窗口大小：800x700，默认居中
- [x] 支持预设壁纸（6 种渐变 + 6 种纯色）
- [x] 支持上传本地图片（data URL 存储）
- [x] 壁纸预览功能（色块/渐变预览）
- [x] 文件类型验证（JPG、PNG、WebP）
- [x] 文件大小限制（< 2MB）
- [x] 选择壁纸后窗口保持打开
- [x] 智能窗口恢复逻辑

**3. 状态管理扩展** ⭐ ✅
- [x] 扩展 `SystemSettings` 接口添加 `wallpaper` 和 `wallpaperType`
- [x] 添加 `updateWallpaper` 动作
- [x] 壁纸状态持久化（IndexedDB + localStorage）
- [x] 更新默认壁纸设置
- [x] 窗口打开智能逻辑（检查/恢复/置顶）

**4. 桌面组件更新** ⭐ ✅
- [x] 修改 `src/components/shell/Desktop.tsx` 添加右键事件处理
- [x] 根据壁纸设置应用样式（渐变、纯色、自定义图片）
- [x] 纯色壁纸修复：动态添加 bg- 前缀
- [x] 自定义壁纸内联样式应用（避免 Tailwind CSS 解析问题）
- [x] 右键菜单渲染和状态管理
- [x] key prop 强制重新渲染（解决纯色壁纸更新问题）

**5. 窗口管理器更新** ⭐ ✅
- [x] 修改 `src/components/window/WindowManager.tsx` 添加 WallpaperApp 支持
- [x] 壁纸窗口不显示标题栏图标
- [x] 条件渲染 WallpaperApp 和占位符

**6. 常量配置扩展** ⭐ ✅
- [x] 添加 `WALLPAPER_WINDOW_WIDTH` 和 `WALLPAPER_WINDOW_HEIGHT`
- [x] 壁纸窗口居中算法

### 技术实现说明

**右键菜单定位算法**：
```typescript
const calculatePosition = (x: number, y: number) => {
  let adjustedX = x
  let adjustedY = y

  // 防止超出右边界
  if (x + MENU_WIDTH + PADDING > window.innerWidth) {
    adjustedX = window.innerWidth - MENU_WIDTH - PADDING
  }

  // 防止超出下边界
  const estimatedHeight = items.length * 40 + 20
  if (y + estimatedHeight + PADDING > window.innerHeight) {
    adjustedY = window.innerHeight - estimatedHeight - PADDING
  }

  return { x: adjustedX, y: adjustedY }
}
```

**图片上传处理**：
- 使用 `FileReader` API 将图片转换为 data URL
- 验证文件类型（`image/*`）
- 验证文件大小（< 2MB）
- 错误处理（格式不支持、大小超限）

**壁纸样式应用**：
- 渐变壁纸：`bg-gradient-to-br ${wallpaper}`（Tailwind 类）
- 纯色壁纸：`bg-${wallpaper.replace('bg-', '')}`（Tailwind 类）
- 自定义壁纸：内联样式 `style={{ backgroundImage: 'url(...)' }}`（避免 CSS 解析问题）

**状态持久化**：
- `updateWallpaper` 动作自动触发 `syncToDB()`
- 壁纸设置保存到 IndexedDB
- 刷新页面后壁纸自动恢复

**已知限制**：
1. **localStorage 存储限制**：data URL 可能较大，超出 5-10MB 限制
   - **缓解措施**：限制上传图片 < 2MB
   - **未来改进**：使用 IndexedDB 存储图片

2. **自定义图片预览**：当前不在上传前预览
   - **未来改进**：添加图片预览窗口

3. **移动端兼容性**：右键菜单在移动端不适用
   - **缓解措施**：添加长按支持（未来）

### 构建验证
- ✅ TypeScript 编译无错误
- ✅ Turbopack 构建成功
- ✅ 静态页面生成成功
- ✅ 生产服务器启动成功

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
- **Phase 1（基础架构与桌面自定义）**: 100% ✅
- **Phase 2（核心应用）**: 0% （待开始）
- **Phase 3（高级功能）**: 0% （待开始）
- **Phase 4（优化与适配）**: 0% （待开始）

### 🎯 总体进度
**已完成约 40%**（基础架构、窗口系统、桌面自定义功能、Shelf 定制完整，但核心应用待实现）

### ⏱️ 预计时间线
- **Phase 2（核心应用）**: 1-2 周
- **Phase 3（高级功能）**: 1 周
- **Phase 4（优化与适配）**: 1 周
- **总计**: 3-4 周完成 MVP

---

*最后更新: 2026-01-31*
*维护者: OpenCode Assistant*

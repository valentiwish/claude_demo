# NoteFlow - 高级笔记应用产品需求文档

**版本:** 1.0
**日期:** 2026-03-21
**状态:** 草稿

---

## 1. 产品概述

### 1.1 产品定位

**NoteFlow** 是一款融合 AI 能力、专注于书写体验与知识整理的高级笔记工具。它将优雅的界面设计、强大的编辑功能与智能 AI 助手融为一体，帮助用户高效地记录、组织和发现知识。

### 1.2 核心价值主张

| 价值主张 | 描述 |
|---------|------|
| 沉浸式书写 | 极简界面，无干扰的专注写作体验 |
| 自由整理 | 灵活的文件夹系统，按需组织知识 |
| AI 赋能 | 智能助手让笔记管理事半功倍 |

### 1.3 目标平台

- **Web 应用:** 浏览器直接访问，无需安装
- **桌面端:** Windows/macOS 原生应用 (Electron)

---

## 2. 目标用户

| 用户群体 | 核心需求 | 使用场景 |
|---------|---------|---------|
| 知识工作者 | 高效记录与整理 | 会议纪要、项目文档、头脑风暴 |
| 内容创作者 | 专注写作 | 博客文章、剧本、小说 |
| 学生 | 知识管理 | 课堂笔记、复习资料、考试整理 |
| 研究人员 | 文献笔记 | 论文笔记、资料收集、文献管理 |

---

## 3. 信息架构

### 3.1 产品结构

```
┌─────────────────────────────────────────────────────────────┐
│                        NoteFlow                              │
├────────────────┬────────────────────────────────────────────┤
│                │                                             │
│   Sidebar      │              Main Content                   │
│   (侧边栏)      │                                             │
│                │  ┌─────────────────────────────────────────┐│
│  ┌──────────┐ │  │           Editor (编辑器)                ││
│  │ Search    │ │  │                                         ││
│  └──────────┘ │  │  [Title]                                 ││
│                │  │                                         ││
│  ┌──────────┐ │  │  [Content Area]                          ││
│  │ AI Btn   │ │  │                                         ││
│  └──────────┘ │  │                                         ││
│                │  │                                         ││
│  Folder Tree   │  │                                         ││
│  ├ Favorites   │  └─────────────────────────────────────────┘│
│  ├ Recent      │                                             │
│  └ Folders     │  ┌─────────────────────────────────────────┐│
│    └ Subfolders│  │         AI Panel (可收起)               ││
│                │  │  ┌─────────────────────────────────┐   ││
│  ┌──────────┐ │  │  │ Chat Messages                    │   ││
│  │ Note List │ │  │  └─────────────────────────────────┘   ││
│  └──────────┘ │  │  [Input Field]              [Send]      ││
│                │  └─────────────────────────────────────────┘│
└────────────────┴────────────────────────────────────────────┘
```

### 3.2 导航流程

```
用户进入应用
    │
    ├── 侧边栏显示
    │   ├── 收藏夹 (Favorites)
    │   ├── 最近笔记 (Recent)
    │   ├── 所有文件夹 (Folders)
    │   └── 笔记列表 (Notes)
    │
    ├── 点击文件夹 → 展开子文件夹 + 显示该文件夹下的笔记
    ├── 点击笔记 → 在编辑器中打开
    └── 点击 AI 按钮 → 展开 AI 助手面板
```

---

## 4. 功能需求

### 4.1 笔记管理 (P0 - 必须)

#### 4.1.1 创建笔记
- **触发方式:** 侧边栏 "New Note" 按钮 / 快捷键 `Cmd/Ctrl + N`
- **默认行为:**
  - 创建空白笔记，标题自动聚焦
  - 自动分配唯一 ID
  - 默认添加到当前选中的文件夹
  - 自动保存到 IndexedDB

#### 4.1.2 编辑笔记
- **编辑器:** TipTap (基于 ProseMirror)
- **支持格式:**
  - 标题 (H1, H2, H3)
  - 粗体、斜体、删除线
  - 有序/无序列表
  - 任务列表 (Checkbox)
  - 代码块 (语法高亮，支持 20+ 语言)
  - 引用块
  - 水平分割线
  - 链接与图片
  - 表格

#### 4.1.3 删除笔记
- **删除行为:** 软删除，移动至回收站
- **回收站保留时间:** 30 天后自动永久删除
- **恢复功能:** 可从回收站恢复

#### 4.1.4 搜索功能
- **搜索范围:** 笔记标题 + 正文内容
- **匹配高亮:** 搜索结果中匹配文字高亮显示
- **实时搜索:** 输入即搜索，300ms 防抖

### 4.2 文件夹管理 (P0 - 必须)

| 功能 | 描述 |
|-----|------|
| 创建文件夹 | 支持创建根文件夹和子文件夹 |
| 重命名 | 长按/右键菜单重命名 |
| 删除文件夹 | 确认后删除，文件夹内笔记移至"未分类" |
| 拖拽排序 | 拖拽调整文件夹顺序 |
| 嵌套支持 | 支持多层级嵌套 (建议最多 3 层) |

### 4.3 编辑器增强功能 (P1 - 重要)

| 功能 | 描述 | 优先级 |
|-----|------|:------:|
| Markdown 快捷语法 | `#` 标题、`-` 列表等 | P0 |
| 实时字数统计 | 字数、字符数、阅读时间 | P1 |
| LaTeX 数学公式 | 行内公式 `$...$`，块级公式 `$$...$$` | P1 |
| 快捷键支持 | `Cmd/Ctrl + B` 加粗、`Cmd/Ctrl + S` 保存等 | P0 |
| 自动保存 | 编辑后 1s 自动保存 | P0 |
| 撤销/重做 | 多步历史记录 | P0 |

### 4.4 AI 功能 (P1 - 重要)

#### 4.4.1 AI 写作助手
- **续写:** 基于当前内容续写下文
- **扩写:** 扩展当前段落内容
- **缩写:** 精简当前内容
- **语气调整:** 正式/轻松/简洁

#### 4.4.2 摘要生成
- 一键生成当前笔记的摘要
- 可选择摘要长度 (简短/中等/详细)

#### 4.4.3 智能标签
- AI 分析笔记内容
- 推荐相关标签
- 一键添加到笔记

#### 4.4.4 问答功能
- 基于当前笔记内容提问
- AI 总结整理信息

### 4.5 收藏与排序 (P1 - 重要)

- **收藏笔记:** 点击星标收藏
- **排序选项:** 创建时间、修改时间、标题字母序
- **筛选选项:** 全部笔记、收藏夹、最近 7 天

---

## 5. UI/UX 设计规范

### 5.1 设计原则

1. **极简主义** - 减少视觉干扰，聚焦内容
2. **一致性** - 统一的视觉语言和交互模式
3. **可发现性** - 功能直观可见，易于理解
4. **响应式** - 适配不同屏幕尺寸

### 5.2 色彩系统

#### Light Mode

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg-primary` | `#FFFFFF` | 主背景 |
| `--bg-secondary` | `#F7F8FA` | 侧边栏背景 |
| `--bg-tertiary` | `#F0F1F3` | 悬停/选中背景 |
| `--text-primary` | `#1F2937` | 主标题/正文 |
| `--text-secondary` | `#6B7280` | 次要文字/占位符 |
| `--text-muted` | `#9CA3AF` | 禁用文字 |
| `--accent-primary` | `#6366F1` | 主按钮/链接 (Indigo) |
| `--accent-hover` | `#4F46E5` | 主按钮悬停 |
| `--accent-secondary` | `#10B981` | 成功/确认 (Emerald) |
| `--accent-warning` | `#F59E0B` | 警告 (Amber) |
| `--accent-danger` | `#EF4444` | 危险/删除 (Red) |
| `--border` | `#E5E7EB` | 边框/分割线 |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 小阴影 |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | 中阴影 |

#### Dark Mode

| Token | 色值 |
|-------|------|
| `--bg-primary` | `#1A1A2E` |
| `--bg-secondary` | `#16213E` |
| `--bg-tertiary` | `#1F2937` |
| `--text-primary` | `#F9FAFB` |
| `--text-secondary` | `#9CA3AF` |
| `--text-muted` | `#6B7280` |
| `--accent-primary` | `#818CF8` |
| `--accent-hover` | `#A5B4FC` |
| `--accent-secondary` | `#34D399` |
| `--accent-warning` | `#FBBF24` |
| `--accent-danger` | `#F87171` |
| `--border` | `#374151` |

### 5.3 字体系统

| 用途 | 字体 | 字号 | 字重 |
|-----|------|------|------|
| App Logo | Inter | 20px | 700 |
| H1 (笔记标题) | Inter | 28px | 700 |
| H2 | Inter | 22px | 600 |
| H3 | Inter | 18px | 600 |
| Body (正文) | Inter | 15px | 400 |
| Small (辅助文字) | Inter | 13px | 400 |
| Code | JetBrains Mono | 14px | 400 |
| Sidebar Item | Inter | 14px | 500 |
| Button | Inter | 14px | 500 |

### 5.4 间距系统

| Token | 数值 | 用途 |
|-------|------|------|
| `--space-1` | 4px | 微间距 |
| `--space-2` | 8px | 小间距 |
| `--space-3` | 12px | 组件内间距 |
| `--space-4` | 16px | 标准间距 |
| `--space-5` | 20px | 中等间距 |
| `--space-6` | 24px | 大间距 |
| `--space-8` | 32px | 区块间距 |

### 5.5 布局尺寸

| 元素 | 尺寸 |
|-----|------|
| 侧边栏宽度 (展开) | 260px |
| 侧边栏宽度 (折叠) | 60px |
| 编辑器最大宽度 | 720px |
| AI 面板宽度 | 360px |
| 圆角 (小) | 4px |
| 圆角 (中) | 8px |
| 圆角 (大) | 12px |

### 5.6 动效规范

| 交互 | 时长 | 缓动函数 | 用途 |
|-----|------|---------|------|
| 侧边栏展开/收起 | 250ms | ease-out | 面板切换 |
| AI 面板滑入/出 | 300ms | ease-out | 面板切换 |
| 按钮悬停 | 150ms | ease | 颜色/阴影变化 |
| 笔记列表项悬停 | 150ms | ease | 背景色变化 |
| Toast 提示 | 300ms | ease | 显示/隐藏 |
| 模态框出现 | 200ms | ease-out | 弹窗动画 |
| 下拉菜单 | 150ms | ease | 展开/收起 |

---

## 6. 技术架构

### 6.1 技术栈

| 层级 | 技术 | 说明 |
|-----|------|------|
| 框架 | React 18 + TypeScript | 类型安全，组件化 |
| 构建 | Vite | 快速开发体验 |
| 状态管理 | Zustand | 轻量级状态管理 |
| 编辑器 | TipTap 2 | ProseMirror 封装，扩展性强 |
| 样式 | Tailwind CSS | 原子化 CSS |
| 存储 | IndexedDB (Dexie.js) | 本地持久化 |
| AI | Claude API / OpenAI API | AI 功能实现 |
| 桌面端 | Electron | 跨平台桌面应用 |

### 6.2 项目结构

```
noteflow/
├── electron/                 # Electron 主进程
│   └── main.ts
├── src/
│   ├── components/           # React 组件
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── FolderTree.tsx
│   │   │   ├── NoteList.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── Editor/
│   │   │   ├── Editor.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   └── TitleInput.tsx
│   │   ├── AI_Panel/
│   │   │   ├── AIPanel.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── AIQuickActions.tsx
│   │   ├── ui/               # 通用组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Dropdown.tsx
│   │   └── Layout/
│   │       └── AppLayout.tsx
│   ├── stores/               # Zustand stores
│   │   ├── noteStore.ts
│   │   ├── folderStore.ts
│   │   ├── uiStore.ts
│   │   └── aiStore.ts
│   ├── hooks/                # 自定义 hooks
│   │   ├── useNotes.ts
│   │   ├── useFolders.ts
│   │   └── useAI.ts
│   ├── lib/
│   │   ├── db.ts            # IndexedDB 操作 (Dexie)
│   │   ├── ai.ts            # AI API 调用
│   │   ├── utils.ts         # 工具函数
│   │   └── constants.ts     # 常量定义
│   ├── types/
│   │   └── index.ts         # TypeScript 类型定义
│   ├── styles/
│   │   └── globals.css      # 全局样式 + CSS 变量
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── electron-builder.json
```

### 6.3 数据模型

```typescript
// 笔记
interface Note {
  id: string;              // UUID
  title: string;           // 笔记标题
  content: string;         // TipTap JSON 格式内容
  folderId: string | null; // 所属文件夹 null = 根目录
  tags: string[];          // 标签列表
  isFavorite: boolean;     // 是否收藏
  createdAt: number;       // 创建时间戳
  updatedAt: number;       // 更新时间戳
  deletedAt: number | null; // 删除时间戳 null = 未删除
}

// 文件夹
interface Folder {
  id: string;              // UUID
  name: string;            // 文件夹名称
  parentId: string | null; // 父文件夹 null = 根目录
  order: number;           // 排序顺序
  createdAt: number;
  updatedAt: number;
}

// AI 对话
interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIConversation {
  id: string;
  noteId: string;
  messages: AIMessage[];
}

// 用户设置
interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  autoSaveInterval: number; // ms
  aiProvider: 'claude' | 'openai';
  aiApiKey?: string;
}
```

### 6.4 IndexedDB Schema

```typescript
// Dexie 数据库定义
const db = new Dexie('NoteFlowDB');

db.version(1).stores({
  notes: '++id, title, folderId, *tags, isFavorite, createdAt, updatedAt, deletedAt',
  folders: '++id, name, parentId, order, createdAt',
  settings: 'key',
  aiConversations: '++id, noteId'
});
```

---

## 7. MVP 版本规划

### Phase 1: MVP (v1.0) - 核心体验

**目标:** 实现笔记应用的核心功能

| 功能 | 验收标准 |
|-----|---------|
| 笔记 CRUD | 可创建、编辑、删除、恢复笔记 |
| 富文本编辑 | 支持标题、列表、代码块、任务列表 |
| 文件夹管理 | 可创建、重命名、删除文件夹 |
| 搜索 | 可搜索标题和内容 |
| 自动保存 | 编辑后自动保存，无数据丢失 |
| Dark Mode | 支持深色/浅色主题切换 |
| 本地存储 | 数据持久化到 IndexedDB |

### Phase 2: 增强 (v1.1)

| 功能 | 描述 |
|-----|------|
| AI 写作助手 | 续写、扩写、缩写 |
| 标签系统 | 添加和管理标签 |
| 字数统计 | 实时显示字数统计 |
| 导出功能 | 导出为 Markdown/PDF |

### Phase 3: 高级 (v1.2)

| 功能 | 描述 |
|-----|------|
| AI 问答 | 基于笔记内容问答 |
| 智能标签 | AI 推荐标签 |
| 云端同步 | 可选的云同步 |
| 桌面应用 | Electron 桌面端 |

---

## 8. 性能要求

| 指标 | 目标值 | 测量方法 |
|-----|-------|---------|
| 首屏加载时间 | < 2s | Lighthouse |
| 笔记保存延迟 | < 100ms | 性能 API |
| 编辑器输入延迟 | < 50ms | 实际体验 |
| 搜索响应时间 | < 300ms | 1000 条笔记 |
| 内存占用 | < 200MB | DevTools |

---

## 9. 可访问性要求

- 所有交互元素可通过键盘操作
- 图片必须包含 alt 文字
- 颜色对比度符合 WCAG 2.1 AA 标准
- 支持屏幕阅读器 (ARIA 标签)
- 支持系统级字体缩放

---

## 10. 未来扩展方向

| 方向 | 描述 |
|-----|------|
| 协作功能 | 实时多人协作编辑 |
| 插件系统 | 支持第三方插件扩展 |
| API 接口 | 开放 API 供开发者集成 |
| 移动端应用 | iOS/Android 原生应用 |
| 版本历史 | 笔记版本管理与回溯 |

---

## 附录

### A. 术语表

| 术语 | 定义 |
|-----|------|
| TipTap | 基于 ProseMirror 的富文本编辑器框架 |
| IndexedDB | 浏览器内置的本地数据库 |
| Dexie.js | IndexedDB 的 Promise 封装库 |
| Zustand | 轻量级 React 状态管理库 |

### B. 参考产品

- **Notion** - 笔记与知识管理
- **Obsidian** - Markdown 笔记与双向链接
- **Craft** - 精美设计的笔记应用
- **Logseq** - 大纲笔记与知识图谱

### C. 联系人

| 角色 | 职责 |
|-----|------|
| 产品负责人 | 需求决策与优先级 |
| 设计负责人 | UI/UX 设计规范 |
| 技术负责人 | 技术架构与实现 |
| QA 负责人 | 测试与质量保证 |

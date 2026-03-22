# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

NoteFlow 是一款具备 AI 能力的高级笔记应用，采用前后端分离架构：
- **前端**: React + TypeScript + Vite (端口 5173)
- **后端**: Express.js + MySQL (端口 3001)

## 常用命令

```bash
# 同时启动前端和后端
npm run dev

# 仅前端 (Vite 开发服务器)
npm run dev:frontend

# 仅后端 (Express 服务器)
cd server && npm run dev

# 构建前端
npm run build

# 代码检查
npm run lint
```

## 架构

```
React (5173) → Express.js API (3001) → MySQL 5.7 (3306)
```

**技术栈：**
- **状态管理**: Zustand (`src/stores/`)
- **富文本编辑器**: TipTap 2 (基于 ProseMirror)
- **样式**: Tailwind CSS (`tailwind.config.js`, `postcss.config.js`)
- **API 层**: Axios，通过 Vite 代理到 `/api`
- **后端路由**: Express 路由器，位于 `server/src/routes/`
- **数据库**: MySQL 5.7，mysql2 驱动

**前端结构：**
- `src/components/` - React 组件
  - `Sidebar/` - 侧边栏 (Sidebar.tsx, FolderTree.tsx, NoteList.tsx, SearchBar.tsx)
  - `Editor/` - 编辑器 (Editor.tsx, Toolbar.tsx)
  - `AI_Panel/` - AI 面板 (AIPanel.tsx)
  - `ui/` - 通用 UI 组件 (Button.tsx, Input.tsx, Icons.tsx)
- `src/stores/` - Zustand 状态存储 (noteStore, folderStore, uiStore)
- `src/lib/api.ts` - Axios API 客户端
- `src/lib/db.ts` - Dexie/IndexedDB (已保留但未使用，数据存储迁移至 MySQL)
- `src/styles/index.css` - Tailwind 全局样式
- `src/types/index.ts` - TypeScript 类型定义 (Note, Folder)

**后端结构：**
- `server/src/index.ts` - Express 入口
- `server/src/routes/` - notes.ts, folders.ts API 路由
- `server/src/config/database.ts` - MySQL 连接池

**数据库**: MySQL 5.7，端口 3306，数据库名 `noteflow`，包含 `notes` 和 `folders` 表。

Vite 代理配置将 `/api` 请求转发到 `http://localhost:3001`。

## 备注

`PRD.md` 和 `PLAN.md` 包含详细的产品需求和实现计划，可供参考。
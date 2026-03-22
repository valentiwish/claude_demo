# NoteFlow - 重构为 Express.js + MySQL 架构

## Context

用户反馈笔记刷新后消失，排查确认 IndexedDB 在某些环境下不稳定。用户已提供 MySQL 5.7 连接信息，要求迁移到 MySQL 存储。

**方案:** Express.js 后端 + React 前端，前后端分离架构

---

## 架构

```
React (5173)  →  Express.js API (3001)  →  MySQL 5.7 (3306)
```

**技术栈:** React + TypeScript + Vite + Zustand + Axios + Express.js + mysql2

---

## 项目结构

```
noteflow/
├── server/                    # 后端
│   ├── src/
│   │   ├── index.ts          # Express 入口 (端口 3001)
│   │   ├── config/database.ts # MySQL 连接池
│   │   ├── routes/
│   │   │   ├── notes.ts      # 笔记 CRUD 路由
│   │   │   └── folders.ts    # 文件夹 CRUD 路由
│   │   └── types/index.ts
│   └── package.json
│
└── src/                       # 前端
    ├── lib/api.ts            # API 请求封装 (新增)
    ├── stores/noteStore.ts   # 改用 API
    ├── stores/folderStore.ts  # 改用 API
    └── lib/db.ts             # 保留但不使用
```

---

## MySQL 表结构

```sql
CREATE DATABASE IF NOT EXISTS noteflow DEFAULT CHARSET utf8mb4;

CREATE TABLE notes (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT '无标题笔记',
    content LONGTEXT,
    folder_id VARCHAR(36) DEFAULT NULL,
    tags JSON DEFAULT NULL,
    is_favorite TINYINT(1) DEFAULT 0,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    deleted_at BIGINT DEFAULT NULL,
    INDEX idx_folder_id (folder_id),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE folders (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id VARCHAR(36) DEFAULT NULL,
    folder_order INT DEFAULT 0,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## API 设计

**基础 URL:** `http://localhost:3001/api`

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | `/api/notes` | 获取所有笔记 |
| POST | `/api/notes` | 创建笔记 |
| PUT | `/api/notes/:id` | 更新笔记 |
| DELETE | `/api/notes/:id` | 软删除笔记 |
| GET | `/api/notes/search?q=` | 搜索笔记 |
| GET | `/api/folders` | 获取所有文件夹 |
| POST | `/api/folders` | 创建文件夹 |
| PUT | `/api/folders/:id` | 更新文件夹 |
| DELETE | `/api/folders/:id` | 删除文件夹 |

---

## 数据库连接

```typescript
host: 'localhost'
port: 3306
user: 'root'
password: 'admin'
database: 'noteflow'
```

---

## 实施步骤

1. **创建后端项目** - server/ 目录、package.json、TypeScript 配置
2. **实现 MySQL 连接** - mysql2 连接池配置
3. **实现 API 路由** - 笔记和文件夹 CRUD
4. **初始化数据库** - 创建表和示例数据
5. **更新前端** - 替换 IndexedDB 为 API 调用
6. **配置跨域** - CORS + Vite 代理

---

## 关键文件

| 文件 | 操作 |
|-----|------|
| `server/src/config/database.ts` | 新增 |
| `server/src/routes/notes.ts` | 新增 |
| `server/src/routes/folders.ts` | 新增 |
| `server/src/index.ts` | 新增 |
| `src/lib/api.ts` | 新增 |
| `src/stores/noteStore.ts` | 修改 |
| `src/stores/folderStore.ts` | 修改 |
| `src/lib/db.ts` | 保留（可选删除） |

---

## 验证

1. 启动后端: `cd server && npm run dev`
2. 启动前端: `npm run dev`
3. 测试: 创建笔记 → 刷新 → 笔记仍存在

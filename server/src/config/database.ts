import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'admin',
};

let pool: mysql.Pool;

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.execute('CREATE DATABASE IF NOT EXISTS noteflow DEFAULT CHARACTER SET utf8mb4');
    console.log('Database noteflow ensured');
  } finally {
    await connection.end();
  }
}

export async function initDatabase(): Promise<mysql.Pool> {
  // First create database if not exists
  await createDatabaseIfNotExists();

  // Now create pool with database
  pool = mysql.createPool({
    ...dbConfig,
    database: 'noteflow',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const connection = await pool.getConnection();
  try {
    // Create notes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notes (
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
        INDEX idx_deleted_at (deleted_at),
        INDEX idx_updated_at (updated_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create folders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS folders (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parent_id VARCHAR(36) DEFAULT NULL,
        folder_order INT DEFAULT 0,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        INDEX idx_parent_id (parent_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Insert default folder if not exists
    await connection.execute(`
      INSERT IGNORE INTO folders (id, name, parent_id, folder_order, created_at, updated_at)
      VALUES ('default', '我的笔记', NULL, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000)
    `);

    // Insert welcome note if not exists
    const [existing] = await connection.execute(
      'SELECT id FROM notes WHERE id = ?',
      ['welcome']
    ) as any;

    if (existing.length === 0) {
      await connection.execute(`
        INSERT INTO notes (id, title, content, folder_id, tags, is_favorite, created_at, updated_at, deleted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)
      `, [
        'welcome',
        '欢迎使用 NoteFlow',
        JSON.stringify({
          type: 'doc',
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '欢迎使用 NoteFlow' }] },
            { type: 'paragraph', content: [{ type: 'text', text: '这是一款融合 AI 能力的智能笔记应用。' }] },
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '核心功能' }] },
            { type: 'bulletList', content: [
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '流畅的富文本编辑体验' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '灵活的文件夹整理系统' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '强大的搜索功能' }] }] },
            ]},
          ]
        }),
        'default',
        '["欢迎"]',
        1,
        Date.now(),
        Date.now()
      ]);
    }

    console.log('Database initialized successfully');
    return pool;
  } finally {
    connection.release();
  }
}

export function getPool(): mysql.Pool {
  if (!pool) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return pool;
}

// For backward compatibility, export pool directly (will be set after initDatabase)
export { pool };

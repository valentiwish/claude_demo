import { Router } from 'express';
import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import type { CreateNoteDto, UpdateNoteDto } from '../types/index.js';

const router = Router();

function parseNoteRow(row: any) {
  let content = row.content || '';
  let tags: string[] = [];

  // Parse tags - MySQL JSON column may return object or string
  if (row.tags) {
    try {
      tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags;
    } catch {
      tags = [];
    }
  }

  // Content - may already be parsed if stored as JSON object
  if (content && typeof content === 'object') {
    // Already parsed, keep as-is
  } else if (content && typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {
      // Keep as plain text string
    }
  }

  return {
    id: row.id,
    title: row.title,
    content: content,
    folderId: row.folder_id,
    tags,
    isFavorite: Boolean(row.is_favorite),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

// Get all notes (excluding soft-deleted)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notes WHERE deleted_at IS NULL ORDER BY updated_at DESC'
    );
    const notes = (rows as any[]).map(parseNoteRow);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Search notes
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }
    const searchPattern = `%${query}%`;
    const [rows] = await pool.execute(
      `SELECT * FROM notes WHERE deleted_at IS NULL
       AND (title LIKE ? OR content LIKE ?)
       ORDER BY updated_at DESC`,
      [searchPattern, searchPattern]
    );
    const notes = (rows as any[]).map(parseNoteRow);
    res.json(notes);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notes WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );
    const notes = rows as any[];
    if (notes.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(parseNoteRow(notes[0]));
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create note
router.post('/', async (req, res) => {
  try {
    const dto: CreateNoteDto = req.body;
    const id = uuidv4();
    const now = Date.now();
    const content = dto.content || '';
    const tags = dto.tags || [];

    await pool.execute(
      `INSERT INTO notes (id, title, content, folder_id, tags, is_favorite, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
      [
        id,
        dto.title || '无标题笔记',
        typeof content === 'object' ? JSON.stringify(content) : content,
        dto.folderId || null,
        JSON.stringify(tags),
        dto.isFavorite ? 1 : 0,
        now,
        now
      ]
    );
    const [rows] = await pool.execute('SELECT * FROM notes WHERE id = ?', [id]);
    const notes = rows as any[];
    if (notes.length === 0) {
      return res.status(500).json({ error: 'Failed to retrieve created note' });
    }
    res.status(201).json(parseNoteRow(notes[0]));
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dto: UpdateNoteDto = req.body;
    const now = Date.now();

    const updates: string[] = [];
    const values: any[] = [];

    if (dto.title !== undefined) {
      updates.push('title = ?');
      values.push(dto.title);
    }
    if (dto.content !== undefined) {
      updates.push('content = ?');
      values.push(typeof dto.content === 'object' ? JSON.stringify(dto.content) : dto.content);
    }
    if (dto.folderId !== undefined) {
      updates.push('folder_id = ?');
      values.push(dto.folderId);
    }
    if (dto.tags !== undefined) {
      updates.push('tags = ?');
      values.push(JSON.stringify(dto.tags));
    }
    if (dto.isFavorite !== undefined) {
      updates.push('is_favorite = ?');
      values.push(dto.isFavorite ? 1 : 0);
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await pool.execute(
      `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [rows] = await pool.execute('SELECT * FROM notes WHERE id = ?', [id]);
    const notes = rows as any[];
    if (notes.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(parseNoteRow(notes[0]));
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Soft delete note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = Date.now();
    await pool.execute(
      'UPDATE notes SET deleted_at = ?, updated_at = ? WHERE id = ?',
      [now, now, id]
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;

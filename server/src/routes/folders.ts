import { Router } from 'express';
import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import type { CreateFolderDto, UpdateFolderDto } from '../types/index.js';

const router = Router();

// Get all folders
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM folders ORDER BY folder_order ASC'
    );
    const folders = (rows as any[]).map(row => ({
      id: row.id,
      name: row.name,
      parentId: row.parent_id,
      order: row.folder_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Create folder
router.post('/', async (req, res) => {
  try {
    const dto: CreateFolderDto = req.body;
    const id = uuidv4();
    const now = Date.now();

    // Get max order in parent
    const [orderRows] = await pool.execute(
      'SELECT MAX(folder_order) as max_order FROM folders WHERE parent_id <=> ?',
      [dto.parentId || null]
    ) as any;
    const maxOrder = orderRows[0]?.max_order ?? -1;

    await pool.execute(
      `INSERT INTO folders (id, name, parent_id, folder_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, dto.name, dto.parentId || null, maxOrder + 1, now, now]
    );

    const [rows] = await pool.execute('SELECT * FROM folders WHERE id = ?', [id]);
    const folders = rows as any[];
    const row = folders[0];
    res.status(201).json({
      id: row.id,
      name: row.name,
      parentId: row.parent_id,
      order: row.folder_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Update folder
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dto: UpdateFolderDto = req.body;
    const now = Date.now();

    const updates: string[] = [];
    const values: any[] = [];

    if (dto.name !== undefined) {
      updates.push('name = ?');
      values.push(dto.name);
    }
    if (dto.parentId !== undefined) {
      updates.push('parent_id = ?');
      values.push(dto.parentId);
    }
    if (dto.order !== undefined) {
      updates.push('folder_order = ?');
      values.push(dto.order);
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await pool.execute(
      `UPDATE folders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [rows] = await pool.execute('SELECT * FROM folders WHERE id = ?', [id]);
    const folders = rows as any[];
    if (folders.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    const row = folders[0];
    res.json({
      id: row.id,
      name: row.name,
      parentId: row.parent_id,
      order: row.folder_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// Delete folder
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM folders WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

export default router;

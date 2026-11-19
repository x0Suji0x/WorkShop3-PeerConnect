import { Router } from 'express';
import db from './db.js';
import { authenticateToken } from './auth.js';

const router = Router();

function formatProject(raw) {
  if (!raw) return null;
  let skills = [];
  try {
    skills = typeof raw.skills_required === 'string' ? JSON.parse(raw.skills_required) : raw.skills_required;
  } catch {
    skills = [];
  }

  return {
    id: raw.id,
    title: raw.title,
    clientName: raw.client_name,
    clientType: raw.client_type,
    clientLocation: raw.client_location,
    budget: Number(raw.budget),
    budgetType: raw.budget_type,
    duration: raw.duration,
    hoursPerWeek: raw.hours_per_week,
    description: raw.description,
    skillsRequired: skills,
    badge: raw.badge,
    category: raw.category,
    workMode: raw.work_mode,
    applicantsCount: Number(raw.applicants_count),
    postedTimeAgo: raw.posted_time_ago,
    clientId: raw.client_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// GET /api/projects - list all projects
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM projects';
    const params = [];
    const conditions = [];

    if (search && typeof search === 'string') {
      conditions.push('(title LIKE ? OR description LIKE ? OR client_name LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (category && typeof category === 'string' && category !== 'All') {
      conditions.push('category = ?');
      params.push(category.trim());
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';
    const rows = db.prepare(query).all(...params);
    const projects = rows.map(formatProject);
    return res.json({ projects, count: projects.length });
  } catch (error) {
    console.error('[Projects Error /]:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - single project
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ project: formatProject(row) });
  } catch (error) {
    console.error('[Projects Error /:id]:', error);
    return res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - create new project
router.post('/', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only employer accounts can post projects.' });
    }

    const {
      title,
      clientLocation = 'Remote Scope',
      budget = 5000,
      budgetType = 'Milestone Escrow',
      duration = '3-4 Weeks',
      hoursPerWeek = '15-20 hrs/wk',
      description,
      skillsRequired = [],
      badge = 'New Scope',
      category = 'Design & development',
      workMode = 'Remote',
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Project description is required' });
    }

    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const skillsList = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === 'string'
      ? skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const insertStmt = db.prepare(`
      INSERT INTO projects (
        id, title, client_name, client_type, client_location, budget, budget_type,
        duration, hours_per_week, description, skills_required, badge, applicants_count,
        posted_time_ago, client_id, category, work_mode, created_at, updated_at
      ) VALUES (
        @id, @title, @client_name, @client_type, @client_location, @budget, @budget_type,
        @duration, @hours_per_week, @description, @skills_required, @badge, @applicants_count,
        @posted_time_ago, @client_id, @category, @work_mode, @created_at, @updated_at
      )
    `);

    insertStmt.run({
      id,
      title: title.trim(),
      client_name: req.user.companyName || req.user.contactName || req.user.fullName,
      client_type: req.user.isVerified ? 'Verified Employer' : 'Employer',
      client_location: clientLocation.trim(),
      budget: Number(budget) || 5000,
      budget_type: budgetType.trim(),
      duration: duration.trim(),
      hours_per_week: hoursPerWeek.trim(),
      description: description.trim(),
      skills_required: JSON.stringify(skillsList),
      badge: badge.trim(),
      applicants_count: 0,
      posted_time_ago: 'Just now',
      client_id: req.userId,
      category: category.trim(),
      work_mode: ['Remote', 'Hybrid', 'On-site'].includes(workMode) ? workMode : 'Remote',
      created_at: now,
      updated_at: now,
    });

    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    return res.status(201).json({
      message: 'Project posted successfully',
      project: formatProject(created),
    });
  } catch (error) {
    console.error('[Projects Error POST /]:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;

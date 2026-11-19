import { Router } from 'express';
import db from './db.js';
import { authenticateToken } from './auth.js';

const router = Router();

function formatApplication(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    projectId: raw.project_id,
    projectTitle: raw.project_title,
    studentId: raw.student_id,
    studentName: raw.student_name,
    studentEmail: raw.student_email,
    studentCollege: raw.student_college,
    studentRole: raw.student_role,
    studentAvatar: raw.student_avatar,
    coverLetter: raw.cover_letter,
    portfolioLink: raw.portfolio_link,
    expectedStipend: raw.expected_stipend,
    status: raw.status === 'pending' || raw.status === 'reviewed' ? 'submitted' : raw.status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// GET /api/applications - list applications
router.get('/', authenticateToken, (req, res) => {
  try {
    let query = 'SELECT applications.* FROM applications';
    const params = [];

    if (req.user.role === 'student') {
      query += ' WHERE applications.student_id = ?';
      params.push(req.userId);
    } else {
      query += ' INNER JOIN projects ON projects.id = applications.project_id WHERE projects.client_id = ?';
      params.push(req.userId);
    }

    query += ' ORDER BY applications.created_at DESC';
    const rows = db.prepare(query).all(...params);
    const applications = rows.map(formatApplication);
    return res.json({ applications, count: applications.length });
  } catch (error) {
    console.error('[Applications Error GET /]:', error);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// POST /api/applications - submit application
router.post('/', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only student accounts can submit applications.' });
    }

    const {
      projectId,
      coverLetter = '',
      portfolioLink = '',
      expectedStipend = '',
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const project = db.prepare('SELECT id, title FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const duplicate = db
      .prepare('SELECT id FROM applications WHERE project_id = ? AND student_id = ?')
      .get(projectId, req.userId);
    if (duplicate) {
      return res.status(409).json({ error: 'You have already applied to this project.' });
    }

    const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO applications (
        id, project_id, project_title, student_id, student_name, student_email,
        student_college, student_role, student_avatar, cover_letter, portfolio_link,
        expected_stipend, status, created_at, updated_at
      ) VALUES (
        @id, @project_id, @project_title, @student_id, @student_name, @student_email,
        @student_college, @student_role, @student_avatar, @cover_letter, @portfolio_link,
        @expected_stipend, @status, @created_at, @updated_at
      )
    `);

    insertStmt.run({
      id,
      project_id: projectId,
      project_title: project.title,
      student_id: req.userId,
      student_name: req.user.fullName,
      student_email: req.user.email,
      student_college: req.user.collegeName || 'University Student',
      student_role: req.user.headline || 'Student creator',
      student_avatar: req.user.avatarUrl || '',
      cover_letter: coverLetter,
      portfolio_link: portfolioLink,
      expected_stipend: expectedStipend,
      status: 'pending',
      created_at: now,
      updated_at: now,
    });

    // Increment applicants_count on project
    try {
      db.prepare('UPDATE projects SET applicants_count = applicants_count + 1 WHERE id = ?').run(projectId);
    } catch {
      // ignore
    }

    const created = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    return res.status(201).json({
      message: 'Application submitted successfully',
      application: formatApplication(created),
    });
  } catch (error) {
    console.error('[Applications Error POST /]:', error);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
});

// PATCH /api/applications/:id - update application status
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only employer accounts can review applications.' });
    }

    const { status } = req.body;
    const validStatuses = ['submitted', 'shortlisted', 'accepted', 'rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = db.prepare(`
      SELECT applications.id
      FROM applications
      INNER JOIN projects ON projects.id = applications.project_id
      WHERE applications.id = ? AND projects.client_id = ?
    `).get(req.params.id, req.userId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found for this employer.' });
    }

    const now = new Date().toISOString();
    const updateStmt = db.prepare(`
      UPDATE applications
      SET status = ?, updated_at = ?
      WHERE id = ?
    `);

    const databaseStatus = status === 'submitted' ? 'pending' : status;
    const result = updateStmt.run(databaseStatus, now, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    return res.json({
      message: 'Application status updated',
      application: formatApplication(updated),
    });
  } catch (error) {
    console.error('[Applications Error PATCH /:id]:', error);
    return res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;

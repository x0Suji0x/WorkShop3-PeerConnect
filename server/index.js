import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import authRouter from './auth.js';
import projectsRouter from './projects.js';
import applicationsRouter from './applications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow Vite dev server and any deployment origin
app.use(cors({
  origin: true,
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PeerConnect Fullstack Server',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/applications', applicationsRouter);

// Serve static assets when dist folder is present
if (fs.existsSync(distPath)) {
  console.log(`📦 [Production Static Assets] Serving from ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for all client routes (e.g. /projects, /colleges, /signin)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    next();
  });
}

// 404 handler for API routes or missing pages
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  if (fs.existsSync(distPath)) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  res.status(404).send('Not Found');
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 [PeerConnect Fullstack Server] running at http://localhost:${PORT}`);
  console.log(`🔒 [API Endpoints] mounted at http://localhost:${PORT}/api`);
});

export default app;

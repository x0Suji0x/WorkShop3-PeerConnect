import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'peerconnect.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and reliability
db.pragma('journal_mode = WAL');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK(role IN ('student', 'client')),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    headline TEXT,
    phone TEXT,
    college_name TEXT,
    degree TEXT,
    field_of_study TEXT,
    academic_year TEXT,
    graduation_year TEXT,
    college_email TEXT,
    is_verified INTEGER DEFAULT 0,
    skills TEXT DEFAULT '[]',
    interests TEXT DEFAULT '[]',
    portfolio TEXT DEFAULT '{}',
    company_name TEXT,
    contact_name TEXT,
    designation TEXT,
    website TEXT,
    org_type TEXT,
    selected_needs TEXT DEFAULT '[]',
    profile_data TEXT DEFAULT '{}',
    last_login_at TEXT,
    google_subject TEXT UNIQUE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_type TEXT DEFAULT 'Startup',
    client_location TEXT DEFAULT 'Remote Scope',
    budget INTEGER DEFAULT 15000,
    budget_type TEXT DEFAULT 'Milestone Escrow',
    duration TEXT DEFAULT '4 Weeks',
    hours_per_week TEXT DEFAULT '15-20 hrs/wk',
    description TEXT NOT NULL,
    skills_required TEXT DEFAULT '[]',
    badge TEXT DEFAULT 'Active Scope',
    category TEXT,
    work_mode TEXT,
    applicants_count INTEGER DEFAULT 0,
    posted_time_ago TEXT DEFAULT 'Just now',
    client_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    project_title TEXT NOT NULL,
    student_id TEXT,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_college TEXT DEFAULT 'University Student',
    student_role TEXT DEFAULT 'Student Developer',
    student_avatar TEXT,
    cover_letter TEXT,
    portfolio_link TEXT,
    expected_stipend TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at);
  CREATE INDEX IF NOT EXISTS idx_applications_project ON applications(project_id);
  CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
`);

// Existing local databases predate profile_data. Keep startup migration safe
// for developers who already have a seeded database on disk.
function ensureColumn(tableName, columnName, definition) {
  const column = db
    .prepare(`SELECT 1 FROM pragma_table_info('${tableName}') WHERE name = ?`)
    .get(columnName);

  if (!column) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

ensureColumn('users', 'profile_data', "TEXT DEFAULT '{}'");
ensureColumn('users', 'last_login_at', 'TEXT');
ensureColumn('users', 'google_subject', 'TEXT');
db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_subject ON users(google_subject)');
ensureColumn('projects', 'category', 'TEXT');
ensureColumn('projects', 'work_mode', 'TEXT');

// Seed initial default demo accounts if not present
function seedDemoAccounts() {
  const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');

  // 1. Student Demo: Sofia Rodriguez
  const studentExists = checkStmt.get('sofia.rodriguez@nid.edu');
  if (!studentExists) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('PeerConnect2026!', salt);
    const insertStmt = db.prepare(`
      INSERT INTO users (
        id, role, email, password_hash, full_name, avatar_url, headline, phone,
        college_name, degree, field_of_study, academic_year, graduation_year,
        college_email, is_verified, skills, interests, portfolio, created_at, updated_at
      ) VALUES (
        @id, @role, @email, @password_hash, @full_name, @avatar_url, @headline, @phone,
        @college_name, @degree, @field_of_study, @academic_year, @graduation_year,
        @college_email, @is_verified, @skills, @interests, @portfolio, @created_at, @updated_at
      )
    `);

    insertStmt.run({
      id: 'usr_student_demo_sofia',
      role: 'student',
      email: 'sofia.rodriguez@nid.edu',
      password_hash: hash,
      full_name: 'Sofia Rodriguez',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      headline: 'Product Designer & Design Systems Specialist',
      phone: '9876543210',
      college_name: 'National Institute of Design (NID Ahmedabad)',
      degree: 'Bachelor of Design (B.Des)',
      field_of_study: 'UI/UX & Product Design',
      academic_year: '4th Year (Senior)',
      graduation_year: '2026',
      college_email: 'sofia.rodriguez@nid.edu',
      is_verified: 0,
      skills: JSON.stringify([
        { name: 'Figma', category: 'design' },
        { name: 'UI/UX Design', category: 'design' },
        { name: 'Design Systems', category: 'design' },
        { name: 'User Research', category: 'design' },
        { name: 'Prototyping', category: 'design' },
      ]),
      interests: JSON.stringify(['UI/UX & Product Design', 'Artificial Intelligence & Machine Learning']),
      portfolio: JSON.stringify({
        githubUrl: 'https://github.com/sofia-design',
        linkedinUrl: 'https://linkedin.com/in/sofia-rodriguez',
        portfolioUrl: 'https://sofia.design',
        aboutBio: 'Passionate about crafting intuitive, accessible user interfaces and systemic design architecture.',
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    console.log('[DB] Seeded demo student: sofia.rodriguez@nid.edu');
  }

  // 2. Client Demo: Vikram Sen
  const clientExists = checkStmt.get('vikram.sen@apexstudio.co');
  if (!clientExists) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('PeerConnectClient2026!', salt);
    const insertStmt = db.prepare(`
      INSERT INTO users (
        id, role, email, password_hash, full_name, avatar_url, headline, phone,
        company_name, contact_name, designation, website, org_type, selected_needs,
        is_verified, created_at, updated_at
      ) VALUES (
        @id, @role, @email, @password_hash, @full_name, @avatar_url, @headline, @phone,
        @company_name, @contact_name, @designation, @website, @org_type, @selected_needs,
        @is_verified, @created_at, @updated_at
      )
    `);

    insertStmt.run({
      id: 'usr_client_demo_vikram',
      role: 'client',
      email: 'vikram.sen@apexstudio.co',
      password_hash: hash,
      full_name: 'Vikram Sen',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      headline: 'Head of Product & Design at Apex Studio & Labs',
      phone: '9876543211',
      company_name: 'Apex Studio & Labs',
      contact_name: 'Vikram Sen',
      designation: 'Head of Product & Design',
      website: 'https://apexstudio.co',
      org_type: 'Seed / Early-stage Startup',
      selected_needs: JSON.stringify(['Frontend / React', 'UI/UX Design', 'Full-Stack Web']),
      is_verified: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    console.log('[DB] Seeded demo client: vikram.sen@apexstudio.co');
  }
}

function seedProjectsAndApplications() {
  const count = db.prepare('SELECT count(*) as count FROM projects').get().count;
  if (count === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (
        id, title, client_name, client_type, client_location, budget, budget_type,
        duration, hours_per_week, description, skills_required, badge, applicants_count,
        posted_time_ago, client_id, created_at, updated_at
      ) VALUES (
        @id, @title, @client_name, @client_type, @client_location, @budget, @budget_type,
        @duration, @hours_per_week, @description, @skills_required, @badge, @applicants_count,
        @posted_time_ago, @client_id, @created_at, @updated_at
      )
    `);

    const now = new Date().toISOString();
    const initialProjects = [
      {
        id: 'p1',
        title: 'Full-Stack Analytics Dashboard for Supply Chain Data',
        client_name: 'Apex Studio & Labs',
        client_type: 'B2B Logistics Concept',
        client_location: 'Remote Scope',
        budget: 4500,
        budget_type: 'Milestone Escrow',
        duration: '4 Weeks',
        hours_per_week: '15-20 hrs/wk',
        description: 'Build an interactive dispatch management dashboard with live metrics, filters, and CSV export using React and TypeScript.',
        skills_required: JSON.stringify(['React 19', 'TypeScript', 'Tailwind CSS', 'PostgreSQL']),
        badge: 'High Urgency',
        applicants_count: 4,
        posted_time_ago: 'Just now',
        client_id: 'usr_client_demo_vikram',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'p2',
        title: 'Interactive 3D Web Landing Experience',
        client_name: 'Creative Hardware Co.',
        client_type: 'Product Launch Studio',
        client_location: 'Remote Scope',
        budget: 3200,
        budget_type: 'Fixed Escrow',
        duration: '2 Weeks',
        hours_per_week: '10-15 hrs/wk',
        description: 'Looking for a front-end developer skilled in Three.js and GSAP to craft an interactive product launch presentation.',
        skills_required: JSON.stringify(['Three.js', 'GSAP', 'React', 'Figma']),
        badge: 'Featured',
        applicants_count: 6,
        posted_time_ago: 'Recent Scope',
        client_id: 'usr_client_demo_vikram',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'p3',
        title: 'Mobile Micro-Investing App for Gen-Z Students',
        client_name: 'FinTech Labs India',
        client_type: 'FinTech Startup',
        client_location: 'Bangalore / Remote',
        budget: 8500,
        budget_type: 'Milestone Escrow',
        duration: '6 Weeks',
        hours_per_week: '20 hrs/wk',
        description: 'Build an intuitive React Native mobile application for student micro-savings and automated round-up investments.',
        skills_required: JSON.stringify(['React Native', 'TypeScript', 'Node.js', 'Tailwind CSS']),
        badge: 'Verified Client',
        applicants_count: 3,
        posted_time_ago: '2 days ago',
        client_id: 'usr_client_demo_vikram',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'p4',
        title: 'AI Content Generator & Prompt Orchestration Tool',
        client_name: 'HyperScale AI',
        client_type: 'AI Accelerator Venture',
        client_location: 'Remote',
        budget: 12000,
        budget_type: 'Fixed Escrow',
        duration: '5 Weeks',
        hours_per_week: '20-25 hrs/wk',
        description: 'Develop a modern Next.js/React workspace enabling technical creators to chain LLM prompts and export structured documentation.',
        skills_required: JSON.stringify(['React', 'Python', 'FastAPI', 'Gemini API']),
        badge: 'Featured',
        applicants_count: 5,
        posted_time_ago: '3 days ago',
        client_id: 'usr_client_demo_vikram',
        created_at: now,
        updated_at: now,
      },
    ];

    for (const proj of initialProjects) {
      insertProject.run(proj);
    }
    console.log('[DB] Seeded initial projects');

    // Seed initial demo applications
    const insertApp = db.prepare(`
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

    insertApp.run({
      id: 'app-1',
      project_id: 'p2',
      project_title: 'Interactive 3D Web Landing Experience',
      student_id: 'usr_student_demo_sofia',
      student_name: 'Sofia Rodriguez',
      student_email: 'sofia.rodriguez@nid.edu',
      student_college: 'National Institute of Design (NID)',
      student_role: 'UI/UX & Product Designer',
      student_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      cover_letter: 'Proficient in Three.js, GSAP, and interactive micro-animations. Built portfolio projects for 2 client demos with high engagement.',
      portfolio_link: 'https://sofia.design',
      expected_stipend: '₹3,200',
      status: 'shortlisted',
      created_at: now,
      updated_at: now,
    });

    insertApp.run({
      id: 'app-2',
      project_id: 'p1',
      project_title: 'Full-Stack Analytics Dashboard for Supply Chain Data',
      student_id: 'usr_std_sample_aarav',
      student_name: 'Aarav Patel',
      student_email: 'aarav.patel@iitb.ac.in',
      student_college: 'IIT Bombay',
      student_role: 'Full-Stack Software Engineer',
      student_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      cover_letter: 'Built scalable dashboards with TanStack Table, React 19, and PostgreSQL. Solved real-time dispatch filters with sub-50ms query times.',
      portfolio_link: 'https://github.com/aarav',
      expected_stipend: '₹4,500',
      status: 'pending',
      created_at: now,
      updated_at: now,
    });

    console.log('[DB] Seeded initial applications');
  }
}

seedDemoAccounts();
db.prepare("UPDATE users SET is_verified = 1 WHERE email IN ('sofia.rodriguez@nid.edu', 'vikram.sen@apexstudio.co', 'kritagya.gour19@gmail.com')").run();
seedProjectsAndApplications();

export default db;

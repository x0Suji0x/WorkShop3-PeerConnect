import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import db from './db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'peerconnect_jwt_secret_dev_2026_super_secure';
const APP_ORIGIN = (process.env.APP_ORIGIN || 'http://localhost:5173').replace(/\/$/, '');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 5001}/api/auth/google/callback`;
const SESSION_COOKIE = 'peerconnect_session';
const GOOGLE_STATE_COOKIE = 'peerconnect_google_state';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be configured in production.');
}

const studentProfileFields = [
  'coverImageUrl',
  'hourlyRate',
  'projectsCompleted',
  'rating',
  'reviewsCount',
  'availability',
  'featuredWork',
  'bio',
  'profileCompletion',
  'profileViews',
  'activeProjects',
  'applicationsSent',
  'about',
  'availabilityPreferences',
  'experiences',
  'education',
  'portfolioProjects',
  'certifications',
  'socialLinks',
  'verifications',
  'isPlusMember',
];

function parseJson(value, fallback) {
  if (typeof value !== 'string') return value ?? fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function asProfileData(value) {
  const parsed = parseJson(value, {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

function cleanStudentProfile(input) {
  const profile = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const result = {};

  for (const key of studentProfileFields) {
    if (profile[key] !== undefined) result[key] = profile[key];
  }

  return result;
}

function readCookie(req, name) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const pair = cookies.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function signInUser(res, rawUser, message, status = 200) {
  const signedInAt = new Date().toISOString();
  db.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?').run(signedInAt, signedInAt, rawUser.id);
  const signedInUser = db.prepare('SELECT * FROM users WHERE id = ?').get(rawUser.id);
  const token = generateToken(signedInUser);
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());

  return res.status(status).json({
    message,
    token,
    user: sanitizeUser(signedInUser),
  });
}

function redirectToOAuthResult(res, params = {}) {
  const query = new URLSearchParams(params);
  const suffix = query.toString() ? `?${query}` : '';
  return res.redirect(`${APP_ORIGIN}/auth/callback${suffix}`);
}

function createGoogleUser(profile, requestedRole) {
  const cleanEmail = profile.email.toLowerCase().trim();
  const existingBySubject = db.prepare('SELECT * FROM users WHERE google_subject = ?').get(profile.sub);
  const existingByEmail = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(cleanEmail);

  if (existingBySubject) return existingBySubject;
  if (existingByEmail) {
    db.prepare('UPDATE users SET google_subject = ?, updated_at = ? WHERE id = ?').run(profile.sub, new Date().toISOString(), existingByEmail.id);
    return db.prepare('SELECT * FROM users WHERE id = ?').get(existingByEmail.id);
  }

  const now = new Date().toISOString();
  const userId = `usr_google_${Date.now()}_${randomBytes(3).toString('hex')}`;
  const passwordHash = bcrypt.hashSync(randomBytes(32).toString('hex'), 10);
  const fullName = typeof profile.name === 'string' && profile.name.trim() ? profile.name.trim() : cleanEmail.split('@')[0];
  const avatarUrl = typeof profile.picture === 'string' ? profile.picture : '';

  if (requestedRole === 'client') {
    const domain = cleanEmail.split('@')[1]?.split('.')[0] || 'My Organization';
    const organization = domain.charAt(0).toUpperCase() + domain.slice(1);
    db.prepare(`
      INSERT INTO users (
        id, role, email, password_hash, full_name, avatar_url, headline, phone,
        company_name, contact_name, designation, website, org_type, selected_needs,
        is_verified, google_subject, created_at, updated_at
      ) VALUES (
        @id, @role, @email, @password_hash, @full_name, @avatar_url, @headline, @phone,
        @company_name, @contact_name, @designation, @website, @org_type, @selected_needs,
        @is_verified, @google_subject, @created_at, @updated_at
      )
    `).run({
      id: userId,
      role: 'client',
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: fullName,
      avatar_url: avatarUrl,
      headline: `Hiring lead at ${organization}`,
      phone: '',
      company_name: organization,
      contact_name: fullName,
      designation: 'Hiring lead',
      website: '',
      org_type: 'Organization',
      selected_needs: '[]',
      is_verified: 0,
      google_subject: profile.sub,
      created_at: now,
      updated_at: now,
    });
  } else {
    db.prepare(`
      INSERT INTO users (
        id, role, email, password_hash, full_name, avatar_url, headline, phone,
        college_name, degree, field_of_study, academic_year, graduation_year,
        college_email, is_verified, skills, interests, portfolio, profile_data,
        google_subject, created_at, updated_at
      ) VALUES (
        @id, @role, @email, @password_hash, @full_name, @avatar_url, @headline, @phone,
        @college_name, @degree, @field_of_study, @academic_year, @graduation_year,
        @college_email, @is_verified, @skills, @interests, @portfolio, @profile_data,
        @google_subject, @created_at, @updated_at
      )
    `).run({
      id: userId,
      role: 'student',
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: fullName,
      avatar_url: avatarUrl,
      headline: 'Student & creator on PeerConnect',
      phone: '',
      college_name: '',
      degree: '',
      field_of_study: '',
      academic_year: '',
      graduation_year: '',
      college_email: '',
      is_verified: 0,
      skills: '[]',
      interests: '[]',
      portfolio: '{}',
      profile_data: '{}',
      google_subject: profile.sub,
      created_at: now,
      updated_at: now,
    });
  }

  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

// Helper to sanitize user object for client response
export function sanitizeUser(rawUser) {
  if (!rawUser) return null;
  const user = { ...rawUser };
  delete user.password_hash;

  const parsedSkills = parseJson(user.skills, []);
  const parsedInterests = parseJson(user.interests, []);
  const parsedPortfolio = parseJson(user.portfolio, {});
  const parsedNeeds = parseJson(user.selected_needs, []);
  user.skills = Array.isArray(parsedSkills) ? parsedSkills : [];
  user.interests = Array.isArray(parsedInterests) ? parsedInterests : [];
  user.portfolio = parsedPortfolio && typeof parsedPortfolio === 'object' && !Array.isArray(parsedPortfolio) ? parsedPortfolio : {};
  user.selected_needs = Array.isArray(parsedNeeds) ? parsedNeeds : [];
  const profileData = asProfileData(user.profile_data);
  delete user.profile_data;

  // Convenient camelCase aliases
  return {
    ...user,
    fullName: user.full_name,
    avatarUrl: user.avatar_url,
    collegeName: user.college_name,
    fieldOfStudy: user.field_of_study,
    academicYear: user.academic_year,
    graduationYear: user.graduation_year,
    collegeEmail: user.college_email,
    companyName: user.company_name,
    contactName: user.contact_name,
    orgType: user.org_type,
    selectedNeeds: user.selected_needs,
    isVerified: Boolean(user.is_verified),
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastLoginAt: user.last_login_at,
    profileData,
  };
}

// Helper to generate JWT token
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      fullName: user.full_name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Authentication middleware for protected endpoints
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token =
    (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null) ||
    readCookie(req, SESSION_COOKIE);

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(payload.id);

    if (!user) {
      return res.status(401).json({ error: 'User account not found' });
    }

    req.user = sanitizeUser(user);
    req.userId = user.id;
    req.authToken = token;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired authentication token' });
  }
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?');
    const user = stmt.get(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'No account found with this email address' });
    }

    // Role check (if specified in request)
    if (role && user.role !== role) {
      const targetRoleName = role === 'student' ? 'Student' : 'Client / Employer';
      return res.status(401).json({
        error: `This account is registered as a ${user.role}, not as a ${targetRoleName}. Please switch tabs to sign in.`
      });
    }

    // Password verification
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    return signInUser(res, user, 'Signed in successfully');
  } catch (error) {
    console.error('[Auth Error /login]:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// POST /api/auth/signup/student
router.post('/signup/student', (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone = '',
      collegeName = '',
      degree = '',
      fieldOfStudy = '',
      academicYear = '',
      graduationYear = '',
      collegeEmail = '',
      skills = [],
      interests = [],
      portfolio = {},
      avatarUrl = '',
      headline = '',
    } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate
    const checkStmt = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?');
    const existing = checkStmt.get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in instead.' });
    }

    const userId = `usr_std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const now = new Date().toISOString();
    const initialProfileData = {
      about: typeof portfolio?.aboutBio === 'string' ? portfolio.aboutBio.trim() : '',
      socialLinks: {
        ...(portfolio?.githubUrl ? { github: portfolio.githubUrl } : {}),
        ...(portfolio?.linkedinUrl ? { linkedin: portfolio.linkedinUrl } : {}),
        ...(portfolio?.behanceUrl ? { behance: portfolio.behanceUrl } : {}),
        ...(portfolio?.portfolioUrl ? { portfolio: portfolio.portfolioUrl } : {}),
      },
    };

    const insertStmt = db.prepare(`
      INSERT INTO users (
        id, role, email, password_hash, full_name, avatar_url, headline, phone,
        college_name, degree, field_of_study, academic_year, graduation_year,
        college_email, is_verified, skills, interests, portfolio, profile_data, created_at, updated_at
      ) VALUES (
        @id, @role, @email, @password_hash, @full_name, @avatar_url, @headline, @phone,
        @college_name, @degree, @field_of_study, @academic_year, @graduation_year,
        @college_email, @is_verified, @skills, @interests, @portfolio, @profile_data, @created_at, @updated_at
      )
    `);

    insertStmt.run({
      id: userId,
      role: 'student',
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: fullName.trim(),
      avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      headline: headline.trim() || `${fieldOfStudy || 'Undergraduate'} Student`,
      phone: phone.trim(),
      college_name: collegeName.trim(),
      degree: degree.trim(),
      field_of_study: fieldOfStudy.trim(),
      academic_year: academicYear.trim(),
      graduation_year: graduationYear.trim(),
      college_email: collegeEmail.trim(),
      // Verification must be confirmed by a verification provider, never by a signup payload.
      is_verified: 0,
      skills: JSON.stringify(skills),
      interests: JSON.stringify(interests),
      portfolio: JSON.stringify(portfolio),
      profile_data: JSON.stringify(initialProfileData),
      created_at: now,
      updated_at: now,
    });

    const getStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const createdUser = getStmt.get(userId);
    return signInUser(res, createdUser, 'Student account created successfully', 201);
  } catch (error) {
    console.error('[Auth Error /signup/student]:', error);
    return res.status(500).json({ error: 'Internal server error while creating student account' });
  }
});

// POST /api/auth/signup/client
router.post('/signup/client', (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      password,
      designation = '',
      website = '',
      orgType = 'Seed / Early-stage Startup',
      selectedNeeds = [],
      phone = '',
      avatarUrl = '',
      headline = '',
    } = req.body;

    if (!companyName || !companyName.trim()) {
      return res.status(400).json({ error: 'Company or organization name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Work email address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate
    const checkStmt = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?');
    const existing = checkStmt.get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in instead.' });
    }

    const userId = `usr_clt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const now = new Date().toISOString();
    const resolvedContact = contactName?.trim() || companyName.trim();
    const resolvedHeadline = headline?.trim() || `${designation || 'Hiring Lead'} at ${companyName.trim()}`;

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
      id: userId,
      role: 'client',
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: resolvedContact,
      avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      headline: resolvedHeadline,
      phone: phone.trim(),
      company_name: companyName.trim(),
      contact_name: resolvedContact,
      designation: designation.trim(),
      website: website.trim(),
      org_type: orgType.trim(),
      selected_needs: JSON.stringify(selectedNeeds),
      is_verified: 0,
      created_at: now,
      updated_at: now,
    });

    const getStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const createdUser = getStmt.get(userId);
    return signInUser(res, createdUser, 'Client account registered successfully', 201);
  } catch (error) {
    console.error('[Auth Error /signup/client]:', error);
    return res.status(500).json({ error: 'Internal server error while registering client account' });
  }
});

// GET /api/auth/google (real Google OAuth account chooser)
router.get('/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return redirectToOAuthResult(res, {
      error: 'Google sign-in is not configured for this environment yet.',
    });
  }

  const role = req.query.role === 'client' ? 'client' : 'student';
  const state = randomBytes(24).toString('hex');
  res.cookie(GOOGLE_STATE_COOKIE, `${state}.${role}`, {
    ...sessionCookieOptions(),
    maxAge: 10 * 60 * 1000,
    path: '/api/auth/google',
  });

  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizationUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  authorizationUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('prompt', 'select_account');
  authorizationUrl.searchParams.set('access_type', 'offline');

  return res.redirect(authorizationUrl.toString());
});

// GET /api/auth/google/callback (Google OAuth callback)
router.get('/google/callback', async (req, res) => {
  const storedState = readCookie(req, GOOGLE_STATE_COOKIE);
  res.clearCookie(GOOGLE_STATE_COOKIE, { path: '/api/auth/google' });

  if (req.query.error) {
    return redirectToOAuthResult(res, { error: 'Google sign-in was cancelled.' });
  }

  const [expectedState, requestedRole] = (storedState || '').split('.');
  if (!expectedState || !req.query.state || req.query.state !== expectedState || !req.query.code) {
    return redirectToOAuthResult(res, { error: 'Google sign-in could not be verified. Please try again.' });
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return redirectToOAuthResult(res, { error: 'Google sign-in is not configured for this environment yet.' });
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(req.query.code),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error('Google did not return a usable access token.');
    }

    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.sub || !profile.email || !profile.email_verified) {
      throw new Error('Google did not return a verified email address.');
    }

    const account = createGoogleUser(profile, requestedRole === 'client' ? 'client' : 'student');
    const signedInAt = new Date().toISOString();
    db.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?').run(signedInAt, signedInAt, account.id);
    const token = generateToken(account);
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());

    return redirectToOAuthResult(res, { provider: 'google' });
  } catch (error) {
    console.error('[Auth Error /google/callback]:', error);
    return redirectToOAuthResult(res, { error: 'Google sign-in failed. Please try again.' });
  }
});

// POST /api/auth/github (social sign-in)
router.post('/github', (req, res) => {
  try {
    const { email, fullName, avatarUrl, role = 'student' } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'GitHub email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const checkStmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?');
    const existingUser = checkStmt.get(cleanEmail);

    if (existingUser) {
      const token = generateToken(existingUser);
      return res.status(200).json({
        message: 'Signed in with GitHub successfully',
        token,
        user: sanitizeUser(existingUser),
      });
    }

    const userId = `usr_gh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const randomPassword = bcrypt.hashSync(`github_oauth_${Date.now()}_${Math.random()}`, 10);
    const now = new Date().toISOString();
    const resolvedName = fullName?.trim() || cleanEmail.split('@')[0];
    const resolvedAvatar =
      avatarUrl?.trim() ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`;

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
      id: userId,
      role: role === 'client' ? 'client' : 'student',
      email: cleanEmail,
      password_hash: randomPassword,
      full_name: resolvedName,
      avatar_url: resolvedAvatar,
      headline: 'Full-Stack Developer on PeerConnect',
      phone: '',
      college_name: 'Tech Institute',
      degree: 'B.Tech / B.E.',
      field_of_study: 'Software Engineering',
      academic_year: '3rd Year',
      graduation_year: '2027',
      college_email: '',
      is_verified: 0,
      skills: JSON.stringify([
        { name: 'TypeScript', category: 'dev' },
        { name: 'React', category: 'dev' },
        { name: 'Git & GitHub', category: 'dev' },
      ]),
      interests: JSON.stringify(['Open Source', 'Full-Stack Web']),
      portfolio: JSON.stringify({}),
      created_at: now,
      updated_at: now,
    });

    const createdUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const token = generateToken(createdUser);

    return res.status(201).json({
      message: 'Account created with GitHub successfully',
      token,
      user: sanitizeUser(createdUser),
    });
  } catch (error) {
    console.error('[Auth Error /github]:', error);
    return res.status(500).json({ error: 'Internal server error during GitHub sign-in' });
  }
});

// GET /api/auth/me (Protected)
router.get('/me', authenticateToken, (req, res) => {
  return res.status(200).json({ user: req.user, token: req.authToken });
});

// GET /api/auth/profile (Protected, student only)
router.get('/profile', authenticateToken, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Student profile access is required.' });
  }

  return res.status(200).json({
    user: req.user,
    profile: req.user.profileData || {},
  });
});

// PATCH /api/auth/profile (Protected, student only)
// This is intentionally limited to a signed-in student's own record. Verification
// flags remain controlled by the verification flow and cannot be set from the UI.
router.patch('/profile', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only student accounts can update a student profile.' });
    }

    const incoming = req.body?.profile;
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
      return res.status(400).json({ error: 'A profile object is required.' });
    }

    const current = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
    if (!current) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const currentProfileData = asProfileData(current.profile_data);
    const incomingProfileData = cleanStudentProfile(incoming);
    const nextProfileData = { ...currentProfileData, ...incomingProfileData };
    const currentPortfolio = parseJson(current.portfolio, {});
    const socialLinks =
      nextProfileData.socialLinks && typeof nextProfileData.socialLinks === 'object'
        ? nextProfileData.socialLinks
        : {};
    const text = (value, fallback = '') =>
      typeof value === 'string' && value.trim() ? value.trim() : fallback;
    const nextSkills = Array.isArray(incoming.skills)
      ? incoming.skills
          .filter((skill) => skill && typeof skill.name === 'string' && skill.name.trim())
          .map((skill) => ({
            name: skill.name.trim(),
            category: ['design', 'dev', 'ai', 'other'].includes(skill.category) ? skill.category : 'other',
          }))
      : parseJson(current.skills, []);
    const nextInterests = Array.isArray(incoming.interests)
      ? incoming.interests.filter((interest) => typeof interest === 'string' && interest.trim())
      : parseJson(current.interests, []);
    const nextPortfolio = {
      ...(currentPortfolio && typeof currentPortfolio === 'object' ? currentPortfolio : {}),
      ...(typeof socialLinks.github === 'string' ? { githubUrl: socialLinks.github.trim() } : {}),
      ...(typeof socialLinks.linkedin === 'string' ? { linkedinUrl: socialLinks.linkedin.trim() } : {}),
      ...(typeof socialLinks.behance === 'string' ? { behanceUrl: socialLinks.behance.trim() } : {}),
      ...(typeof socialLinks.portfolio === 'string' ? { portfolioUrl: socialLinks.portfolio.trim() } : {}),
      ...(typeof incoming.about === 'string' ? { aboutBio: incoming.about.trim() } : {}),
    };
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE users
      SET full_name = @full_name,
          avatar_url = @avatar_url,
          headline = @headline,
          college_name = @college_name,
          degree = @degree,
          field_of_study = @field_of_study,
          graduation_year = @graduation_year,
          skills = @skills,
          interests = @interests,
          portfolio = @portfolio,
          profile_data = @profile_data,
          updated_at = @updated_at
      WHERE id = @id
    `).run({
      id: req.userId,
      full_name: text(incoming.name, current.full_name),
      avatar_url: text(incoming.avatarUrl, current.avatar_url || ''),
      headline: text(incoming.headline, current.headline || ''),
      college_name: text(incoming.college || incoming.university, current.college_name || ''),
      degree: text(incoming.degree, current.degree || ''),
      field_of_study: text(incoming.fieldOfStudy, current.field_of_study || ''),
      graduation_year: text(incoming.graduationYear, current.graduation_year || ''),
      skills: JSON.stringify(nextSkills),
      interests: JSON.stringify(nextInterests),
      portfolio: JSON.stringify(nextPortfolio),
      profile_data: JSON.stringify(nextProfileData),
      updated_at: now,
    });

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
    const sanitizedUser = sanitizeUser(updatedUser);

    return res.status(200).json({
      message: 'Profile saved successfully.',
      user: sanitizedUser,
      profile: sanitizedUser.profileData,
    });
  } catch (error) {
    console.error('[Auth Error /profile]:', error);
    return res.status(500).json({ error: 'Unable to save the profile right now.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  return res.status(200).json({ message: 'Logged out successfully' });
});

export default router;

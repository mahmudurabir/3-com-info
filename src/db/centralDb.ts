import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AdminAccount, AuditLogEntry, CustomerRequest } from '../types';
import { INITIAL_AUDIT_LOGS } from '../data/initialAuditLogs';
import { INITIAL_CUSTOMER_REQUESTS } from '../data/initialCustomerRequests';

export interface ServerSession {
  sessionId: string;
  userId: string;
  username: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  isValid: boolean;
}

export interface FailedLoginAttempt {
  key: string; // normalized identifier or IP
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

export interface PasswordResetToken {
  tokenHash: string;
  userId: string;
  expiresAt: number;
  used: boolean;
  createdAt: string;
}

export interface MfaChallenge {
  challengeToken: string;
  userId: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  ip?: string;
  userAgent?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  filename: string;
  sizeBytes: number;
  checksum: string;
}

export interface CentralDatabaseSchema {
  version: number;
  updatedAt: string;
  admins: AdminAccount[];
  auditLogs: AuditLogEntry[];
  sessions: ServerSession[];
  failedLogins: FailedLoginAttempt[];
  passwordResets: PasswordResetToken[];
  mfaChallenges: MfaChallenge[];
  securityAlerts: SecurityAlert[];
  customerRequests: CustomerRequest[];
  backups: BackupMetadata[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const BACKUPS_DIR = path.resolve(DATA_DIR, 'backups');
const DB_FILE = path.resolve(DATA_DIR, 'central_store.json');
const BACKUP_SECRET_KEY = process.env.BACKUP_SECRET_KEY || '3communes-db-backup-master-key-2026';

// Idle timeouts: 30 minutes for Admins, 2 hours for standard users
export const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
export const USER_IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1000;
export const MAX_SESSION_LIFESPAN_MS = 24 * 60 * 60 * 1000; // 24 hours

// Brute-force parameters: 5 failed attempts within 15 minutes = 15-minute lockout
export const MAX_FAILED_ATTEMPTS = 5;
export const MAX_IP_FAILED_ATTEMPTS = 20; // High threshold for IP-level bot mitigation
export const FAILED_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

function ensureDbDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

// Secure helper to hash passwords with bcrypt synchronously during db migration
function hashPasswordSync(plain: string): string {
  if (/^\$2[aby]\$\d{2}\$/.test(plain)) {
    return plain;
  }
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plain, salt);
}

// Initial central database template with hashed passwords
function getInitialDb(): CentralDatabaseSchema {
  return {
    version: 3,
    updatedAt: new Date().toISOString(),
    admins: [
      {
        id: 'admin-1',
        username: 'admin',
        name: 'Direction Boutique',
        email: '3communesinfo@gmail.com',
        role: 'Super Admin',
        password: hashPasswordSync('admin3communes'),
        avatarColor: '#3f704d',
        createdAt: '2026-01-01T08:00:00.000Z',
        status: 'active'
      },
      {
        id: 'admin-safayet',
        username: 'safayetsharif5',
        name: 'Safayet Sharif',
        email: 'safayetsharif5@gmail.com',
        role: 'Super Admin',
        password: hashPasswordSync('admin3communes'),
        avatarColor: '#1e3a24',
        createdAt: '2026-01-01T08:00:00.000Z',
        status: 'active'
      },
      {
        id: 'admin-2',
        username: 'manager',
        name: 'Marc Lefebvre',
        email: 'manager@3communes.fr',
        role: 'Store Manager',
        password: hashPasswordSync('manager3communes'),
        avatarColor: '#2563eb',
        createdAt: '2026-02-15T09:30:00.000Z',
        status: 'active'
      },
      {
        id: 'admin-3',
        username: 'staff',
        name: 'Saïd - Atelier SAV',
        email: 'tech@3communes.fr',
        role: 'Staff',
        password: hashPasswordSync('staff3communes'),
        avatarColor: '#d97706',
        createdAt: '2026-03-10T11:15:00.000Z',
        status: 'active'
      }
    ],
    auditLogs: INITIAL_AUDIT_LOGS,
    sessions: [],
    failedLogins: [],
    passwordResets: [],
    mfaChallenges: [],
    securityAlerts: [],
    customerRequests: INITIAL_CUSTOMER_REQUESTS,
    backups: []
  };
}

// Read database from central storage, automatically upgrading schema and hashing any plain passwords
export function readDatabase(): CentralDatabaseSchema {
  ensureDbDirs();
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDb();
    writeDatabase(initial);
    return initial;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content) as CentralDatabaseSchema;

    let modified = false;

    if (!parsed.admins) parsed.admins = [];
    if (!parsed.auditLogs) parsed.auditLogs = [];
    if (!parsed.sessions) parsed.sessions = [];
    if (!parsed.failedLogins) parsed.failedLogins = [];
    if (!parsed.passwordResets) parsed.passwordResets = [];
    if (!parsed.mfaChallenges) parsed.mfaChallenges = [];
    if (!parsed.securityAlerts) parsed.securityAlerts = [];
    if (!parsed.customerRequests) parsed.customerRequests = INITIAL_CUSTOMER_REQUESTS;
    if (!parsed.backups) parsed.backups = [];

    // Ensure all passwords in the database are hashed with bcrypt
    for (const admin of parsed.admins) {
      if (!/^\$2[aby]\$\d{2}\$/.test(admin.password)) {
        admin.password = hashPasswordSync(admin.password || 'admin3communes');
        modified = true;
      }
    }

    // Ensure root Super Admin (admin / 3communesinfo@gmail.com) exists
    const rootAdmin = parsed.admins.find(
      (a) => a.username.toLowerCase() === 'admin' || (a.email && a.email.toLowerCase() === '3communesinfo@gmail.com')
    );
    if (!rootAdmin) {
      parsed.admins.unshift({
        id: 'admin-1',
        username: 'admin',
        name: 'Direction Boutique',
        email: '3communesinfo@gmail.com',
        role: 'Super Admin',
        password: hashPasswordSync('admin3communes'),
        avatarColor: '#3f704d',
        createdAt: '2026-01-01T08:00:00.000Z',
        status: 'active'
      });
      modified = true;
    } else {
      rootAdmin.role = 'Super Admin';
      rootAdmin.status = 'active';
    }

    // Ensure Safayet Sharif exists with Super Admin role
    const safayetAdmin = parsed.admins.find(
      (a) => a.username.toLowerCase() === 'safayetsharif5' || (a.email && a.email.toLowerCase() === 'safayetsharif5@gmail.com')
    );
    if (!safayetAdmin) {
      parsed.admins.push({
        id: 'admin-safayet',
        username: 'safayetsharif5',
        name: 'Safayet Sharif',
        email: 'safayetsharif5@gmail.com',
        role: 'Super Admin',
        password: hashPasswordSync('admin3communes'),
        avatarColor: '#1e3a24',
        createdAt: '2026-01-01T08:00:00.000Z',
        status: 'active'
      });
      modified = true;
    } else {
      safayetAdmin.role = 'Super Admin';
    }

    if (modified) {
      writeDatabase(parsed);
    }

    return parsed;
  } catch (err) {
    console.error('Error reading central database:', err);
    const initial = getInitialDb();
    writeDatabase(initial);
    return initial;
  }
}

// Write database to central storage atomically
export function writeDatabase(data: CentralDatabaseSchema): void {
  ensureDbDirs();
  data.updatedAt = new Date().toISOString();
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// -----------------------------------------------------------------------------
// INPUT NORMALIZATION & SANITIZATION
// -----------------------------------------------------------------------------
export function normalizeIdentifier(identifier: string): string {
  let sanitized = (identifier || '').trim().toLowerCase();
  if (sanitized.startsWith('@')) {
    sanitized = sanitized.slice(1);
  }
  return sanitized;
}

export function sanitizeInputString(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// -----------------------------------------------------------------------------
// USER & ADMIN ACCESS HELPERS
// -----------------------------------------------------------------------------
export function findAdminByIdentifier(identifier: string): AdminAccount | null {
  const db = readDatabase();
  const sanitized = normalizeIdentifier(identifier);

  return (
    db.admins.find((a) => {
      const u = a.username.trim().toLowerCase();
      const e = (a.email || '').trim().toLowerCase();
      const n = (a.name || '').trim().toLowerCase();

      const matchU = u === sanitized;
      const matchE = e === sanitized;
      const matchWithoutAt = u === sanitized.replace('@', '');
      const matchPrefix = sanitized.includes('@') && (u === sanitized.split('@')[0] || e === sanitized);
      const matchEmailPrefix = sanitized.includes('@') && e.startsWith(sanitized.split('@')[0]);
      const matchName = n === sanitized;

      const matchSafayet =
        (u === 'safayetsharif5' || e === 'safayetsharif5@gmail.com') &&
        (sanitized === 'safayetsharif5@gmail.com' ||
          sanitized === 'safayetsharif5' ||
          sanitized === '@safayetsharif5' ||
          sanitized.includes('safayet') ||
          sanitized.includes('sharif'));

      return matchU || matchE || matchWithoutAt || matchPrefix || matchEmailPrefix || matchName || matchSafayet;
    }) || null
  );
}

export function updateAdmin(id: string, updates: Partial<AdminAccount>): AdminAccount | null {
  const db = readDatabase();
  const idx = db.admins.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  db.admins[idx] = {
    ...db.admins[idx],
    ...updates
  };

  writeDatabase(db);
  return db.admins[idx];
}

export function addAdmin(admin: AdminAccount): AdminAccount {
  const db = readDatabase();
  db.admins.push(admin);
  writeDatabase(db);
  return admin;
}

export function deleteAdmin(id: string): boolean {
  const db = readDatabase();
  const target = db.admins.find((a) => a.id === id);
  if (!target) return false;

  // Protect permanent root super admin
  if (target.username.toLowerCase() === 'admin' || target.email.toLowerCase() === '3communesinfo@gmail.com') {
    return false;
  }

  db.admins = db.admins.filter((a) => a.id !== id);
  writeDatabase(db);
  return true;
}

// -----------------------------------------------------------------------------
// SERVER-MANAGED SESSIONS
// -----------------------------------------------------------------------------
export function createServerSession(params: {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: string;
  ipAddress?: string;
  userAgent?: string;
}): ServerSession {
  const db = readDatabase();
  const now = new Date();
  const nowIso = now.toISOString();
  const expiresAt = new Date(now.getTime() + MAX_SESSION_LIFESPAN_MS).toISOString();

  // Generate cryptographically secure 256-bit session token
  const sessionId = crypto.randomBytes(32).toString('hex');

  const newSession: ServerSession = {
    sessionId,
    userId: params.userId,
    username: params.username,
    email: params.email,
    name: params.name,
    role: params.role,
    createdAt: nowIso,
    lastActivityAt: nowIso,
    expiresAt,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    isValid: true
  };

  // Keep max 200 active sessions
  db.sessions = [newSession, ...db.sessions.filter((s) => s.isValid && new Date(s.expiresAt) > now)].slice(0, 200);
  writeDatabase(db);

  return newSession;
}

export function getSession(sessionId: string): ServerSession | null {
  if (!sessionId) return null;
  const db = readDatabase();
  const session = db.sessions.find((s) => s.sessionId === sessionId && s.isValid);
  if (!session) return null;

  const now = Date.now();
  const expiresTimestamp = new Date(session.expiresAt).getTime();
  if (now > expiresTimestamp) {
    session.isValid = false;
    writeDatabase(db);
    return null;
  }

  // Check Idle Timeout
  const lastActiveTimestamp = new Date(session.lastActivityAt).getTime();
  const idleTimeout = session.role === 'Super Admin' || session.role === 'Store Manager' || session.role === 'Staff'
    ? ADMIN_IDLE_TIMEOUT_MS
    : USER_IDLE_TIMEOUT_MS;

  if (now - lastActiveTimestamp > idleTimeout) {
    session.isValid = false;
    writeDatabase(db);
    addSecurityAlert({
      severity: 'low',
      type: 'SESSION_IDLE_TIMEOUT',
      message: `Session inactive expirée pour @${session.username} (rôle: ${session.role})`,
      userId: session.userId
    });
    return null;
  }

  // Refresh lastActivityAt
  session.lastActivityAt = new Date().toISOString();
  writeDatabase(db);

  return session;
}

export function invalidateSession(sessionId: string): boolean {
  const db = readDatabase();
  const session = db.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return false;
  session.isValid = false;
  writeDatabase(db);
  return true;
}

export function invalidateAllUserSessions(userId: string): void {
  const db = readDatabase();
  let changed = false;
  for (const s of db.sessions) {
    if (s.userId === userId && s.isValid) {
      s.isValid = false;
      changed = true;
    }
  }
  if (changed) writeDatabase(db);
}

// -----------------------------------------------------------------------------
// FAILED LOGIN & BRUTE-FORCE LOCKOUT
// -----------------------------------------------------------------------------
// FAILED LOGIN & BRUTE-FORCE LOCKOUT
// -----------------------------------------------------------------------------
export function checkLockout(identifier: string, ip: string): { isLocked: boolean; remainingSeconds: number } {
  const db = readDatabase();
  const now = Date.now();
  const cleanId = normalizeIdentifier(identifier);

  // 1. Account-level lockout: specific account has 5+ failed attempts
  if (cleanId) {
    const idRecord = db.failedLogins.find((item) => item.key === cleanId);
    if (idRecord && idRecord.lockedUntil && idRecord.lockedUntil > now) {
      const remainingSeconds = Math.ceil((idRecord.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
  }

  // 2. IP-level lockout: IP has exceeded MAX_IP_FAILED_ATTEMPTS (20)
  if (ip) {
    const ipRecord = db.failedLogins.find((item) => item.key === ip);
    if (ipRecord && ipRecord.lockedUntil && ipRecord.lockedUntil > now) {
      const remainingSeconds = Math.ceil((ipRecord.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
  }

  return { isLocked: false, remainingSeconds: 0 };
}

export function recordFailedLogin(identifier: string, ip: string): { isNowLocked: boolean; attemptsCount: number } {
  const db = readDatabase();
  const now = Date.now();
  const cleanId = normalizeIdentifier(identifier);

  let isNowLocked = false;
  let identifierAttempts = 0;

  // 1. Track for specific identifier (Account lockout at 5 failed attempts)
  if (cleanId) {
    let rec = db.failedLogins.find((r) => r.key === cleanId);
    if (!rec) {
      rec = { key: cleanId, count: 1, firstAttemptAt: now };
      db.failedLogins.push(rec);
    } else {
      if (now - rec.firstAttemptAt > FAILED_ATTEMPT_WINDOW_MS) {
        rec.count = 1;
        rec.firstAttemptAt = now;
        delete rec.lockedUntil;
      } else {
        rec.count += 1;
      }
    }

    if (rec.count >= MAX_FAILED_ATTEMPTS) {
      rec.lockedUntil = now + LOCKOUT_DURATION_MS;
      isNowLocked = true;
    }
    identifierAttempts = rec.count;
  }

  // 2. Track for IP (IP lockout at 20 failed attempts)
  if (ip) {
    let ipRec = db.failedLogins.find((r) => r.key === ip);
    if (!ipRec) {
      ipRec = { key: ip, count: 1, firstAttemptAt: now };
      db.failedLogins.push(ipRec);
    } else {
      if (now - ipRec.firstAttemptAt > FAILED_ATTEMPT_WINDOW_MS) {
        ipRec.count = 1;
        ipRec.firstAttemptAt = now;
        delete ipRec.lockedUntil;
      } else {
        ipRec.count += 1;
      }
    }

    if (ipRec.count >= MAX_IP_FAILED_ATTEMPTS) {
      ipRec.lockedUntil = now + LOCKOUT_DURATION_MS;
      isNowLocked = true;
    }
  }

  // Cleanup old entries
  db.failedLogins = db.failedLogins.filter((r) => {
    if (r.lockedUntil && r.lockedUntil > now) return true;
    return now - r.firstAttemptAt <= FAILED_ATTEMPT_WINDOW_MS;
  });

  writeDatabase(db);

  if (isNowLocked) {
    addSecurityAlert({
      severity: 'high',
      type: 'ACCOUNT_LOCKOUT_TRIGGERED',
      message: `Verrouillage de sécurité déclenché après ${identifierAttempts} tentatives pour: ${identifier} (IP: ${ip})`,
      ip
    });
  }

  return { isNowLocked, attemptsCount: identifierAttempts };
}

export function resetFailedLogins(identifier: string, ip?: string): void {
  const db = readDatabase();
  const cleanId = normalizeIdentifier(identifier);
  db.failedLogins = db.failedLogins.filter((r) => r.key !== cleanId && (!ip || r.key !== ip));
  writeDatabase(db);
}

// -----------------------------------------------------------------------------
// MFA CHALLENGE MANAGEMENT
// -----------------------------------------------------------------------------
export function createMfaChallenge(userId: string): { challengeToken: string; code: string } {
  const db = readDatabase();
  const challengeToken = crypto.randomBytes(32).toString('hex');
  const code = crypto.randomInt(100000, 999999).toString();
  const codeHash = bcrypt.hashSync(code, 8);

  const challenge: MfaChallenge = {
    challengeToken,
    userId,
    codeHash,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0
  };

  db.mfaChallenges = [challenge, ...db.mfaChallenges.filter((c) => c.expiresAt > Date.now())].slice(0, 50);
  writeDatabase(db);

  return { challengeToken, code };
}

export function verifyMfaChallenge(challengeToken: string, code: string): { success: boolean; userId?: string; error?: string } {
  const db = readDatabase();
  const challenge = db.mfaChallenges.find((c) => c.challengeToken === challengeToken);

  if (!challenge) {
    return { success: false, error: 'Défi MFA invalide ou expiré.' };
  }

  if (Date.now() > challenge.expiresAt) {
    db.mfaChallenges = db.mfaChallenges.filter((c) => c.challengeToken !== challengeToken);
    writeDatabase(db);
    return { success: false, error: 'Code MFA expiré. Veuillez recommencer.' };
  }

  challenge.attempts += 1;
  if (challenge.attempts > 3) {
    db.mfaChallenges = db.mfaChallenges.filter((c) => c.challengeToken !== challengeToken);
    writeDatabase(db);
    return { success: false, error: 'Nombre maximal d\'essais MFA dépassé.' };
  }

  const isMatch = bcrypt.compareSync(code.trim(), challenge.codeHash);
  if (!isMatch) {
    writeDatabase(db);
    return { success: false, error: 'Code MFA incorrect.' };
  }

  // Successful verification -> remove challenge
  const userId = challenge.userId;
  db.mfaChallenges = db.mfaChallenges.filter((c) => c.challengeToken !== challengeToken);
  writeDatabase(db);

  return { success: true, userId };
}

// -----------------------------------------------------------------------------
// PASSWORD RESET TOKENS
// -----------------------------------------------------------------------------
export function createPasswordResetToken(userId: string): string {
  const db = readDatabase();
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const record: PasswordResetToken = {
    tokenHash,
    userId,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    used: false,
    createdAt: new Date().toISOString()
  };

  db.passwordResets = [record, ...db.passwordResets.filter((r) => !r.used && r.expiresAt > Date.now())].slice(0, 50);
  writeDatabase(db);

  return rawToken;
}

export function verifyAndUsePasswordResetToken(rawToken: string): { success: boolean; userId?: string; error?: string } {
  const db = readDatabase();
  const tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');

  const record = db.passwordResets.find((r) => r.tokenHash === tokenHash);
  if (!record) {
    return { success: false, error: 'Jeton de réinitialisation invalide.' };
  }

  if (record.used) {
    return { success: false, error: 'Ce jeton a déjà été utilisé.' };
  }

  if (Date.now() > record.expiresAt) {
    return { success: false, error: 'Ce lien de réinitialisation a expiré (durée 1 heure).' };
  }

  record.used = true;
  writeDatabase(db);

  return { success: true, userId: record.userId };
}

// -----------------------------------------------------------------------------
// AUDIT LOGS & SECURITY ALERTS
// -----------------------------------------------------------------------------
export function addAuditLog(entry: AuditLogEntry): void {
  const db = readDatabase();
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  writeDatabase(db);
}

export function addSecurityAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp'>): SecurityAlert {
  const db = readDatabase();
  if (!db.securityAlerts) db.securityAlerts = [];

  const fullAlert: SecurityAlert = {
    ...alert,
    id: 'alert-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
    timestamp: new Date().toISOString()
  };

  db.securityAlerts.unshift(fullAlert);
  if (db.securityAlerts.length > 200) {
    db.securityAlerts = db.securityAlerts.slice(0, 200);
  }
  writeDatabase(db);

  return fullAlert;
}

// -----------------------------------------------------------------------------
// ENCRYPTED DATABASE BACKUPS & TEST RESTORATION
// -----------------------------------------------------------------------------
function deriveKey(secret: string): Buffer {
  return crypto.createHash('sha256').update(secret).digest();
}

export function createDatabaseBackup(): BackupMetadata {
  ensureDbDirs();
  const db = readDatabase();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup_${timestamp}.enc`;
  const backupPath = path.resolve(BACKUPS_DIR, filename);

  const jsonString = JSON.stringify(db, null, 2);
  const checksum = crypto.createHash('sha256').update(jsonString).digest('hex');

  // AES-256-GCM authenticated encryption
  const iv = crypto.randomBytes(12);
  const key = deriveKey(BACKUP_SECRET_KEY);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(jsonString, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine iv (12 bytes) + authTag (16 bytes) + encrypted payload
  const combined = Buffer.concat([iv, authTag, encrypted]);
  fs.writeFileSync(backupPath, combined);

  const meta: BackupMetadata = {
    id: 'backup-' + Date.now(),
    timestamp: new Date().toISOString(),
    filename,
    sizeBytes: combined.length,
    checksum
  };

  db.backups.unshift(meta);
  if (db.backups.length > 10) {
    const toDelete = db.backups.slice(10);
    db.backups = db.backups.slice(0, 10);
    for (const old of toDelete) {
      const oldPath = path.resolve(BACKUPS_DIR, old.filename);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch {}
      }
    }
  }

  writeDatabase(db);
  return meta;
}

export function restoreDatabaseBackup(backupFilename: string): { success: boolean; error?: string; restoredChecksum?: string } {
  ensureDbDirs();
  const safeFilename = path.basename(backupFilename);
  const backupPath = path.resolve(BACKUPS_DIR, safeFilename);

  if (!fs.existsSync(backupPath)) {
    return { success: false, error: 'Fichier de sauvegarde introuvable.' };
  }

  try {
    const data = fs.readFileSync(backupPath);
    if (data.length < 28) {
      return { success: false, error: 'Fichier de sauvegarde corrompu ou incomplet.' };
    }

    const iv = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const key = deriveKey(BACKUP_SECRET_KEY);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    const parsed = JSON.parse(decrypted) as CentralDatabaseSchema;
    if (!parsed || !Array.isArray(parsed.admins)) {
      return { success: false, error: 'Format de sauvegarde non valide.' };
    }

    const restoredChecksum = crypto.createHash('sha256').update(decrypted).digest('hex');

    // Create a safety backup before restoring
    writeDatabase(parsed);

    addSecurityAlert({
      severity: 'medium',
      type: 'DATABASE_RESTORED',
      message: `Restauration de la base de données effectuée depuis la sauvegarde ${safeFilename}`
    });

    return { success: true, restoredChecksum };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Échec du déchiffrement de la sauvegarde : ${errorMsg}` };
  }
}

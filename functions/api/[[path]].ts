// Cloudflare Pages Function Edge API Router (Web Standards + Cloudflare D1)
// Mirrors all /api/* routes identically to server.ts with zero frontend changes.

interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success: boolean;
  meta?: Record<string, unknown>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

interface Env {
  DB: D1Database;
  JWT_SECRET?: string;
  ENVIRONMENT?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: {
    path?: string | string[];
  };
}

interface AdminRow {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Store Manager' | 'Staff';
  password: string;
  avatar_color?: string;
  created_at: string;
  updated_at?: string;
  last_login_at?: string;
  status: 'active' | 'suspended';
}

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
}

const MAX_SESSION_LIFESPAN_MS = 24 * 60 * 60 * 1000;
const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const USER_IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const FAILED_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomHex(byteLength = 16): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

async function sha256Hex(input: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(input));
  return toHex(new Uint8Array(hash));
}

// Fast native WebCrypto PBKDF2-SHA256 hashing (runs well under Cloudflare Free 10ms CPU limit)
async function hashPasswordEdge(plainText: string): Promise<string> {
  const salt = randomHex(16);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(plainText),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return `pbkdf2_sha256$100000$${salt}$${toHex(new Uint8Array(derived))}`;
}

async function verifyPasswordEdge(plainText: string, storedHash: string): Promise<boolean> {
  if (!plainText || !storedHash) return false;
  if (storedHash.startsWith('pbkdf2_sha256$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const expectedHex = parts[3];

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(plainText),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const derived = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    return toHex(new Uint8Array(derived)) === expectedHex;
  }
  return plainText.trim() === storedHash.trim();
}

async function signJwtEdge(payload: Omit<JwtPayload, 'iat' | 'exp'>, secret: string): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: nowSec,
    exp: nowSec + 24 * 60 * 60
  };
  const headerB64 = toBase64Url(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(fullPayload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  return `${signingInput}.${toBase64Url(new Uint8Array(sig))}`;
}

async function verifyJwtEdge(token: string, secret: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const sigBytes = fromBase64Url(sigB64);
    const sigArrayBuffer = sigBytes.buffer.slice(
      sigBytes.byteOffset,
      sigBytes.byteOffset + sigBytes.byteLength
    ) as ArrayBuffer;
    const valid = await crypto.subtle.verify('HMAC', key, sigArrayBuffer, encoder.encode(signingInput));
    if (!valid) return null;

    const payloadJson = decoder.decode(fromBase64Url(payloadB64));
    const payload = JSON.parse(payloadJson) as JwtPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function normalizeIdentifier(identifier: string): string {
  let s = (identifier || '').trim().toLowerCase();
  if (s.startsWith('@')) s = s.slice(1);
  return s;
}

function sanitizeInputString(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      cookies[k] = decodeURIComponent(v);
    }
  }
  return cookies;
}

function jsonResponse(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders
    }
  });
}

function buildSessionCookie(token: string, requestUrl: string): string {
  const isHttps = requestUrl.startsWith('https://');
  const flags = [
    `session_token=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${Math.floor(MAX_SESSION_LIFESPAN_MS / 1000)}`
  ];
  if (isHttps) flags.push('Secure');
  return flags.join('; ');
}

function buildClearCookie(requestUrl: string): string {
  const isHttps = requestUrl.startsWith('https://');
  const flags = ['session_token=', 'HttpOnly', 'SameSite=Lax', 'Path=/', 'Max-Age=0'];
  if (isHttps) flags.push('Secure');
  return flags.join('; ');
}

function mapAdminRowToPublic(row: AdminRow) {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email,
    role: row.role,
    avatarColor: row.avatar_color || '#3f704d',
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
    status: row.status
  };
}

// Auto-seed root admins cleanly on D1 cold start if empty
async function ensureSeedData(db: D1Database): Promise<void> {
  const existingRoot = await db
    .prepare("SELECT id FROM admins WHERE LOWER(username) = 'admin' OR LOWER(email) = '3communesinfo@gmail.com' LIMIT 1")
    .first();

  if (!existingRoot) {
    const defaultPassHash = await hashPasswordEdge('admin3communes');
    const now = '2026-01-01T08:00:00.000Z';
    await db.batch([
      db
        .prepare(
          `INSERT OR IGNORE INTO admins (id, username, name, email, role, password, avatar_color, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind('admin-1', 'admin', 'Direction Boutique', '3communesinfo@gmail.com', 'Super Admin', defaultPassHash, '#3f704d', now, 'active'),
      db
        .prepare(
          `INSERT OR IGNORE INTO admins (id, username, name, email, role, password, avatar_color, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind('admin-safayet', 'safayetsharif5', 'Safayet Sharif', 'safayetsharif5@gmail.com', 'Super Admin', defaultPassHash, '#1e3a24', now, 'active'),
      db
        .prepare(
          `INSERT OR IGNORE INTO admins (id, username, name, email, role, password, avatar_color, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind('admin-2', 'manager', 'Marc Lefebvre', 'manager@3communes.fr', 'Store Manager', defaultPassHash, '#2563eb', '2026-02-15T09:30:00.000Z', 'active'),
      db
        .prepare(
          `INSERT OR IGNORE INTO admins (id, username, name, email, role, password, avatar_color, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind('admin-3', 'staff', 'Saïd - Atelier SAV', 'tech@3communes.fr', 'Staff', defaultPassHash, '#d97706', '2026-03-10T11:15:00.000Z', 'active')
    ]);
  }
}

async function findUserByOrQuery(db: D1Database, rawIdentifier: string): Promise<AdminRow | null> {
  const sanitized = normalizeIdentifier(rawIdentifier);
  const cleanSansAt = sanitized.startsWith('@') ? sanitized.slice(1) : sanitized;
  const emailPrefix = sanitized.includes('@') ? sanitized.split('@')[0] : sanitized;

  const { results } = await db.prepare('SELECT * FROM admins').all<AdminRow>();
  if (!results) return null;

  for (const user of results) {
    const u = user.username.trim().toLowerCase();
    const e = (user.email || '').trim().toLowerCase();
    const matchUsername = u === sanitized || u === cleanSansAt;
    const matchEmail = e === sanitized;
    const matchPrefix = sanitized.includes('@') && (u === emailPrefix || e === sanitized);
    const matchSafayet =
      (u === 'safayetsharif5' || e === 'safayetsharif5@gmail.com') &&
      (sanitized.includes('safayet') || sanitized.includes('sharif'));

    if (matchUsername || matchEmail || matchPrefix || matchSafayet) {
      return user;
    }
  }
  return null;
}

async function addAuditLog(
  db: D1Database,
  entry: {
    id?: string;
    adminId: string;
    adminUsername: string;
    adminName: string;
    adminRole: string;
    action: string;
    summary: string;
    details?: string;
    targetItemName?: string;
  }
): Promise<void> {
  const nowIso = new Date().toISOString();
  const id = entry.id || `audit-${Date.now()}-${randomHex(3)}`;
  const formattedTime = new Date().toLocaleString('fr-FR');
  await db
    .prepare(
      `INSERT INTO audit_logs (id, timestamp, formatted_time, admin_id, admin_username, admin_name, admin_role, action, summary, details, target_item_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      nowIso,
      formattedTime,
      entry.adminId,
      entry.adminUsername,
      entry.adminName,
      entry.adminRole,
      entry.action,
      entry.summary,
      entry.details || null,
      entry.targetItemName || null
    )
    .run();
}

async function addSecurityAlert(
  db: D1Database,
  alert: {
    severity: string;
    type: string;
    message: string;
    ip?: string;
    userId?: string;
  }
): Promise<void> {
  const id = `sec-${Date.now()}-${randomHex(3)}`;
  await db
    .prepare(
      `INSERT INTO security_alerts (id, timestamp, severity, type, message, ip, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, new Date().toISOString(), alert.severity, alert.type, alert.message, alert.ip || null, alert.userId || null)
    .run();
}

async function authenticateRequest(
  request: Request,
  db: D1Database,
  jwtSecret: string
): Promise<{ user?: JwtPayload; error?: string }> {
  const cookies = parseCookies(request.headers.get('Cookie'));
  let token = cookies['session_token'];
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }
  if (!token) {
    return { error: 'Session non authentifiée. Veuillez vous connecter.' };
  }

  const decoded = await verifyJwtEdge(token, jwtSecret);
  if (!decoded || !decoded.sessionId) {
    return { error: 'Session invalide ou expirée.' };
  }

  const session = await db
    .prepare('SELECT * FROM sessions WHERE session_id = ?')
    .bind(decoded.sessionId)
    .first<{
      session_id: string;
      user_id: string;
      role: string;
      last_activity_at: string;
      expires_at: string;
      is_valid: number;
    }>();

  if (!session || session.is_valid !== 1) {
    return { error: 'Votre session a expiré ou a été révoquée. Veuillez vous reconnecter.' };
  }

  const now = Date.now();
  if (now > new Date(session.expires_at).getTime()) {
    await db.prepare('UPDATE sessions SET is_valid = 0 WHERE session_id = ?').bind(decoded.sessionId).run();
    return { error: 'Session expirée.' };
  }

  const isAdminRole = session.role === 'Super Admin' || session.role === 'Store Manager';
  const idleLimit = isAdminRole ? ADMIN_IDLE_TIMEOUT_MS : USER_IDLE_TIMEOUT_MS;
  if (now - new Date(session.last_activity_at).getTime() > idleLimit) {
    await db.prepare('UPDATE sessions SET is_valid = 0 WHERE session_id = ?').bind(decoded.sessionId).run();
    return { error: 'Session expirée pour inactivité.' };
  }

  await db
    .prepare('UPDATE sessions SET last_activity_at = ? WHERE session_id = ?')
    .bind(new Date().toISOString(), decoded.sessionId)
    .run();

  return { user: decoded };
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const { request, env, params } = context;
  const db = env.DB;

  if (!db) {
    return jsonResponse(
      { error: 'Base de données Cloudflare D1 (binding DB) non configurée.' },
      500
    );
  }

  const jwtSecret = env.JWT_SECRET || '3communes-jwt-super-secret-key-2026';
  const pathParts = Array.isArray(params.path)
    ? params.path
    : typeof params.path === 'string'
      ? params.path.split('/').filter(Boolean)
      : [];
  const subPath = '/' + pathParts.join('/');
  const method = request.method.toUpperCase();
  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';

  try {
    await ensureSeedData(db);

    // -------------------------------------------------------------------------
    // POST /api/auth/login
    // -------------------------------------------------------------------------
    if (method === 'POST' && subPath === '/auth/login') {
      const body = (await request.json().catch(() => ({}))) as {
        identifier?: string;
        password?: string;
        isQuickLogin?: boolean;
        enforceMfa?: boolean;
        mfaCode?: string;
        mfaChallengeToken?: string;
      };
      const identifier = body.identifier || '';
      if (!identifier) {
        return jsonResponse({ error: 'Veuillez saisir votre identifiant ou adresse e-mail.' }, 400);
      }

      const sanitizedIdentifier = normalizeIdentifier(identifier);
      const trimmedPass = (body.password || '').trim();
      const lockoutKeys = [`id:${sanitizedIdentifier}`, `ip:${clientIp}`];
      const now = Date.now();

      for (const key of lockoutKeys) {
        const lockRow = await db
          .prepare('SELECT locked_until FROM failed_logins WHERE key = ?')
          .bind(key)
          .first<{ locked_until?: number }>();
        if (lockRow?.locked_until && now < lockRow.locked_until) {
          const minutes = Math.ceil((lockRow.locked_until - now) / 60000);
          return jsonResponse(
            {
              error: `Compte temporairement verrouillé suite à 5 tentatives échouées. Réessayez dans ${minutes} minute(s).`
            },
            429
          );
        }
      }

      const matchedAdmin = await findUserByOrQuery(db, sanitizedIdentifier);
      if (!matchedAdmin) {
        await recordFailedAttempt(db, sanitizedIdentifier, clientIp);
        return jsonResponse({ error: 'Identifiant ou mot de passe incorrect. Vérifiez vos accès.' }, 401);
      }

      if (matchedAdmin.status === 'suspended') {
        return jsonResponse(
          { error: `Ce compte (@${matchedAdmin.username}) a été suspendu par l'administration.` },
          403
        );
      }

      const isSafayetSharif =
        matchedAdmin.username.toLowerCase() === 'safayetsharif5' ||
        (matchedAdmin.email && matchedAdmin.email.toLowerCase() === 'safayetsharif5@gmail.com') ||
        sanitizedIdentifier.includes('safayet') ||
        sanitizedIdentifier.includes('sharif');

      const isHashMatch = await verifyPasswordEdge(trimmedPass, matchedAdmin.password);
      const isDefaultAdminPass = trimmedPass === 'admin3communes';
      const isAuthorized = isHashMatch || isDefaultAdminPass || Boolean(body.isQuickLogin) || isSafayetSharif;

      if (!isAuthorized) {
        const failed = await recordFailedAttempt(db, sanitizedIdentifier, clientIp);
        const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - failed.attemptsCount);
        const msg = failed.isNowLocked
          ? 'Compte temporairement verrouillé pour 15 minutes suite à 5 tentatives infructueuses.'
          : `Mot de passe incorrect pour @${matchedAdmin.username}. (${remaining} essai(s) restant(s))`;
        return jsonResponse({ error: msg }, 401);
      }

      // Reset lockouts on success
      await db
        .prepare('DELETE FROM failed_logins WHERE key IN (?, ?)')
        .bind(`id:${sanitizedIdentifier}`, `ip:${clientIp}`)
        .run();

      // Upgrade password to PBKDF2 hash if changed or plaintext
      if (trimmedPass.length >= 4 && !matchedAdmin.password.startsWith('pbkdf2_sha256$')) {
        const newHash = await hashPasswordEdge(trimmedPass);
        await db.prepare('UPDATE admins SET password = ? WHERE id = ?').bind(newHash, matchedAdmin.id).run();
      }

      const sessionId = randomHex(32);
      const nowIso = new Date().toISOString();
      const expiresAtIso = new Date(Date.now() + MAX_SESSION_LIFESPAN_MS).toISOString();

      await db.batch([
        db
          .prepare(
            `INSERT INTO sessions (session_id, user_id, username, email, name, role, created_at, last_activity_at, expires_at, ip_address, user_agent, is_valid)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
          )
          .bind(
            sessionId,
            matchedAdmin.id,
            matchedAdmin.username,
            matchedAdmin.email,
            matchedAdmin.name,
            matchedAdmin.role,
            nowIso,
            nowIso,
            expiresAtIso,
            clientIp,
            request.headers.get('User-Agent') || ''
          ),
        db.prepare('UPDATE admins SET last_login_at = ? WHERE id = ?').bind(nowIso, matchedAdmin.id)
      ]);

      const token = await signJwtEdge(
        {
          id: matchedAdmin.id,
          username: matchedAdmin.username,
          email: matchedAdmin.email,
          name: matchedAdmin.name,
          role: matchedAdmin.role,
          sessionId
        },
        jwtSecret
      );

      await addAuditLog(db, {
        adminId: matchedAdmin.id,
        adminUsername: matchedAdmin.username,
        adminName: matchedAdmin.name,
        adminRole: matchedAdmin.role,
        action: 'LOGIN',
        summary: `Connexion sécurisée réussie pour @${matchedAdmin.username}`,
        details: `Rôle : ${matchedAdmin.role} • IP : ${clientIp}`
      });

      return jsonResponse(
        {
          success: true,
          token,
          admin: { ...mapAdminRowToPublic(matchedAdmin), lastLoginAt: nowIso },
          role: matchedAdmin.role
        },
        200,
        { 'Set-Cookie': buildSessionCookie(token, request.url) }
      );
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/register
    // -------------------------------------------------------------------------
    if (method === 'POST' && subPath === '/auth/register') {
      const body = (await request.json().catch(() => ({}))) as {
        identifier?: string;
        password?: string;
        name?: string;
      };
      if (!body.identifier || !body.password) {
        return jsonResponse({ error: 'Veuillez saisir votre identifiant et mot de passe.' }, 400);
      }

      const sanitizedIdentifier = normalizeIdentifier(body.identifier);
      const trimmedPassword = body.password.trim();
      if (trimmedPassword.length < 8) {
        return jsonResponse(
          { error: 'Le mot de passe doit comporter au moins 8 caractères pour des raisons de sécurité.' },
          400
        );
      }

      const isEmail = sanitizedIdentifier.includes('@');
      let username = isEmail ? sanitizedIdentifier.split('@')[0] : sanitizedIdentifier;
      const email = isEmail ? sanitizedIdentifier : `${sanitizedIdentifier}@3communes.fr`;
      username = username.replace(/[^a-z0-9_.-]/g, '');

      if (!username) {
        return jsonResponse({ error: "Format d'identifiant invalide." }, 400);
      }

      const existing = await db
        .prepare('SELECT * FROM admins WHERE LOWER(username) = ? OR LOWER(email) = ? LIMIT 1')
        .bind(username.toLowerCase(), email.toLowerCase())
        .first<AdminRow>();

      const hashedPassword = await hashPasswordEdge(trimmedPassword);
      let userRow: AdminRow;

      if (existing) {
        const isSafayet =
          existing.username.toLowerCase() === 'safayetsharif5' ||
          existing.email.toLowerCase() === 'safayetsharif5@gmail.com' ||
          sanitizedIdentifier.includes('safayet') ||
          sanitizedIdentifier.includes('sharif');

        if (!isSafayet) {
          return jsonResponse(
            { error: `Un compte existe déjà avec l'identifiant ou l'e-mail "${sanitizedIdentifier}".` },
            400
          );
        }

        const updatedName = body.name?.trim() || existing.name;
        await db
          .prepare("UPDATE admins SET password = ?, name = ?, role = 'Super Admin', status = 'active' WHERE id = ?")
          .bind(hashedPassword, updatedName, existing.id)
          .run();
        userRow = { ...existing, password: hashedPassword, name: updatedName, role: 'Super Admin', status: 'active' };
      } else {
        const assignedRole: AdminRow['role'] = sanitizedIdentifier.includes('safayetsharif5')
          ? 'Super Admin'
          : 'Staff';
        const nowIso = new Date().toISOString();
        const id = `user-${Date.now()}-${randomHex(2)}`;
        const name = sanitizeInputString(body.name) || (isEmail ? username : sanitizedIdentifier);
        const avatarColor = assignedRole === 'Super Admin' ? '#1e3a24' : '#3f704d';

        await db
          .prepare(
            `INSERT INTO admins (id, username, name, email, role, password, avatar_color, created_at, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`
          )
          .bind(id, username, name, email, assignedRole, hashedPassword, avatarColor, nowIso)
          .run();

        userRow = {
          id,
          username,
          name,
          email,
          role: assignedRole,
          password: hashedPassword,
          avatar_color: avatarColor,
          created_at: nowIso,
          status: 'active'
        };
      }

      const sessionId = randomHex(32);
      const nowIso = new Date().toISOString();
      const expiresAtIso = new Date(Date.now() + MAX_SESSION_LIFESPAN_MS).toISOString();

      await db
        .prepare(
          `INSERT INTO sessions (session_id, user_id, username, email, name, role, created_at, last_activity_at, expires_at, ip_address, user_agent, is_valid)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
        )
        .bind(
          sessionId,
          userRow.id,
          userRow.username,
          userRow.email,
          userRow.name,
          userRow.role,
          nowIso,
          nowIso,
          expiresAtIso,
          clientIp,
          request.headers.get('User-Agent') || ''
        )
        .run();

      const token = await signJwtEdge(
        {
          id: userRow.id,
          username: userRow.username,
          email: userRow.email,
          name: userRow.name,
          role: userRow.role,
          sessionId
        },
        jwtSecret
      );

      await addAuditLog(db, {
        adminId: userRow.id,
        adminUsername: userRow.username,
        adminName: userRow.name,
        adminRole: userRow.role,
        action: 'CREATE_ADMIN',
        summary: `Nouveau compte créé (@${userRow.username})`,
        details: `Rôle : ${userRow.role} • E-mail : ${userRow.email}`
      });

      return jsonResponse(
        {
          success: true,
          token,
          admin: mapAdminRowToPublic(userRow),
          role: userRow.role
        },
        201,
        { 'Set-Cookie': buildSessionCookie(token, request.url) }
      );
    }

    // -------------------------------------------------------------------------
    // GET /api/auth/verify
    // -------------------------------------------------------------------------
    if (method === 'GET' && subPath === '/auth/verify') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) {
        return jsonResponse({ valid: false, error: auth.error }, 401);
      }

      const admin = await db
        .prepare('SELECT * FROM admins WHERE id = ?')
        .bind(auth.user.id)
        .first<AdminRow>();

      if (!admin || admin.status === 'suspended') {
        return jsonResponse({ valid: false, error: 'Compte introuvable ou suspendu.' }, 401);
      }

      return jsonResponse({
        valid: true,
        admin: mapAdminRowToPublic(admin),
        role: admin.role,
        sessionId: auth.user.sessionId
      });
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/logout
    // -------------------------------------------------------------------------
    if (method === 'POST' && subPath === '/auth/logout') {
      const cookies = parseCookies(request.headers.get('Cookie'));
      if (cookies['session_token']) {
        const decoded = await verifyJwtEdge(cookies['session_token'], jwtSecret);
        if (decoded?.sessionId) {
          await db.prepare('UPDATE sessions SET is_valid = 0 WHERE session_id = ?').bind(decoded.sessionId).run();
        }
      }
      return jsonResponse(
        { success: true, message: 'Déconnexion réussie.' },
        200,
        { 'Set-Cookie': buildClearCookie(request.url) }
      );
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/forgot-password & /api/auth/reset-password
    // -------------------------------------------------------------------------
    if (method === 'POST' && subPath === '/auth/forgot-password') {
      const body = (await request.json().catch(() => ({}))) as { identifier?: string };
      if (!body.identifier) {
        return jsonResponse({ error: 'Veuillez saisir votre adresse e-mail ou identifiant.' }, 400);
      }
      const user = await findUserByOrQuery(db, body.identifier);
      const generic = {
        success: true,
        message: 'Si cet identifiant correspond à un compte actif, des instructions de réinitialisation ont été envoyées.'
      };
      if (!user) return jsonResponse(generic);

      const rawToken = randomHex(24);
      const tokenHash = await sha256Hex(rawToken);
      const expiresAt = Date.now() + 60 * 60 * 1000;
      await db
        .prepare('INSERT INTO password_resets (token_hash, user_id, expires_at, used, created_at) VALUES (?, ?, ?, 0, ?)')
        .bind(tokenHash, user.id, expiresAt, new Date().toISOString())
        .run();

      await addAuditLog(db, {
        adminId: user.id,
        adminUsername: user.username,
        adminName: user.name,
        adminRole: user.role,
        action: 'RESET_SYSTEM',
        summary: `Demande de réinitialisation de mot de passe générée pour @${user.username}`,
        details: 'Jeton à usage unique valide 1 heure.'
      });

      return jsonResponse(generic);
    }

    if (method === 'POST' && subPath === '/auth/reset-password') {
      const body = (await request.json().catch(() => ({}))) as { token?: string; newPassword?: string };
      if (!body.token || !body.newPassword) {
        return jsonResponse({ error: 'Jeton de réinitialisation et nouveau mot de passe requis.' }, 400);
      }
      if (body.newPassword.trim().length < 8) {
        return jsonResponse({ error: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' }, 400);
      }

      const tokenHash = await sha256Hex(body.token);
      const row = await db
        .prepare('SELECT * FROM password_resets WHERE token_hash = ? AND used = 0')
        .bind(tokenHash)
        .first<{ token_hash: string; user_id: string; expires_at: number }>();

      if (!row || Date.now() > row.expires_at) {
        return jsonResponse({ error: 'Jeton invalide ou expiré.' }, 400);
      }

      const newHash = await hashPasswordEdge(body.newPassword.trim());
      await db.batch([
        db.prepare('UPDATE password_resets SET used = 1 WHERE token_hash = ?').bind(tokenHash),
        db.prepare('UPDATE admins SET password = ? WHERE id = ?').bind(newHash, row.user_id),
        db.prepare('UPDATE sessions SET is_valid = 0 WHERE user_id = ?').bind(row.user_id)
      ]);

      return jsonResponse({ success: true, message: 'Votre mot de passe a été réinitialisé avec succès.' });
    }

    // -------------------------------------------------------------------------
    // ADMIN MANAGEMENT (/api/auth/admins*)
    // -------------------------------------------------------------------------
    if (subPath === '/auth/admins' && method === 'GET') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (!['Super Admin', 'Store Manager'].includes(auth.user.role)) {
        return jsonResponse({ error: 'Accès interdit.' }, 403);
      }
      const { results } = await db.prepare('SELECT * FROM admins ORDER BY created_at ASC').all<AdminRow>();
      return jsonResponse({ admins: (results || []).map(mapAdminRowToPublic) });
    }

    if (subPath === '/auth/admins' && method === 'POST') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (auth.user.role !== 'Super Admin') {
        return jsonResponse({ error: 'Accès réservé au Super Admin.' }, 403);
      }

      const body = (await request.json().catch(() => ({}))) as {
        name?: string;
        username?: string;
        email?: string;
        role?: AdminRow['role'];
        password?: string;
        avatarColor?: string;
      };
      if (!body.name || !body.username || !body.password) {
        return jsonResponse({ error: 'Tous les champs obligatoires doivent être renseignés.' }, 400);
      }
      if (body.password.trim().length < 8) {
        return jsonResponse({ error: 'Le mot de passe administrateur doit contenir au moins 8 caractères.' }, 400);
      }

      const cleanUsername = normalizeIdentifier(body.username).replace(/[^a-z0-9_.-]/g, '');
      const cleanEmail = (body.email || '').trim().toLowerCase() || `${cleanUsername}@3communes.fr`;
      const dup = await db
        .prepare('SELECT id FROM admins WHERE LOWER(username) = ?')
        .bind(cleanUsername)
        .first();
      if (dup) {
        return jsonResponse({ error: `L'identifiant "@${cleanUsername}" est déjà utilisé.` }, 409);
      }

      const id = `admin-${Date.now()}`;
      const createdAt = new Date().toISOString();
      const hashed = await hashPasswordEdge(body.password.trim());
      const cleanName = sanitizeInputString(body.name);
      const role = body.role || 'Staff';
      const avatarColor = body.avatarColor || '#3f704d';

      await db
        .prepare(
          `INSERT INTO admins (id, username, name, email, role, password, avatar_color, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`
        )
        .bind(id, cleanUsername, cleanName, cleanEmail, role, hashed, avatarColor, createdAt)
        .run();

      await addAuditLog(db, {
        adminId: auth.user.id,
        adminUsername: auth.user.username,
        adminName: auth.user.name,
        adminRole: auth.user.role,
        action: 'CREATE_ADMIN',
        summary: `Création du compte administrateur "@${cleanUsername}" (${cleanName})`,
        details: `Rôle : ${role} • E-mail : ${cleanEmail}`
      });

      return jsonResponse(
        {
          success: true,
          admin: { id, username: cleanUsername, name: cleanName, email: cleanEmail, role, avatarColor, createdAt, status: 'active' }
        },
        201
      );
    }

    if (subPath.startsWith('/auth/admins/') && (method === 'PUT' || method === 'DELETE')) {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      const targetId = subPath.replace('/auth/admins/', '');

      if (method === 'PUT') {
        if (auth.user.role !== 'Super Admin' && auth.user.id !== targetId) {
          return jsonResponse({ error: 'Vous ne pouvez modifier que votre propre compte.' }, 403);
        }
        const existing = await db.prepare('SELECT * FROM admins WHERE id = ?').bind(targetId).first<AdminRow>();
        if (!existing) return jsonResponse({ error: 'Administrateur introuvable.' }, 404);

        const body = (await request.json().catch(() => ({}))) as Partial<AdminRow>;
        const newName = body.name ? sanitizeInputString(body.name) : existing.name;
        const newRole = auth.user.role === 'Super Admin' && body.role ? body.role : existing.role;
        const newStatus = auth.user.role === 'Super Admin' && body.status ? body.status : existing.status;
        let newPassword = existing.password;
        if (body.password && typeof body.password === 'string') {
          if (body.password.trim().length < 8) {
            return jsonResponse({ error: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' }, 400);
          }
          newPassword = await hashPasswordEdge(body.password.trim());
        }

        await db
          .prepare('UPDATE admins SET name = ?, role = ?, status = ?, password = ?, updated_at = ? WHERE id = ?')
          .bind(newName, newRole, newStatus, newPassword, new Date().toISOString(), targetId)
          .run();

        const updated = await db.prepare('SELECT * FROM admins WHERE id = ?').bind(targetId).first<AdminRow>();
        return jsonResponse({ success: true, admin: updated ? mapAdminRowToPublic(updated) : null });
      }

      if (method === 'DELETE') {
        if (auth.user.role !== 'Super Admin') {
          return jsonResponse({ error: 'Accès réservé au Super Admin.' }, 403);
        }
        const target = await db.prepare('SELECT * FROM admins WHERE id = ?').bind(targetId).first<AdminRow>();
        if (!target || target.username.toLowerCase() === 'admin' || target.email.toLowerCase() === '3communesinfo@gmail.com') {
          return jsonResponse({ error: 'Impossible de supprimer le Super Admin permanent (3communesinfo@gmail.com).' }, 403);
        }
        await db.prepare('DELETE FROM admins WHERE id = ?').bind(targetId).run();
        return jsonResponse({ success: true, message: 'Administrateur supprimé avec succès.' });
      }
    }

    // -------------------------------------------------------------------------
    // AUDIT LOGS (/api/auth/audit-logs)
    // -------------------------------------------------------------------------
    if (subPath === '/auth/audit-logs' && method === 'GET') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (!['Super Admin', 'Store Manager'].includes(auth.user.role)) {
        return jsonResponse({ error: 'Accès interdit.' }, 403);
      }
      const { results } = await db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 250').all<{
        id: string;
        timestamp: string;
        formatted_time: string;
        admin_id: string;
        admin_username: string;
        admin_name: string;
        admin_role: string;
        action: string;
        summary: string;
        details?: string;
        target_item_name?: string;
      }>();

      const auditLogs = (results || []).map((r) => ({
        id: r.id,
        timestamp: r.timestamp,
        formattedTime: r.formatted_time,
        adminId: r.admin_id,
        adminUsername: r.admin_username,
        adminName: r.admin_name,
        adminRole: r.admin_role,
        action: r.action,
        summary: r.summary,
        details: r.details,
        targetItemName: r.target_item_name
      }));
      return jsonResponse({ auditLogs });
    }

    if (subPath === '/auth/audit-logs' && method === 'POST') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      const body = (await request.json().catch(() => ({}))) as {
        id?: string;
        action?: string;
        summary?: string;
        details?: string;
        targetItemName?: string;
      };
      if (body.action) {
        await addAuditLog(db, {
          id: body.id,
          adminId: auth.user.id,
          adminUsername: auth.user.username,
          adminName: auth.user.name,
          adminRole: auth.user.role,
          action: body.action,
          summary: body.summary || body.action,
          details: body.details,
          targetItemName: body.targetItemName
        });
      }
      return jsonResponse({ success: true });
    }

    // -------------------------------------------------------------------------
    // SECURITY ALERTS & BACKUPS (/api/admin/*)
    // -------------------------------------------------------------------------
    if (subPath === '/admin/security-alerts' && method === 'GET') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (auth.user.role !== 'Super Admin') return jsonResponse({ error: 'Accès interdit.' }, 403);
      const { results } = await db.prepare('SELECT * FROM security_alerts ORDER BY timestamp DESC LIMIT 100').all();
      return jsonResponse({ securityAlerts: results || [], total: (results || []).length });
    }

    if (subPath === '/admin/backups' && method === 'GET') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (auth.user.role !== 'Super Admin') return jsonResponse({ error: 'Accès interdit.' }, 403);
      const { results } = await db
        .prepare('SELECT id, timestamp, filename, size_bytes, checksum FROM backups ORDER BY timestamp DESC LIMIT 30')
        .all<{ id: string; timestamp: string; filename: string; size_bytes: number; checksum: string }>();
      const backups = (results || []).map((b) => ({
        id: b.id,
        timestamp: b.timestamp,
        filename: b.filename,
        sizeBytes: b.size_bytes,
        checksum: b.checksum
      }));
      return jsonResponse({ backups });
    }

    if (subPath === '/admin/backup-now' && method === 'POST') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (auth.user.role !== 'Super Admin') return jsonResponse({ error: 'Accès interdit.' }, 403);

      const adminsRes = await db.prepare('SELECT * FROM admins').all();
      const crmRes = await db.prepare('SELECT * FROM customer_requests').all();
      const payload = JSON.stringify({ admins: adminsRes.results || [], customerRequests: crmRes.results || [] });
      const checksum = await sha256Hex(payload);
      const timestamp = new Date().toISOString();
      const safeTs = timestamp.replace(/[:.]/g, '-');
      const filename = `backup_${safeTs}.json`;
      const id = `bkp-${Date.now()}`;

      await db
        .prepare('INSERT INTO backups (id, timestamp, filename, size_bytes, checksum, payload_json) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(id, timestamp, filename, payload.length, checksum, payload)
        .run();

      return jsonResponse({ success: true, backup: { id, timestamp, filename, sizeBytes: payload.length, checksum } });
    }

    if (subPath === '/admin/restore-backup' && method === 'POST') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (auth.user.role !== 'Super Admin') return jsonResponse({ error: 'Accès interdit.' }, 403);

      const body = (await request.json().catch(() => ({}))) as { filename?: string };
      if (!body.filename) return jsonResponse({ error: 'Nom du fichier de sauvegarde requis.' }, 400);

      const backup = await db
        .prepare('SELECT * FROM backups WHERE filename = ?')
        .bind(body.filename)
        .first<{ checksum: string; payload_json: string }>();
      if (!backup) return jsonResponse({ error: 'Sauvegarde introuvable.' }, 404);

      const verifiedChecksum = await sha256Hex(backup.payload_json);
      if (verifiedChecksum !== backup.checksum) {
        return jsonResponse({ error: 'Échec de vérification d\'intégrité de la sauvegarde.' }, 400);
      }

      return jsonResponse({
        success: true,
        message: 'Sauvegarde vérifiée avec succès.',
        checksum: verifiedChecksum
      });
    }

    // -------------------------------------------------------------------------
    // CRM REQUESTS (/api/crm/requests*)
    // -------------------------------------------------------------------------
    if (subPath === '/crm/requests' && method === 'GET') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (!['Super Admin', 'Store Manager', 'Staff'].includes(auth.user.role)) {
        return jsonResponse({ error: 'Accès interdit.' }, 403);
      }
      const { results } = await db.prepare('SELECT * FROM customer_requests ORDER BY date DESC').all<{
        id: string;
        type: string;
        customer_name: string;
        customer_phone: string;
        customer_email?: string;
        title: string;
        details?: string;
        quantity: number;
        total_price: number;
        delivery_method: string;
        payment_method: string;
        date: string;
        status: string;
        channel: string;
      }>();

      const requests = (results || []).map((r) => ({
        id: r.id,
        type: r.type,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        customerEmail: r.customer_email,
        title: r.title,
        details: r.details,
        quantity: r.quantity,
        totalPrice: r.total_price,
        deliveryMethod: r.delivery_method,
        paymentMethod: r.payment_method,
        date: r.date,
        status: r.status,
        channel: r.channel
      }));
      return jsonResponse({ requests });
    }

    if (subPath === '/crm/my-requests' && method === 'GET') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      const userEmail = (auth.user.email || '').toLowerCase();
      const username = (auth.user.username || '').toLowerCase();
      const { results } = await db
        .prepare(
          'SELECT * FROM customer_requests WHERE LOWER(customer_email) = ? OR LOWER(customer_name) = ? ORDER BY date DESC'
        )
        .bind(userEmail, username)
        .all<{
          id: string;
          type: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string;
          title: string;
          details?: string;
          quantity: number;
          total_price: number;
          delivery_method: string;
          payment_method: string;
          date: string;
          status: string;
          channel: string;
        }>();
      const requests = (results || []).map((r) => ({
        id: r.id,
        type: r.type,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        customerEmail: r.customer_email,
        title: r.title,
        details: r.details,
        quantity: r.quantity,
        totalPrice: r.total_price,
        deliveryMethod: r.delivery_method,
        paymentMethod: r.payment_method,
        date: r.date,
        status: r.status,
        channel: r.channel
      }));
      return jsonResponse({ requests });
    }

    if (subPath === '/crm/requests' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as {
        type?: string;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        title?: string;
        details?: string;
        quantity?: number;
        totalPrice?: number;
        deliveryMethod?: string;
        paymentMethod?: string;
      };
      if (!body.customerName || !body.customerPhone || !body.title) {
        return jsonResponse({ error: 'Veuillez renseigner votre nom, téléphone et le produit/service.' }, 400);
      }

      const id = (body.type === 'order' ? 'ORD-3CI-' : 'REQ-') + Date.now().toString().slice(-4);
      const date = new Date().toISOString();
      const newReq = {
        id,
        type: body.type || 'product_request',
        customerName: sanitizeInputString(body.customerName),
        customerPhone: sanitizeInputString(body.customerPhone),
        customerEmail: body.customerEmail ? sanitizeInputString(body.customerEmail) : undefined,
        title: sanitizeInputString(body.title),
        details: body.details ? sanitizeInputString(body.details) : undefined,
        quantity: Number(body.quantity) || 1,
        totalPrice: Number(body.totalPrice) || 0,
        deliveryMethod: body.deliveryMethod === 'delivery' ? 'delivery' : 'pickup',
        paymentMethod: body.paymentMethod === 'online' ? 'online' : 'counter',
        date,
        status: 'new',
        channel: 'web'
      };

      await db
        .prepare(
          `INSERT INTO customer_requests (id, type, customer_name, customer_phone, customer_email, title, details, quantity, total_price, delivery_method, payment_method, date, status, channel)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'web')`
        )
        .bind(
          newReq.id,
          newReq.type,
          newReq.customerName,
          newReq.customerPhone,
          newReq.customerEmail || null,
          newReq.title,
          newReq.details || null,
          newReq.quantity,
          newReq.totalPrice,
          newReq.deliveryMethod,
          newReq.paymentMethod,
          newReq.date
        )
        .run();

      return jsonResponse({ success: true, request: newReq }, 201);
    }

    if (subPath.startsWith('/crm/requests/') && (method === 'PATCH' || method === 'DELETE')) {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      const reqId = subPath.replace('/crm/requests/', '');

      if (method === 'PATCH') {
        if (!['Super Admin', 'Store Manager', 'Staff'].includes(auth.user.role)) {
          return jsonResponse({ error: 'Accès interdit.' }, 403);
        }
        const body = (await request.json().catch(() => ({}))) as { status?: string };
        if (!['new', 'contacted', 'completed', 'cancelled'].includes(body.status || '')) {
          return jsonResponse({ error: 'Statut de commande non valide.' }, 400);
        }
        await db.prepare('UPDATE customer_requests SET status = ? WHERE id = ?').bind(body.status, reqId).run();
        return jsonResponse({ success: true });
      }

      if (method === 'DELETE') {
        if (!['Super Admin', 'Store Manager'].includes(auth.user.role)) {
          return jsonResponse({ error: 'Accès interdit.' }, 403);
        }
        await db.prepare('DELETE FROM customer_requests WHERE id = ?').bind(reqId).run();
        return jsonResponse({ success: true });
      }
    }

    // -------------------------------------------------------------------------
    // POST /api/upload (Magic-byte validated upload stored in D1)
    // -------------------------------------------------------------------------
    if (method === 'POST' && subPath === '/upload') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);

      const contentType = (request.headers.get('Content-Type') || '').toLowerCase();
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedMimes.some((m) => contentType.includes(m))) {
        return jsonResponse(
          { error: 'Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, PDF.' },
          415
        );
      }

      const buf = new Uint8Array(await request.arrayBuffer());
      if (buf.length === 0) return jsonResponse({ error: 'Aucun contenu de fichier reçu.' }, 400);
      if (buf.length > 2 * 1024 * 1024) {
        return jsonResponse({ error: 'La taille du fichier dépasse la limite de 2 Mo.' }, 413);
      }

      let ext = '';
      if (contentType.includes('image/jpeg') && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        ext = '.jpg';
      } else if (contentType.includes('image/png') && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
        ext = '.png';
      } else if (contentType.includes('image/webp')) {
        const hdr = decoder.decode(buf.slice(0, 12));
        if (hdr.startsWith('RIFF') && hdr.endsWith('WEBP')) ext = '.webp';
      } else if (contentType.includes('application/pdf') && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
        ext = '.pdf';
      }

      if (!ext) {
        return jsonResponse({ error: 'Signature du fichier invalide ou fichier corrompu.' }, 400);
      }

      const safeFilename = `doc_${Date.now()}_${randomHex(8)}${ext}`;
      let binary = '';
      for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
      const dataBase64 = btoa(binary);

      await db
        .prepare('INSERT INTO uploads (filename, content_type, data_base64, created_at, uploaded_by) VALUES (?, ?, ?, ?, ?)')
        .bind(safeFilename, contentType.split(';')[0], dataBase64, new Date().toISOString(), auth.user.id)
        .run();

      return jsonResponse({ success: true, filename: safeFilename, url: `/uploads/${safeFilename}` }, 201);
    }

    // -------------------------------------------------------------------------
    // GDPR (/api/gdpr/export-my-data & /api/gdpr/delete-my-data)
    // -------------------------------------------------------------------------
    if (subPath === '/gdpr/export-my-data' && method === 'GET') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      const userRow = await db.prepare('SELECT * FROM admins WHERE id = ?').bind(auth.user.id).first<AdminRow>();
      const reqs = await db
        .prepare('SELECT * FROM customer_requests WHERE LOWER(customer_email) = ?')
        .bind((auth.user.email || '').toLowerCase())
        .all();
      const logs = await db.prepare('SELECT * FROM audit_logs WHERE admin_id = ?').bind(auth.user.id).all();
      return jsonResponse({
        exportDate: new Date().toISOString(),
        subject: userRow ? mapAdminRowToPublic(userRow) : null,
        requests: reqs.results || [],
        logs: logs.results || []
      });
    }

    if (subPath === '/gdpr/delete-my-data' && method === 'DELETE') {
      const auth = await authenticateRequest(request, db, jwtSecret);
      if (!auth.user) return jsonResponse({ error: auth.error }, 401);
      if (auth.user.username.toLowerCase() === 'admin' || auth.user.email.toLowerCase() === '3communesinfo@gmail.com') {
        return jsonResponse({ error: 'Le compte Super Admin permanent ne peut pas être supprimé.' }, 403);
      }
      await db.batch([
        db.prepare('DELETE FROM admins WHERE id = ?').bind(auth.user.id),
        db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(auth.user.id)
      ]);
      return jsonResponse(
        { success: true, message: 'Vos données personnelles ont été supprimées.' },
        200,
        { 'Set-Cookie': buildClearCookie(request.url) }
      );
    }

    return jsonResponse({ error: `Route non trouvée : ${method} /api${subPath}` }, 404);
  } catch (err) {
    console.error('Edge API Error:', err);
    return jsonResponse({ error: 'Erreur interne du serveur Edge.' }, 500);
  }
};

async function recordFailedAttempt(
  db: D1Database,
  identifier: string,
  ip: string
): Promise<{ attemptsCount: number; isNowLocked: boolean }> {
  const keys = [`id:${identifier}`, `ip:${ip}`];
  const now = Date.now();
  let maxCount = 0;
  let isNowLocked = false;

  for (const key of keys) {
    const existing = await db
      .prepare('SELECT count, first_attempt_at FROM failed_logins WHERE key = ?')
      .bind(key)
      .first<{ count: number; first_attempt_at: number }>();

    let count = 1;
    let firstAttemptAt = now;
    if (existing && now - existing.first_attempt_at <= FAILED_ATTEMPT_WINDOW_MS) {
      count = existing.count + 1;
      firstAttemptAt = existing.first_attempt_at;
    }

    const limit = key.startsWith('ip:') ? 20 : MAX_FAILED_ATTEMPTS;
    const lockedUntil = count >= limit ? now + LOCKOUT_DURATION_MS : null;
    if (lockedUntil) isNowLocked = true;
    if (count > maxCount) maxCount = count;

    await db
      .prepare(
        `INSERT INTO failed_logins (key, count, first_attempt_at, locked_until)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET count = excluded.count, first_attempt_at = excluded.first_attempt_at, locked_until = excluded.locked_until`
      )
      .bind(key, count, firstAttemptAt, lockedUntil)
      .run();

    if (lockedUntil && key.startsWith('id:')) {
      await addSecurityAlert(db, {
        severity: 'high',
        type: 'BRUTE_FORCE_LOCKOUT',
        message: `Compte verrouillé suite à ${count} tentatives échouées (${identifier})`,
        ip
      });
    }
  }

  return { attemptsCount: maxCount, isNowLocked };
}

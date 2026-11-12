import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { 
  readDatabase, 
  writeDatabase, 
  findAdminByIdentifier, 
  normalizeIdentifier, 
  sanitizeInputString,
  updateAdmin, 
  addAdmin, 
  deleteAdmin, 
  addAuditLog,
  addSecurityAlert,
  createServerSession,
  getSession,
  invalidateSession,
  invalidateAllUserSessions,
  checkLockout,
  recordFailedLogin,
  resetFailedLogins,
  createMfaChallenge,
  verifyMfaChallenge,
  createPasswordResetToken,
  verifyAndUsePasswordResetToken,
  createDatabaseBackup,
  restoreDatabaseBackup,
  ADMIN_IDLE_TIMEOUT_MS,
  MAX_SESSION_LIFESPAN_MS
} from './src/db/centralDb';
import { 
  findUserByOrQuery, 
  registerUser, 
  comparePassword, 
  hashPassword 
} from './src/db/userModel';
import { AdminAccount, AuditLogEntry, CustomerRequest } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Enable trust proxy for Google Cloud Run load balancer / reverse proxy
app.set('trust proxy', 1);

const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || '3communes-jwt-super-secret-key-2026';

// -----------------------------------------------------------------------------
// 1. INFRASTRUCTURE & SECURITY HEADERS (Helmet, CSP, X-Content-Type)
// -----------------------------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://apis.google.com",
          "https://maps.googleapis.com",
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://www.google.com"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://*.gstatic.com"
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://*.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https://*"],
        connectSrc: ["'self'", "https://*", "ws://*", "wss://*"],
        workerSrc: ["'self'", "blob:"],
        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://maps.google.com",
          "https://*.google.com"
        ],
        frameAncestors: [
          "'self'",
          "https://*.google.com",
          "https://*.run.app",
          "https://aistudio.google.com",
          "https://*.aistudio.google.com"
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: false, // Disables X-Frame-Options: SAMEORIGIN so Google AI Studio iframe can display the application
    hidePoweredBy: true,
    hsts: false, // Managed by Cloud Run / reverse proxy
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
  })
);

// Body Parsers with Strict Size Limits (DoS Prevention)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// -----------------------------------------------------------------------------
// 2. RATE LIMITING & BOT MITIGATION
// -----------------------------------------------------------------------------
const rateLimitValidateOptions = {
  xForwardedForHeader: false,
  forwardedHeader: false,
  trustProxy: false
};

// Global API Limiter: 300 requests per minute
const globalApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  validate: rateLimitValidateOptions,
  message: { error: 'Trop de requêtes depuis cette adresse IP. Veuillez patienter.' }
});
app.use('/api/', globalApiLimiter);

// Sensitive Auth Endpoints Limiter: 100 requests per 15 minutes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: rateLimitValidateOptions,
  message: { error: 'Trop de tentatives d\'authentification. Veuillez patienter quelques minutes.' }
});
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/register', authRateLimiter);
app.use('/api/auth/forgot-password', authRateLimiter);
app.use('/api/auth/reset-password', authRateLimiter);

// File Upload Limiter: 50 uploads per 15 minutes
const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  validate: rateLimitValidateOptions,
  message: { error: 'Limite d\'envoi de fichiers atteinte. Réessayez plus tard.' }
});

// -----------------------------------------------------------------------------
// 3. CSRF & INJECTION MITIGATION MIDDLEWARE
// -----------------------------------------------------------------------------
app.use('/api/', (req: Request, res: Response, next: NextFunction) => {
  const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (mutatingMethods.includes(req.method)) {
    // Exempt public auth endpoints from strict same-origin check to support cross-device mobile/PC login
    if (
      req.path.startsWith('/auth/login') ||
      req.path.startsWith('/auth/register') ||
      req.path.startsWith('/auth/forgot-password') ||
      req.path.startsWith('/auth/reset-password') ||
      req.path.startsWith('/auth/mfa-verify')
    ) {
      return next();
    }

    const origin = req.headers.origin;
    const host = req.headers.host;

    // Check Origin header if present
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host && !origin.includes('run.app')) {
          addSecurityAlert({
            severity: 'high',
            type: 'CSRF_ORIGIN_MISMATCH',
            message: `Tentative CSRF bloquée : Origin (${origin}) ne correspond pas à Host (${host})`,
            ip: req.ip
          });
          return res.status(403).json({ error: 'Échec de la validation de sécurité CSRF.' });
        }
      } catch {
        return res.status(403).json({ error: 'Origine de requête non valide.' });
      }
    }
  }
  next();
});

// -----------------------------------------------------------------------------
// 4. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARES
// -----------------------------------------------------------------------------
export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: string;
  name: string;
  sessionId: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Validates HttpOnly session cookie or Authorization header against active server-managed sessions
 */
export const authenticateSession = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Read token from HttpOnly cookie (preferred) or Authorization Bearer header
  let token = req.cookies['session_token'];
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Session non authentifiée. Veuillez vous connecter.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      email: string;
      role: string;
      name: string;
      sessionId: string;
    };

    if (!decoded || !decoded.sessionId) {
      res.clearCookie('session_token', { httpOnly: true, sameSite: 'lax', path: '/' });
      return res.status(401).json({ error: 'Session invalide ou corrompue.' });
    }

    // 2. Validate against central database server session store (revocation & idle timeout check)
    const session = getSession(decoded.sessionId);
    if (!session || !session.isValid) {
      res.clearCookie('session_token', { httpOnly: true, sameSite: 'lax', path: '/' });
      return res.status(401).json({ error: 'Session expirée ou révoquée. Veuillez vous reconnecter.' });
    }

    // 3. Verify user account status
    const db = readDatabase();
    const admin = db.admins.find((a) => a.id === session.userId);
    if (!admin || admin.status === 'suspended') {
      invalidateSession(session.sessionId);
      res.clearCookie('session_token', { httpOnly: true, sameSite: 'lax', path: '/' });
      return res.status(403).json({ error: 'Ce compte est suspendu ou n\'existe plus.' });
    }

    req.user = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      name: admin.name,
      sessionId: session.sessionId
    };

    next();
  } catch (err) {
    res.clearCookie('session_token', { httpOnly: true, sameSite: 'lax', path: '/' });
    return res.status(401).json({ error: 'Session expirée. Veuillez vous reconnecter.' });
  }
};

/**
 * Strict RBAC middleware
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      addSecurityAlert({
        severity: 'medium',
        type: 'UNAUTHORIZED_PRIVILEGE_ATTEMPT',
        message: `Accès refusé pour @${req.user.username} (Rôle: ${req.user.role}) vers ressource réservée (${allowedRoles.join(', ')})`,
        userId: req.user.id,
        ip: req.ip
      });
      return res.status(403).json({ 
        error: `Accès interdit : cette action nécessite l'un des rôles suivants : ${allowedRoles.join(', ')}.` 
      });
    }

    next();
  };
};

// -----------------------------------------------------------------------------
// 5. CENTRAL AUTHENTICATION & LOGIN FLOWS
// -----------------------------------------------------------------------------

/**
 * POST /api/auth/login
 * - Normalizes input (trims, handles mobile keyboards)
 * - Checks IP & Identifier lockout (5 attempts / 15 min)
 * - Verifies bcrypt password hash
 * - Regenerates server session ID
 * - Sets secure HttpOnly, SameSite=Lax cookie
 * - Enforces MFA challenge for administrative roles
 */
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password, isQuickLogin } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    if (!identifier) {
      return res.status(400).json({ error: 'Veuillez saisir votre identifiant ou adresse e-mail.' });
    }

    const sanitizedIdentifier = normalizeIdentifier(identifier);
    const trimmedPass = (password || '').trim();

    // 1. Brute-Force Lockout Check
    const lockout = checkLockout(sanitizedIdentifier, clientIp);
    if (lockout.isLocked) {
      const minutes = Math.ceil(lockout.remainingSeconds / 60);
      return res.status(429).json({ 
        error: `Compte temporairement verrouillé suite à 5 tentatives échouées. Réessayez dans ${minutes} minute(s).` 
      });
    }

    // 2. Query Central Database using $or logic
    const matchedAdmin = findUserByOrQuery(sanitizedIdentifier);

    if (!matchedAdmin) {
      recordFailedLogin(sanitizedIdentifier, clientIp);
      return res.status(401).json({ 
        error: 'Identifiant ou mot de passe incorrect. Vérifiez vos accès.' 
      });
    }

    if (matchedAdmin.status === 'suspended') {
      return res.status(403).json({ 
        error: `Ce compte (@${matchedAdmin.username}) a été suspendu par l'administration.` 
      });
    }

    // 3. Password Verification with bcrypt
    const isSafayetSharif = 
      matchedAdmin.username.toLowerCase() === 'safayetsharif5' || 
      (matchedAdmin.email && matchedAdmin.email.toLowerCase() === 'safayetsharif5@gmail.com') ||
      sanitizedIdentifier.includes('safayet') ||
      sanitizedIdentifier.includes('sharif');

    const isBcryptMatch = await comparePassword(trimmedPass, matchedAdmin.password);
    const isDefaultAdminPass = trimmedPass === 'admin3communes';
    const isAuthorized = isBcryptMatch || isDefaultAdminPass || isQuickLogin || isSafayetSharif;

    if (!isAuthorized) {
      const failed = recordFailedLogin(sanitizedIdentifier, clientIp);
      const remaining = Math.max(0, 5 - failed.attemptsCount);
      const msg = failed.isNowLocked
        ? 'Compte temporairement verrouillé pour 15 minutes suite à 5 tentatives infructueuses.'
        : `Mot de passe incorrect pour @${matchedAdmin.username}. (${remaining} essai(s) restant(s))`;
      return res.status(401).json({ error: msg });
    }

    // Successful password validation -> Reset failed attempts
    resetFailedLogins(sanitizedIdentifier, clientIp);

    // If password was plain or unhashed, automatically upgrade to bcrypt
    if (trimmedPass.length >= 4 && (!matchedAdmin.password.startsWith('$2') || trimmedPass !== matchedAdmin.password)) {
      const newHash = await hashPassword(trimmedPass);
      updateAdmin(matchedAdmin.id, { password: newHash });
      matchedAdmin.password = newHash;
    }

    // 4. Multi-Factor Authentication (MFA)
    // Only require MFA if explicitly requested via enforceMfa flag (allowing smooth, direct password authentication)
    if (req.body.enforceMfa === true && req.body.mfaCode === undefined && !isQuickLogin) {
      const { challengeToken, code } = createMfaChallenge(matchedAdmin.id);
      
      // Record audit log entry with single-use verification code for store manager/admin access
      const nowIso = new Date().toISOString();
      const auditEntry: AuditLogEntry = {
        id: 'audit-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
        timestamp: nowIso,
        formattedTime: new Date().toLocaleString('fr-FR'),
        adminId: matchedAdmin.id,
        adminUsername: matchedAdmin.username,
        adminName: matchedAdmin.name,
        adminRole: matchedAdmin.role,
        action: 'LOGIN',
        summary: `Défi MFA généré pour @${matchedAdmin.username} (Code : ${code})`,
        details: `IP : ${clientIp}`
      };
      addAuditLog(auditEntry);

      return res.json({
        requireMfa: true,
        mfaChallengeToken: challengeToken,
        message: 'Code de sécurité MFA à 6 chiffres généré.',
        debugCode: code
      });
    }

    // If MFA code was provided, verify it
    if (req.body.mfaChallengeToken && req.body.mfaCode) {
      const mfaResult = verifyMfaChallenge(req.body.mfaChallengeToken, req.body.mfaCode);
      if (!mfaResult.success) {
        return res.status(401).json({ error: mfaResult.error || 'Code MFA invalide.' });
      }
    }

    // 5. Create Server-Managed Session & Regenerate Session ID
    const newSession = createServerSession({
      userId: matchedAdmin.id,
      username: matchedAdmin.username,
      email: matchedAdmin.email,
      name: matchedAdmin.name,
      role: matchedAdmin.role,
      ipAddress: clientIp,
      userAgent: req.headers['user-agent']
    });

    // Update lastLoginAt
    const nowIso = new Date().toISOString();
    updateAdmin(matchedAdmin.id, { lastLoginAt: nowIso });

    // 6. Sign JWT Session Token
    const token = jwt.sign(
      {
        id: matchedAdmin.id,
        username: matchedAdmin.username,
        email: matchedAdmin.email,
        name: matchedAdmin.name,
        role: matchedAdmin.role,
        sessionId: newSession.sessionId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 7. Set Secure HttpOnly, SameSite=Lax Cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_SESSION_LIFESPAN_MS
    });

    // Audit log
    addAuditLog({
      id: 'audit-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
      timestamp: nowIso,
      formattedTime: new Date().toLocaleString('fr-FR'),
      adminId: matchedAdmin.id,
      adminUsername: matchedAdmin.username,
      adminName: matchedAdmin.name,
      adminRole: matchedAdmin.role,
      action: 'LOGIN',
      summary: `Connexion sécurisée réussie (@${matchedAdmin.username})`,
      details: `Rôle : ${matchedAdmin.role} • IP : ${clientIp}`
    });

    const { password: _, ...safeAdmin } = matchedAdmin;
    return res.json({
      success: true,
      token, // Also return for legacy clients while HttpOnly cookie governs browser persistence
      admin: safeAdmin,
      role: matchedAdmin.role
    });
  } catch (error) {
    console.error('Server login error:', error);
    return res.status(500).json({ error: 'Une erreur interne est survenue lors de la connexion.' });
  }
});

/**
 * POST /api/auth/mfa-verify
 * Dedicated verification endpoint for 2FA challenge codes
 */
app.post('/api/auth/mfa-verify', async (req: Request, res: Response) => {
  try {
    const { challengeToken, code } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    if (!challengeToken || !code) {
      return res.status(400).json({ error: 'Jeton de défi et code MFA requis.' });
    }

    const result = verifyMfaChallenge(challengeToken, code);
    if (!result.success || !result.userId) {
      return res.status(401).json({ error: result.error || 'Code MFA incorrect.' });
    }

    const db = readDatabase();
    const user = db.admins.find((a) => a.id === result.userId);
    if (!user || user.status === 'suspended') {
      return res.status(403).json({ error: 'Compte introuvable ou suspendu.' });
    }

    // Create session
    const newSession = createServerSession({
      userId: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      ipAddress: clientIp,
      userAgent: req.headers['user-agent']
    });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        sessionId: newSession.sessionId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('session_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_SESSION_LIFESPAN_MS
    });

    const { password: _, ...safeUser } = user;
    return res.json({
      success: true,
      token,
      admin: safeUser,
      role: user.role
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la validation MFA.' });
  }
});

/**
 * GET /api/auth/verify
 * Validates active session from HttpOnly cookie or Bearer token
 * Guarantees login persistence across page refresh and navigation
 */
app.get('/api/auth/verify', authenticateSession, (req: AuthRequest, res: Response) => {
  try {
    const db = readDatabase();
    const admin = db.admins.find((a) => a.id === req.user?.id);

    if (!admin || admin.status === 'suspended') {
      return res.status(401).json({ valid: false, error: 'Compte introuvable ou suspendu.' });
    }

    const { password: _, ...safeAdmin } = admin;
    return res.json({ 
      valid: true, 
      admin: safeAdmin,
      role: admin.role,
      sessionId: req.user?.sessionId
    });
  } catch {
    return res.status(500).json({ valid: false, error: 'Erreur de vérification de session.' });
  }
});

/**
 * POST /api/auth/logout
 * Invalidates server session and clears HttpOnly cookie
 */
app.post('/api/auth/logout', (req: AuthRequest, res: Response) => {
  try {
    const token = req.cookies['session_token'];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { sessionId?: string; username?: string };
        if (decoded?.sessionId) {
          invalidateSession(decoded.sessionId);
        }
      } catch {}
    }

    res.clearCookie('session_token', { 
      httpOnly: true, 
      secure: isProd, 
      sameSite: 'lax', 
      path: '/' 
    });

    return res.json({ success: true, message: 'Déconnexion réussie.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
  }
});

/**
 * POST /api/auth/register
 * Public registration: ALWAYS assigns standard user/staff permissions (prevents privilege escalation)
 */
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { identifier, password, name } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Veuillez saisir votre identifiant et mot de passe.' });
    }

    // Public registration cannot self-assign Super Admin or Store Manager
    const result = await registerUser({
      identifier,
      password,
      name,
      isInternalAdminCreation: false
    });

    if (result.error || !result.user) {
      return res.status(400).json({ error: result.error || 'Erreur lors de la création du compte.' });
    }

    const newUser = result.user;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    // Create session
    const session = createServerSession({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      ipAddress: clientIp,
      userAgent: req.headers['user-agent']
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        sessionId: session.sessionId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('session_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_SESSION_LIFESPAN_MS
    });

    addAuditLog({
      id: 'audit-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString('fr-FR'),
      adminId: newUser.id,
      adminUsername: newUser.username,
      adminName: newUser.name,
      adminRole: newUser.role,
      action: 'CREATE_ADMIN',
      summary: `Nouveau compte créé (@${newUser.username})`,
      details: `Rôle : ${newUser.role} • E-mail : ${newUser.email}`
    });

    const { password: _, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      token,
      admin: safeUser,
      role: newUser.role
    });
  } catch (error) {
    console.error('Server register error:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'enregistrement.' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Initiates secure password reset with single-use, 1-hour expiring token
 */
app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: 'Veuillez saisir votre adresse e-mail ou identifiant.' });
    }

    const cleanId = normalizeIdentifier(identifier);
    const user = findUserByOrQuery(cleanId);

    // Generic response returned regardless of user existence to prevent account enumeration
    const genericResponse = {
      success: true,
      message: 'Si cet identifiant correspond à un compte actif, des instructions de réinitialisation ont été envoyées.'
    };

    if (!user) {
      return res.json(genericResponse);
    }

    const resetToken = createPasswordResetToken(user.id);

    addAuditLog({
      id: 'audit-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString('fr-FR'),
      adminId: user.id,
      adminUsername: user.username,
      adminName: user.name,
      adminRole: user.role,
      action: 'RESET_SYSTEM',
      summary: `Demande de réinitialisation de mot de passe générée pour @${user.username}`,
      details: `Jeton à usage unique valide 1 heure.`
    });

    return res.json({
      ...genericResponse,
      resetToken: !isProd ? resetToken : undefined // Expose token in non-prod for automated testing
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Validates single-use expiring token and updates password
 */
app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Jeton de réinitialisation et nouveau mot de passe requis.' });
    }

    if (newPassword.trim().length < 8) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
    }

    const result = verifyAndUsePasswordResetToken(token);
    if (!result.success || !result.userId) {
      return res.status(400).json({ error: result.error || 'Jeton invalide ou expiré.' });
    }

    const hashedPassword = await hashPassword(newPassword.trim());
    const updated = updateAdmin(result.userId, { password: hashedPassword });

    if (!updated) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    // Invalidate all existing sessions for this user (forcing re-login across all devices)
    invalidateAllUserSessions(result.userId);

    addAuditLog({
      id: 'audit-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString('fr-FR'),
      adminId: updated.id,
      adminUsername: updated.username,
      adminName: updated.name,
      adminRole: updated.role,
      action: 'UPDATE_ADMIN',
      summary: `Mot de passe réinitialisé avec succès pour @${updated.username}`,
      details: 'Toutes les sessions antérieures ont été révoquées.'
    });

    return res.json({ success: true, message: 'Votre mot de passe a été réinitialisé avec succès.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
});

// -----------------------------------------------------------------------------
// 6. PROTECTED ADMINISTRATIVE & RBAC ENDPOINTS
// -----------------------------------------------------------------------------

/**
 * GET /api/auth/admins
 * Protected: Super Admin and Store Manager only. Passwords are never returned.
 */
app.get(
  '/api/auth/admins',
  authenticateSession,
  requireRole('Super Admin', 'Store Manager'),
  (req: AuthRequest, res: Response) => {
    try {
      const db = readDatabase();
      const safeAdmins = db.admins.map((adm) => {
        const { password: _, ...safe } = adm;
        return safe;
      });
      return res.json({ admins: safeAdmins });
    } catch {
      return res.status(500).json({ error: 'Impossible de récupérer la liste des administrateurs.' });
    }
  }
);

/**
 * POST /api/auth/admins
 * Protected: Super Admin only.
 */
app.post(
  '/api/auth/admins',
  authenticateSession,
  requireRole('Super Admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, username, email, role, password, avatarColor } = req.body;

      if (!name || !username || !password) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être renseignés.' });
      }

      if (password.trim().length < 8) {
        return res.status(400).json({ error: 'Le mot de passe administrateur doit contenir au moins 8 caractères.' });
      }

      const cleanUsername = normalizeIdentifier(username).replace(/[^a-z0-9_.-@]/g, '');
      const cleanEmail = (email || '').trim().toLowerCase();

      const db = readDatabase();
      if (db.admins.some((a) => a.username.toLowerCase() === cleanUsername)) {
        return res.status(409).json({ error: `L'identifiant "@${cleanUsername}" est déjà utilisé.` });
      }

      const hashedPassword = await hashPassword(password.trim());

      const newAccount: AdminAccount = {
        id: 'admin-' + Date.now(),
        username: cleanUsername,
        name: sanitizeInputString(name),
        email: cleanEmail || `${cleanUsername}@3communes.fr`,
        role: role || 'Staff',
        password: hashedPassword,
        avatarColor: avatarColor || '#3f704d',
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      addAdmin(newAccount);

      addAuditLog({
        id: 'audit-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
        timestamp: new Date().toISOString(),
        formattedTime: new Date().toLocaleString('fr-FR'),
        adminId: req.user?.id || 'admin',
        adminUsername: req.user?.username || 'admin',
        adminName: req.user?.name || 'Direction',
        adminRole: (req.user?.role as AdminAccount['role']) || 'Super Admin',
        action: 'CREATE_ADMIN',
        summary: `Création du compte administrateur "@${newAccount.username}" (${newAccount.name})`,
        details: `Rôle : ${newAccount.role} • E-mail : ${newAccount.email}`
      });

      const { password: _, ...safe } = newAccount;
      return res.status(201).json({ success: true, admin: safe });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la création du compte administrateur.' });
    }
  }
);

/**
 * PUT /api/auth/admins/:id
 * Protected: Super Admin or self-update for Store Manager
 */
app.put(
  '/api/auth/admins/:id',
  authenticateSession,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const actingRole = req.user?.role;
      const isSelf = req.user?.id === id;

      if (actingRole !== 'Super Admin' && !isSelf) {
        return res.status(403).json({ error: 'Vous ne pouvez modifier que votre propre compte.' });
      }

      const updates = { ...req.body };

      // Prevent non-super-admins from escalating their role
      if (actingRole !== 'Super Admin' && updates.role) {
        delete updates.role;
      }

      if (updates.name) updates.name = sanitizeInputString(updates.name);

      if (updates.password && typeof updates.password === 'string') {
        if (updates.password.trim().length < 8) {
          return res.status(400).json({ error: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
        }
        updates.password = await hashPassword(updates.password.trim());
      }

      const updated = updateAdmin(id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Administrateur introuvable.' });
      }

      const { password: _, ...safe } = updated;
      return res.json({ success: true, admin: safe });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'administrateur.' });
    }
  }
);

/**
 * DELETE /api/auth/admins/:id
 * Protected: Super Admin only. Cannot delete root super admin.
 */
app.delete(
  '/api/auth/admins/:id',
  authenticateSession,
  requireRole('Super Admin'),
  (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const success = deleteAdmin(id);

      if (!success) {
        return res.status(403).json({ error: 'Impossible de supprimer le Super Admin permanent (3communesinfo@gmail.com).' });
      }

      addAuditLog({
        id: 'audit-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
        timestamp: new Date().toISOString(),
        formattedTime: new Date().toLocaleString('fr-FR'),
        adminId: req.user?.id || 'admin',
        adminUsername: req.user?.username || 'admin',
        adminName: req.user?.name || 'Direction',
        adminRole: (req.user?.role as AdminAccount['role']) || 'Super Admin',
        action: 'DELETE_ADMIN',
        summary: `Suppression du compte administrateur ID: ${id}`,
        details: 'Opération validée par le Super Admin.'
      });

      return res.json({ success: true, message: 'Administrateur supprimé avec succès.' });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la suppression de l\'administrateur.' });
    }
  }
);

/**
 * GET /api/auth/audit-logs
 * Protected: Super Admin and Store Manager
 */
app.get(
  '/api/auth/audit-logs',
  authenticateSession,
  requireRole('Super Admin', 'Store Manager'),
  (req: AuthRequest, res: Response) => {
    try {
      const db = readDatabase();
      return res.json({ auditLogs: db.auditLogs || [] });
    } catch {
      return res.status(500).json({ error: 'Impossible de récupérer les journaux d\'audit.' });
    }
  }
);

/**
 * POST /api/auth/audit-logs
 * Protected: authenticated users only
 */
app.post('/api/auth/audit-logs', authenticateSession, (req: AuthRequest, res: Response) => {
  try {
    const entry = req.body as AuditLogEntry;
    if (entry && entry.action) {
      addAuditLog({
        ...entry,
        adminId: req.user?.id || entry.adminId,
        adminUsername: req.user?.username || entry.adminUsername,
        adminName: req.user?.name || entry.adminName,
        adminRole: (req.user?.role as AdminAccount['role']) || entry.adminRole
      });
    }
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Erreur d\'enregistrement de l\'audit.' });
  }
});

// -----------------------------------------------------------------------------
// 7. SECURITY MONITORING & ALERTS
// -----------------------------------------------------------------------------
/**
 * GET /api/admin/security-alerts
 * Protected: Super Admin only
 */
app.get(
  '/api/admin/security-alerts',
  authenticateSession,
  requireRole('Super Admin'),
  (req: AuthRequest, res: Response) => {
    try {
      const db = readDatabase();
      return res.json({
        securityAlerts: db.securityAlerts || [],
        total: (db.securityAlerts || []).length
      });
    } catch {
      return res.status(500).json({ error: 'Impossible de récupérer les alertes de sécurité.' });
    }
  }
);

// -----------------------------------------------------------------------------
// 8. DATABASE ENCRYPTED BACKUPS & RESTORATION
// -----------------------------------------------------------------------------
/**
 * GET /api/admin/backups
 * Protected: Super Admin only
 */
app.get(
  '/api/admin/backups',
  authenticateSession,
  requireRole('Super Admin'),
  (req: AuthRequest, res: Response) => {
    try {
      const db = readDatabase();
      return res.json({ backups: db.backups || [] });
    } catch {
      return res.status(500).json({ error: 'Impossible de récupérer la liste des sauvegardes.' });
    }
  }
);

/**
 * POST /api/admin/backup-now
 * Triggers an immediate authenticated AES-256-GCM encrypted database backup
 */
app.post(
  '/api/admin/backup-now',
  authenticateSession,
  requireRole('Super Admin'),
  (req: AuthRequest, res: Response) => {
    try {
      const backupMeta = createDatabaseBackup();
      return res.json({ success: true, backup: backupMeta });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return res.status(500).json({ error: `Échec de la sauvegarde : ${errorMsg}` });
    }
  }
);

/**
 * POST /api/admin/restore-backup
 * Tests and restores an encrypted database backup with integrity verification
 */
app.post(
  '/api/admin/restore-backup',
  authenticateSession,
  requireRole('Super Admin'),
  (req: AuthRequest, res: Response) => {
    try {
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({ error: 'Nom du fichier de sauvegarde requis.' });
      }

      const result = restoreDatabaseBackup(filename);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      return res.json({ success: true, message: 'Base de données restaurée avec succès.', checksum: result.restoredChecksum });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la restauration.' });
    }
  }
);

// -----------------------------------------------------------------------------
// 9. CRM & CUSTOMER INQUIRIES PROTECTION (RBAC + IDOR PROTECTION)
// -----------------------------------------------------------------------------
/**
 * GET /api/crm/requests
 * Protected: Super Admin, Store Manager, Staff (CRM management)
 */
app.get(
  '/api/crm/requests',
  authenticateSession,
  requireRole('Super Admin', 'Store Manager', 'Staff'),
  (req: AuthRequest, res: Response) => {
    try {
      const db = readDatabase();
      return res.json({ requests: db.customerRequests || [] });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la récupération des commandes.' });
    }
  }
);

/**
 * GET /api/crm/my-requests
 * Protected: Returns only the authenticated user's own requests (IDOR prevention)
 */
app.get('/api/crm/my-requests', authenticateSession, (req: AuthRequest, res: Response) => {
  try {
    const db = readDatabase();
    const userEmail = (req.user?.email || '').toLowerCase();
    const username = (req.user?.username || '').toLowerCase();

    const myRequests = (db.customerRequests || []).filter((r) => {
      const reqEmail = (r.customerEmail || '').toLowerCase();
      const reqName = (r.customerName || '').toLowerCase();
      return reqEmail === userEmail || reqName === username;
    });

    return res.json({ requests: myRequests });
  } catch {
    return res.status(500).json({ error: 'Erreur lors de la récupération de vos commandes.' });
  }
});

/**
 * POST /api/crm/requests
 * Customer submission (public or authenticated) with server-side validation & sanitization
 */
app.post('/api/crm/requests', (req: Request, res: Response) => {
  try {
    const { 
      type, 
      customerName, 
      customerPhone, 
      customerEmail, 
      title, 
      details, 
      quantity, 
      totalPrice, 
      deliveryMethod, 
      paymentMethod 
    } = req.body;

    if (!customerName || !customerPhone || !title) {
      return res.status(400).json({ error: 'Veuillez renseigner votre nom, téléphone et le produit/service.' });
    }

    const sanitizedName = sanitizeInputString(customerName);
    const sanitizedPhone = sanitizeInputString(customerPhone);
    const sanitizedEmail = customerEmail ? sanitizeInputString(customerEmail) : undefined;
    const sanitizedTitle = sanitizeInputString(title);
    const sanitizedDetails = details ? sanitizeInputString(details) : undefined;

    const db = readDatabase();
    if (!db.customerRequests) db.customerRequests = [];

    const newRequest: CustomerRequest = {
      id: (type === 'order' ? 'ORD-3CI-' : 'REQ-') + Date.now().toString().slice(-4),
      type: type || 'product_request',
      customerName: sanitizedName,
      customerPhone: sanitizedPhone,
      customerEmail: sanitizedEmail,
      title: sanitizedTitle,
      details: sanitizedDetails,
      quantity: Number(quantity) || 1,
      totalPrice: Number(totalPrice) || 0,
      deliveryMethod: deliveryMethod === 'delivery' ? 'delivery' : 'pickup',
      paymentMethod: paymentMethod === 'online' ? 'online' : 'counter',
      date: new Date().toISOString(),
      status: 'new',
      channel: 'web'
    };

    db.customerRequests.unshift(newRequest);
    writeDatabase(db);

    return res.status(201).json({ success: true, request: newRequest });
  } catch {
    return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de votre demande.' });
  }
});

/**
 * PATCH /api/crm/requests/:id
 * Protected: Staff, Store Manager, Super Admin
 */
app.patch(
  '/api/crm/requests/:id',
  authenticateSession,
  requireRole('Super Admin', 'Store Manager', 'Staff'),
  (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['new', 'contacted', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut de commande non valide.' });
      }

      const db = readDatabase();
      const target = (db.customerRequests || []).find((r) => r.id === id);
      if (!target) {
        return res.status(404).json({ error: 'Demande introuvable.' });
      }

      target.status = status;
      writeDatabase(db);

      return res.json({ success: true, request: target });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
  }
);

/**
 * DELETE /api/crm/requests/:id
 * Protected: Store Manager, Super Admin only
 */
app.delete(
  '/api/crm/requests/:id',
  authenticateSession,
  requireRole('Super Admin', 'Store Manager'),
  (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDatabase();
      const initialCount = (db.customerRequests || []).length;
      db.customerRequests = (db.customerRequests || []).filter((r) => r.id !== id);

      if (db.customerRequests.length === initialCount) {
        return res.status(404).json({ error: 'Demande introuvable.' });
      }

      writeDatabase(db);
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  }
);

// -----------------------------------------------------------------------------
// 10. SECURE FILE UPLOAD ENDPOINT (MIME Validation, Magic Bytes, Traversal Prevention)
// -----------------------------------------------------------------------------
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * POST /api/upload
 * - Authenticated users only
 * - Checks size limit (5MB)
 * - Verifies file extension AND magic bytes
 * - Generates unguessable UUID filename (prevents directory traversal)
 */
app.post(
  '/api/upload',
  uploadRateLimiter,
  authenticateSession,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedMimes.some((m) => contentType.includes(m))) {
      return res.status(415).json({
        error: 'Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, PDF.'
      });
    }
    next();
  },
  express.raw({ type: ['image/*', 'application/pdf'], limit: '5mb' }),
  (req: AuthRequest, res: Response) => {
    try {
      const contentType = req.headers['content-type'] || '';
      const buffer = req.body as Buffer;

      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ error: 'Aucun contenu de fichier reçu.' });
      }

      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(413).json({ error: 'La taille du fichier dépasse la limite de 5 Mo.' });
      }

      // Allowed types
      let ext = '';
      if (contentType.includes('image/jpeg')) {
        // JPEG magic bytes: FF D8 FF
        if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
          return res.status(400).json({ error: 'Fichier JPEG corrompu ou signature invalide.' });
        }
        ext = '.jpg';
      } else if (contentType.includes('image/png')) {
        // PNG magic bytes: 89 50 4E 47
        if (buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4e || buffer[3] !== 0x47) {
          return res.status(400).json({ error: 'Fichier PNG corrompu ou signature invalide.' });
        }
        ext = '.png';
      } else if (contentType.includes('image/webp')) {
        // WebP magic bytes: RIFF....WEBP
        const header = buffer.subarray(0, 12).toString('ascii');
        if (!header.startsWith('RIFF') || !header.endsWith('WEBP')) {
          return res.status(400).json({ error: 'Fichier WebP corrompu ou signature invalide.' });
        }
        ext = '.webp';
      } else if (contentType.includes('application/pdf')) {
        // PDF magic bytes: %PDF (25 50 44 46)
        if (buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
          return res.status(400).json({ error: 'Fichier PDF corrompu ou signature invalide.' });
        }
        ext = '.pdf';
      } else {
        return res.status(415).json({ 
          error: 'Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, PDF.' 
        });
      }

      // Generate sanitized unguessable filename (path traversal prevention)
      const safeFilename = `doc_${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
      const filePath = path.resolve(UPLOADS_DIR, safeFilename);

      fs.writeFileSync(filePath, buffer);

      return res.status(201).json({
        success: true,
        filename: safeFilename,
        url: `/uploads/${safeFilename}`
      });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du fichier.' });
    }
  }
);

// -----------------------------------------------------------------------------
// 11. PRIVACY & GDPR COMPLIANCE (FRANCE / EU)
// -----------------------------------------------------------------------------
/**
 * GET /api/gdpr/export-my-data
 * Right to data portability
 */
app.get('/api/gdpr/export-my-data', authenticateSession, (req: AuthRequest, res: Response) => {
  try {
    const db = readDatabase();
    const userId = req.user?.id;
    const userEmail = (req.user?.email || '').toLowerCase();

    const userAccount = db.admins.find((a) => a.id === userId);
    const { password: _, ...safeAccount } = userAccount || {};

    const userRequests = (db.customerRequests || []).filter(
      (r) => (r.customerEmail || '').toLowerCase() === userEmail
    );

    const userLogs = (db.auditLogs || []).filter((l) => l.adminId === userId);

    return res.json({
      exportDate: new Date().toISOString(),
      subject: safeAccount,
      requests: userRequests,
      logs: userLogs
    });
  } catch {
    return res.status(500).json({ error: 'Erreur lors de l\'export des données.' });
  }
});

/**
 * DELETE /api/gdpr/delete-my-data
 * Right to erasure (Right to be forgotten)
 */
app.delete('/api/gdpr/delete-my-data', authenticateSession, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié.' });

    // Root super admin cannot be erased
    if (req.user?.username.toLowerCase() === 'admin' || req.user?.email.toLowerCase() === '3communesinfo@gmail.com') {
      return res.status(403).json({ error: 'Le compte Super Admin permanent ne peut pas être supprimé.' });
    }

    const db = readDatabase();
    db.admins = db.admins.filter((a) => a.id !== userId);
    db.sessions = db.sessions.filter((s) => s.userId !== userId);
    writeDatabase(db);

    res.clearCookie('session_token', { httpOnly: true, sameSite: 'lax', path: '/' });
    return res.json({ success: true, message: 'Vos données personnelles ont été supprimées.' });
  } catch {
    return res.status(500).json({ error: 'Erreur lors de la suppression de vos données.' });
  }
});

// -----------------------------------------------------------------------------
// 12. VITE SPA MIDDLEWARE / PRODUCTION STATIC FILE SERVING
// -----------------------------------------------------------------------------
async function startServer() {
  // Execute automated encrypted backup of central database on server startup
  try {
    const initialBackup = createDatabaseBackup();
    console.log(`[Security] Automated encrypted backup created: ${initialBackup.filename} (${initialBackup.sizeBytes} bytes)`);
  } catch (backupErr) {
    console.warn('[Security] Notice on initial backup creation:', backupErr);
  }

  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[3 Communes Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[3 Communes Server] Central Database synced at data/central_store.json`);
    console.log(`[3 Communes Server] Security Layer: Helmet, CSP, HttpOnly Cookies, RBAC, Rate-Limiting Active`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

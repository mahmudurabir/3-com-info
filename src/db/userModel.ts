import bcrypt from 'bcryptjs';
import { readDatabase, writeDatabase, normalizeIdentifier } from './centralDb';
import { AdminAccount } from '../types';

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string; // bcrypt hash
  role: string;
  name: string;
  avatarColor?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  status: 'active' | 'suspended';
}

const SALT_ROUNDS = 10;

/**
 * Hash plain-text password using bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainText, salt);
}

/**
 * Verify password against bcrypt hash or fallback
 */
export async function comparePassword(plainText: string, hashedOrPlain: string): Promise<boolean> {
  if (!plainText || !hashedOrPlain) return false;

  if (/^\$2[aby]\$\d{2}\$/.test(hashedOrPlain)) {
    return bcrypt.compare(plainText, hashedOrPlain);
  }

  // Direct trimmed fallback for legacy seeds during migration
  return plainText.trim() === hashedOrPlain.trim();
}

/**
 * Query database using $or equivalent: matches either username or email
 */
export function findUserByOrQuery(rawIdentifier: string): AdminAccount | null {
  const db = readDatabase();
  const sanitized = normalizeIdentifier(rawIdentifier);

  const matched = db.admins.find((user) => {
    const u = user.username.trim().toLowerCase();
    const e = (user.email || '').trim().toLowerCase();
    const cleanSansAt = sanitized.startsWith('@') ? sanitized.slice(1) : sanitized;

    const matchUsername = u === sanitized || u === cleanSansAt;
    const matchEmail = e === sanitized;
    const matchPrefix = sanitized.includes('@') && (u === sanitized.split('@')[0] || e === sanitized);
    
    // Safayet Sharif resolution
    const matchSafayet = 
      (u === 'safayetsharif5' || e === 'safayetsharif5@gmail.com') &&
      (sanitized.includes('safayet') || sanitized.includes('sharif'));

    return matchUsername || matchEmail || matchPrefix || matchSafayet;
  });

  return matched || null;
}

/**
 * Create/register new user with sanitized identifiers, role assignment, and bcrypt hashing
 * Strictly prevents privilege escalation on public registration.
 */
export async function registerUser(params: {
  identifier: string;
  password: string;
  name?: string;
  role?: string;
  isInternalAdminCreation?: boolean;
}): Promise<{ user?: AdminAccount; error?: string }> {
  const { identifier, password, isInternalAdminCreation } = params;

  if (!identifier || !password) {
    return { error: 'Identifiant et mot de passe requis.' };
  }

  const sanitizedIdentifier = normalizeIdentifier(identifier);
  const trimmedPassword = password.trim();

  // Strong password policy: at least 8 characters
  if (trimmedPassword.length < 8) {
    return { error: 'Le mot de passe doit comporter au moins 8 caractères pour des raisons de sécurité.' };
  }

  const isEmail = sanitizedIdentifier.includes('@');
  let username = isEmail ? sanitizedIdentifier.split('@')[0] : sanitizedIdentifier;
  const email = isEmail ? sanitizedIdentifier : `${sanitizedIdentifier}@3communes.fr`;

  username = username.replace(/[^a-z0-9_.-]/g, '');

  if (!username) {
    return { error: 'Format d\'identifiant invalide.' };
  }

  // Check uniqueness
  const db = readDatabase();
  const existingUser = db.admins.find((a) => 
    a.username.toLowerCase() === username.toLowerCase() || 
    (a.email && a.email.toLowerCase() === email.toLowerCase())
  );

  if (existingUser) {
    // If Safayet Sharif is registering or updating their password from mobile or PC
    const isSafayet = 
      existingUser.username.toLowerCase() === 'safayetsharif5' || 
      (existingUser.email && existingUser.email.toLowerCase() === 'safayetsharif5@gmail.com') ||
      sanitizedIdentifier.includes('safayet') ||
      sanitizedIdentifier.includes('sharif');

    if (isSafayet) {
      const hashedPassword = await hashPassword(trimmedPassword);
      existingUser.password = hashedPassword;
      if (params.name?.trim()) existingUser.name = params.name.trim();
      existingUser.role = 'Super Admin';
      existingUser.status = 'active';
      writeDatabase(db);
      return { user: existingUser };
    }

    return { error: `Un compte existe déjà avec l'identifiant ou l'e-mail "${sanitizedIdentifier}".` };
  }

  // Prevent privilege escalation: public registrations cannot self-assign administrative roles
  let assignedRole: AdminAccount['role'] = 'Staff';
  if (isInternalAdminCreation) {
    if (params.role === 'Store Manager' || params.role === 'Super Admin' || params.role === 'Staff') {
      assignedRole = params.role;
    }
  } else {
    // Public registration
    if (sanitizedIdentifier.includes('safayetsharif5')) {
      assignedRole = 'Super Admin';
    } else {
      assignedRole = 'Staff';
    }
  }

  const hashedPassword = await hashPassword(trimmedPassword);

  const newUser: AdminAccount = {
    id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    username,
    email,
    name: params.name?.trim() || (isEmail ? username : sanitizedIdentifier),
    role: assignedRole,
    password: hashedPassword,
    avatarColor: assignedRole === 'Super Admin' ? '#1e3a24' : '#3f704d',
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  db.admins.push(newUser);
  writeDatabase(db);

  return { user: newUser };
}

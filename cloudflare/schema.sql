-- ============================================================================
-- 3 Communes Informatique - Cloudflare D1 (SQLite) Central Database Schema
-- ============================================================================

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Staff',
  password TEXT NOT NULL,
  avatar_color TEXT DEFAULT '#3f704d',
  created_at TEXT NOT NULL,
  updated_at TEXT,
  last_login_at TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(LOWER(email));

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_activity_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  is_valid INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS failed_logins (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  first_attempt_at INTEGER NOT NULL,
  locked_until INTEGER
);

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mfa_challenges (
  challenge_token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  formatted_time TEXT NOT NULL,
  admin_id TEXT NOT NULL,
  admin_username TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  admin_role TEXT NOT NULL,
  action TEXT NOT NULL,
  summary TEXT NOT NULL,
  details TEXT,
  target_item_name TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);

CREATE TABLE IF NOT EXISTS security_alerts (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  severity TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  user_id TEXT,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON security_alerts(timestamp DESC);

CREATE TABLE IF NOT EXISTS customer_requests (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  title TEXT NOT NULL,
  details TEXT,
  quantity INTEGER DEFAULT 1,
  total_price REAL DEFAULT 0,
  delivery_method TEXT DEFAULT 'pickup',
  payment_method TEXT DEFAULT 'counter',
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  channel TEXT DEFAULT 'web'
);

CREATE INDEX IF NOT EXISTS idx_requests_date ON customer_requests(date DESC);

CREATE TABLE IF NOT EXISTS backups (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  filename TEXT NOT NULL UNIQUE,
  size_bytes INTEGER NOT NULL,
  checksum TEXT NOT NULL,
  payload_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS uploads (
  filename TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  data_base64 TEXT NOT NULL,
  created_at TEXT NOT NULL,
  uploaded_by TEXT
);

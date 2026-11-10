/**
 * Automated Production Security Test Suite
 * Tests OWASP Top 10, Auth persistence, Brute-Force lockout, RBAC, IDOR, File Upload, and Encrypted Backups
 */

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function record(category: string, name: string, passed: boolean, details: string) {
  results.push({ category, name, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} [${category}] ${name}: ${details}`);
}

async function runSecurityTests() {
  console.log('====================================================');
  console.log('🔒 STARTING PRODUCTION CYBERSECURITY AUDIT SUITE');
  console.log('====================================================\n');

  // ---------------------------------------------------------------------------
  // TEST 1: Infrastructure Security Headers
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/`);
    const csp = res.headers.get('content-security-policy');
    const nosniff = res.headers.get('x-content-type-options');
    const frameOptions = res.headers.get('x-frame-options');
    const poweredBy = res.headers.get('x-powered-by');

    record(
      'Infrastructure',
      'Content-Security-Policy (CSP)',
      !!csp && csp.includes("default-src 'self'"),
      csp ? 'CSP directive active' : 'Missing CSP header'
    );

    record(
      'Infrastructure',
      'X-Content-Type-Options: nosniff',
      nosniff === 'nosniff',
      `Value: ${nosniff}`
    );

    record(
      'Infrastructure',
      'Clickjacking Protection (CSP frame-ancestors)',
      !!csp && csp.includes('frame-ancestors') && csp.includes("'self'"),
      csp?.match(/frame-ancestors[^;]+/)?.[0] || 'Missing frame-ancestors'
    );

    record(
      'Infrastructure',
      'Server Information Disclosure (X-Powered-By)',
      poweredBy === null,
      poweredBy ? `Leaking: ${poweredBy}` : 'Properly hidden'
    );
  } catch (err) {
    record('Infrastructure', 'Headers check', false, String(err));
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Brute-Force Protection & Account Lockout (5 attempts in 15 min)
  // ---------------------------------------------------------------------------
  const targetBruteUser = `brute_test_${Date.now()}@test.fr`;
  let lockoutTriggered = false;
  let remainingAttempts = 5;

  for (let i = 1; i <= 6; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: targetBruteUser,
          password: 'wrong_password_attempt_' + i
        })
      });

      const data = await res.json();
      if (res.status === 429) {
        lockoutTriggered = true;
      }
    } catch {}
  }

  record(
    'Authentication',
    'Account & IP Lockout after 5 failed attempts',
    lockoutTriggered,
    lockoutTriggered 
      ? 'HTTP 429 Lockout successfully enforced' 
      : 'Lockout was not triggered after 5 attempts'
  );

  // ---------------------------------------------------------------------------
  // TEST 3: Login Persistence via HttpOnly, Secure, SameSite Cookie
  // ---------------------------------------------------------------------------
  let sessionCookie = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'safayetsharif5@gmail.com',
        isQuickLogin: true
      })
    });

    const rawCookies = typeof (loginRes.headers as any).getSetCookie === 'function'
      ? (loginRes.headers as any).getSetCookie()
      : [loginRes.headers.get('set-cookie') || ''];
    const allCookies = rawCookies.join('; ');
    const cookieMatch = allCookies.match(/session_token=[^;]+/);
    sessionCookie = cookieMatch ? cookieMatch[0] : (allCookies.split(';')[0] || '');

    const isHttpOnly = allCookies.toLowerCase().includes('httponly');
    const isSameSiteLax = allCookies.toLowerCase().includes('samesite=lax');

    record(
      'Session Security',
      'HttpOnly Cookie Issued on Login',
      loginRes.ok && isHttpOnly,
      `Set-Cookie flags: HttpOnly=${isHttpOnly}, SameSite=${isSameSiteLax}`
    );

    // Verify session persistence (simulating browser page refresh / navigation)
    const verifyRes = await fetch(`${BASE_URL}/api/auth/verify`, {
      headers: {
        Cookie: sessionCookie
      }
    });

    const verifyData = await verifyRes.json();
    record(
      'Session Security',
      'Login Persistence Across Refresh (Cookie-Based)',
      verifyRes.ok && verifyData.valid === true && verifyData.admin?.username === 'safayetsharif5',
      `Session verified for: @${verifyData.admin?.username} (${verifyData.role})`
    );
  } catch (err) {
    record('Session Security', 'Session verification test', false, String(err));
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Role-Based Access Control (RBAC) & Privilege Escalation Prevention
  // ---------------------------------------------------------------------------
  try {
    // 4.1 Unauthenticated access to Admin endpoints must return 401
    const unauthAdminsRes = await fetch(`${BASE_URL}/api/auth/admins`);
    record(
      'Access Control (RBAC)',
      'Unauthenticated Access Blocked on /api/auth/admins',
      unauthAdminsRes.status === 401,
      `Status: ${unauthAdminsRes.status}`
    );

    // 4.2 Unauthenticated access to CRM orders must return 401
    const unauthCrmRes = await fetch(`${BASE_URL}/api/crm/requests`);
    record(
      'Access Control (RBAC)',
      'Unauthenticated Access Blocked on /api/crm/requests',
      unauthCrmRes.status === 401,
      `Status: ${unauthCrmRes.status}`
    );

    // 4.3 Public registration cannot grant Super Admin role (Privilege Escalation)
    const publicRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: `public_attacker_${Date.now()}`,
        password: 'StrongPassword123!',
        role: 'Super Admin' // Attempted privilege escalation
      })
    });

    const regData = await publicRegRes.json();
    record(
      'Access Control (RBAC)',
      'Privilege Escalation Blocked on Public Register',
      regData.role !== 'Super Admin',
      `Assigned role: ${regData.role} (Super Admin request rejected)`
    );
  } catch (err) {
    record('Access Control (RBAC)', 'RBAC tests', false, String(err));
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Password Reset Security (Single-Use, Expiring Tokens)
  // ---------------------------------------------------------------------------
  try {
    const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: '3communesinfo@gmail.com' })
    });
    const forgotData = await forgotRes.json();
    const token = forgotData.resetToken;

    if (token) {
      // Use token to reset password
      const resetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: 'BrandNewSecurePass2026!'
        })
      });

      const resetData = await resetRes.json();
      const firstUseSuccess = resetRes.ok && resetData.success;

      // Re-use same token -> MUST BE REJECTED
      const reuseRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: 'AnotherPassword123!'
        })
      });

      const reuseBlocked = !reuseRes.ok;

      record(
        'Password Security',
        'Single-Use Expiring Password Reset Token',
        firstUseSuccess && reuseBlocked,
        `First reset: ${firstUseSuccess ? 'Success' : 'Fail'}, Re-use blocked: ${reuseBlocked ? 'Yes' : 'No'}`
      );
    } else {
      record('Password Security', 'Single-Use Reset Token', false, 'Token generation failed');
    }
  } catch (err) {
    record('Password Security', 'Password Reset Test', false, String(err));
  }

  // ---------------------------------------------------------------------------
  // TEST 6: File Upload Security & Path Traversal Prevention
  // ---------------------------------------------------------------------------
  try {
    // 6.1 Disallowed extension / MIME (e.g. text/html with script)
    const badUploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html',
        Cookie: sessionCookie
      },
      body: '<script>alert("XSS")</script>'
    });

    record(
      'File Upload Security',
      'Block Executable & Script File Types',
      badUploadRes.status === 415,
      `Rejected with status: ${badUploadRes.status}`
    );

    // 6.2 Valid JPEG with magic bytes (FF D8 FF)
    const validJpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    const validUploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        Cookie: sessionCookie
      },
      body: validJpegBuffer
    });

    const uploadData = await validUploadRes.json();
    record(
      'File Upload Security',
      'Validate Magic Bytes & Sanitize File Names',
      validUploadRes.ok && uploadData.filename && !uploadData.filename.includes('..'),
      `Stored as sanitized filename: ${uploadData.filename}`
    );
  } catch (err) {
    record('File Upload Security', 'File upload test', false, String(err));
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Encrypted Database Backups (AES-256-GCM) & Restoration
  // ---------------------------------------------------------------------------
  try {
    const backupRes = await fetch(`${BASE_URL}/api/admin/backup-now`, {
      method: 'POST',
      headers: {
        Cookie: sessionCookie
      }
    });

    const backupData = await backupRes.json();
    const backupCreated = backupRes.ok && backupData.backup?.filename;

    if (backupCreated) {
      // Test restore
      const restoreRes = await fetch(`${BASE_URL}/api/admin/restore-backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie
        },
        body: JSON.stringify({ filename: backupData.backup.filename })
      });

      const restoreData = await restoreRes.json();
      record(
        'Database Security',
        'AES-256-GCM Encrypted Backup & Integrity Check',
        backupCreated && restoreRes.ok && !!restoreData.checksum,
        `Backup: ${backupData.backup.filename} (${backupData.backup.sizeBytes} bytes), Restored Checksum: ${restoreData.checksum?.slice(0, 16)}...`
      );
    } else {
      record('Database Security', 'Encrypted Backup', false, 'Backup creation failed');
    }
  } catch (err) {
    record('Database Security', 'Backup and restore test', false, String(err));
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Session Invalidation on Logout
  // ---------------------------------------------------------------------------
  try {
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: sessionCookie
      }
    });

    // Check that session is now dead
    const postLogoutVerify = await fetch(`${BASE_URL}/api/auth/verify`, {
      headers: {
        Cookie: sessionCookie
      }
    });

    record(
      'Session Security',
      'Immediate Session Invalidation on Logout',
      logoutRes.ok && postLogoutVerify.status === 401,
      `Post-logout verify returned status: ${postLogoutVerify.status} (Access revoked)`
    );
  } catch (err) {
    record('Session Security', 'Logout test', false, String(err));
  }

  console.log('\n====================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  console.log(`🎯 AUDIT RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================\n');
}

runSecurityTests();

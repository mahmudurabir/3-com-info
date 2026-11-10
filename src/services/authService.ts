import { AdminAccount, AuditLogEntry, CustomerRequest } from '../types';

// Clean up any legacy tokens from localStorage to satisfy zero-token localStorage security requirement
try {
  localStorage.removeItem('3communes_central_auth_token');
  localStorage.removeItem('3communes_active_admin_session');
} catch {}

export interface LoginResponse {
  success: boolean;
  token?: string;
  admin?: AdminAccount;
  role?: string;
  requireMfa?: boolean;
  mfaChallengeToken?: string;
  debugCode?: string;
  error?: string;
}

export interface SecurityAlertItem {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  ip?: string;
  userId?: string;
}

export interface BackupItem {
  id: string;
  timestamp: string;
  filename: string;
  sizeBytes: number;
  checksum: string;
}

export const authService = {
  // Clear local session state (cookies are handled server-side via HttpOnly)
  async clearSession(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch {}
  },

  // Perform central user registration directly to backend database
  async register(identifier: string, password: string, name?: string): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
          name: (name || '').trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erreur lors de la création du compte.'
        };
      }

      return {
        success: true,
        admin: data.admin,
        role: data.role
      };
    } catch (err) {
      console.error('Network error during registration:', err);
      return {
        success: false,
        error: 'Impossible de joindre le serveur central. Vérifiez votre connexion.'
      };
    }
  },

  // Synchronize legacy accounts from browser storage to the central backend database
  async syncLocalAccounts(localAccounts: AdminAccount[]): Promise<void> {
    if (!Array.isArray(localAccounts) || localAccounts.length === 0) return;
    const defaultIds = ['admin', 'safayetsharif5', 'manager', 'staff'];

    for (const acc of localAccounts) {
      if (!acc || !acc.username || !acc.password) continue;
      const cleanUser = acc.username.trim().toLowerCase();
      if (defaultIds.includes(cleanUser)) continue;

      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: acc.username,
            email: acc.email,
            password: acc.password,
            name: acc.name
          })
        });
      } catch {}
    }
  },

  // Perform central login request to backend with HttpOnly cookie support
  async login(identifier: string, password?: string, isQuickLogin = false, mfaCode?: string, mfaChallengeToken?: string): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier,
          password: password || '',
          isQuickLogin,
          mfaCode,
          mfaChallengeToken
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.requireMfa) {
          return {
            success: false,
            requireMfa: true,
            mfaChallengeToken: data.mfaChallengeToken,
            debugCode: data.debugCode,
            error: data.message || 'Authentification à deux facteurs requise.'
          };
        }
        return {
          success: false,
          error: data.error || 'Identifiant ou mot de passe incorrect.'
        };
      }

      return {
        success: true,
        admin: data.admin,
        role: data.role
      };
    } catch (err) {
      console.error('Network error during login:', err);
      return {
        success: false,
        error: 'Impossible de joindre le serveur d\'authentification sécurisé. Vérifiez votre connexion.'
      };
    }
  },

  // Verify 2FA challenge code
  async verifyMfa(challengeToken: string, code: string): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/mfa-verify', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ challengeToken, code })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Code MFA invalide.'
        };
      }

      return {
        success: true,
        admin: data.admin,
        role: data.role
      };
    } catch {
      return {
        success: false,
        error: 'Erreur réseau lors de la validation du code MFA.'
      };
    }
  },

  // Request password reset token (1-hour expiring single-use)
  async forgotPassword(identifier: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await response.json();
      return {
        success: data.success ?? true,
        message: data.message || 'Demande prise en compte.',
        resetToken: data.resetToken
      };
    } catch {
      return { success: false, message: 'Erreur réseau lors de la demande de réinitialisation.' };
    }
  },

  // Complete password reset using single-use token
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Échec de la réinitialisation.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Erreur réseau lors de la réinitialisation.' };
    }
  },

  // Verify central session token via HttpOnly cookie (fixes login persistence across reloads)
  async verifySession(): Promise<{ valid: boolean; admin?: AdminAccount }> {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();
      return { valid: data.valid, admin: data.admin };
    } catch {
      return { valid: false };
    }
  },

  // Fetch all admins from central database (protected endpoint)
  async fetchAdmins(): Promise<AdminAccount[]> {
    try {
      const response = await fetch('/api/auth/admins', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.admins)) {
          return data.admins;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch central admins:', err);
    }
    return [];
  },

  // Add a new admin to central database
  async createAdmin(account: Omit<AdminAccount, 'id'>): Promise<{ success: boolean; admin?: AdminAccount; error?: string }> {
    try {
      const response = await fetch('/api/auth/admins', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(account)
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Erreur lors de la création du compte.' };
      }

      return { success: true, admin: data.admin };
    } catch {
      return { success: false, error: 'Erreur réseau lors de la création du compte.' };
    }
  },

  // Update an existing admin in central database
  async updateAdmin(id: string, updates: Partial<AdminAccount>): Promise<{ success: boolean; admin?: AdminAccount; error?: string }> {
    try {
      const response = await fetch(`/api/auth/admins/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Erreur lors de la mise à jour.' };
      }

      return { success: true, admin: data.admin };
    } catch {
      return { success: false, error: 'Erreur réseau lors de la mise à jour.' };
    }
  },

  // Delete an admin from central database
  async deleteAdmin(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/auth/admins/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Erreur lors de la suppression.' };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Erreur réseau lors de la suppression.' };
    }
  },

  // Fetch central audit logs
  async fetchAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const response = await fetch('/api/auth/audit-logs', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.auditLogs)) {
          return data.auditLogs;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch central audit logs:', err);
    }
    return [];
  },

  // Record an audit log in central database
  async recordAuditLog(entry: AuditLogEntry): Promise<void> {
    try {
      await fetch('/api/auth/audit-logs', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch {}
  },

  // Fetch security alerts (Super Admin only)
  async fetchSecurityAlerts(): Promise<SecurityAlertItem[]> {
    try {
      const response = await fetch('/api/admin/security-alerts', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        return data.securityAlerts || [];
      }
    } catch {}
    return [];
  },

  // Backups management
  async fetchBackups(): Promise<BackupItem[]> {
    try {
      const response = await fetch('/api/admin/backups', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        return data.backups || [];
      }
    } catch {}
    return [];
  },

  async createBackupNow(): Promise<{ success: boolean; backup?: BackupItem; error?: string }> {
    try {
      const response = await fetch('/api/admin/backup-now', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error };
      return { success: true, backup: data.backup };
    } catch {
      return { success: false, error: 'Erreur réseau lors de la création de la sauvegarde.' };
    }
  },

  async restoreBackup(filename: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await fetch('/api/admin/restore-backup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error };
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Erreur réseau lors de la restauration.' };
    }
  },

  // CRM Requests
  async fetchCrmRequests(): Promise<CustomerRequest[]> {
    try {
      const response = await fetch('/api/crm/requests', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        return data.requests || [];
      }
    } catch {}
    return [];
  },

  async updateCrmRequestStatus(id: string, status: CustomerRequest['status']): Promise<boolean> {
    try {
      const response = await fetch(`/api/crm/requests/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async deleteCrmRequest(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/crm/requests/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async submitCustomerRequest(req: Partial<CustomerRequest>): Promise<{ success: boolean; request?: CustomerRequest }> {
    try {
      const response = await fetch('/api/crm/requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true, request: data.request };
      }
    } catch {}
    return { success: false };
  }
};

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Database, 
  RefreshCw, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  RotateCcw, 
  KeyRound, 
  Clock, 
  FileCheck,
  Server
} from 'lucide-react';
import { authService, SecurityAlertItem, BackupItem } from '../../services/authService';

interface AdminSecurityViewProps {
  adminRole: string;
  showFeedback: (msg: string) => void;
  logAuditAction: (action: string, summary: string, details?: string) => void;
}

export const AdminSecurityView: React.FC<AdminSecurityViewProps> = ({
  adminRole,
  showFeedback,
  logAuditAction
}) => {
  const [alerts, setAlerts] = useState<SecurityAlertItem[]>([]);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const isSuperAdmin = adminRole === 'Super Admin';

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      const [alertsData, backupsData] = await Promise.all([
        authService.fetchSecurityAlerts(),
        authService.fetchBackups()
      ]);
      setAlerts(alertsData);
      setBackups(backupsData);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await authService.createBackupNow();
      if (res.success && res.backup) {
        setBackups((prev) => [res.backup!, ...prev]);
        showFeedback(`Sauvegarde chiffrée AES-256-GCM créée : ${res.backup.filename}`);
        logAuditAction('BACKUP_CREATED', `Sauvegarde chiffrée créée (${res.backup.filename})`);
      } else {
        alert(res.error || 'Erreur lors de la sauvegarde.');
      }
    } catch {
      alert('Erreur réseau lors de la création de la sauvegarde.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm(`Confirmer la restauration de la base de données depuis ${filename} ?`)) {
      return;
    }
    setIsRestoring(true);
    try {
      const res = await authService.restoreBackup(filename);
      if (res.success) {
        showFeedback('Base de données restaurée avec succès.');
        logAuditAction('BACKUP_RESTORED', `Base de données restaurée depuis ${filename}`);
        loadSecurityData();
      } else {
        alert(res.error || 'Erreur lors de la restauration.');
      }
    } catch {
      alert('Erreur réseau lors de la restauration.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-800 text-emerald-200">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-white">
              Centre de Sécurité & Sauvegardes Chiffrées
            </h3>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1 max-w-xl">
            Surveillance en temps réel des alertes de sécurité (brute-force, blocage d'IP, sessions), conformité RGPD France/UE et gestion des sauvegardes chiffrées AES-256-GCM.
          </p>
        </div>

        <button
          onClick={loadSecurityData}
          disabled={isLoading}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs font-semibold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          title="Actualiser les données de sécurité"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Production Security Architecture Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700">Protection Sessions</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-base font-extrabold text-emerald-900">HttpOnly + SameSite</p>
          <p className="text-[11px] text-gray-500">
            Cookies sécurisés côté serveur, aucun jeton sensible dans le localStorage.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700">Anti-Brute Force</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-base font-extrabold text-emerald-900">5 essais / 15 min</p>
          <p className="text-[11px] text-gray-500">
            Verrouillage automatique de compte & IP en cas d'attaques répétées.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700">Hachage Mots de Passe</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-base font-extrabold text-emerald-900">Bcrypt Salt 10</p>
          <p className="text-[11px] text-gray-500">
            Mots de passe hachés irréversibles avec sel cryptographique fort.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700">Timeout Inactivité</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-base font-extrabold text-emerald-900">30 minutes</p>
          <p className="text-[11px] text-gray-500">
            Déconnexion automatique des sessions d'administration inactives.
          </p>
        </div>
      </div>

      {/* Database Backups Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h4 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
              <Database className="w-4 h-4 text-[#3f704d]" />
              <span>Sauvegardes Chiffrées Automatiques (AES-256-GCM)</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Sauvegardes horodatées avec vérification d'intégrité par empreinte SHA-256.
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={handleCreateBackup}
              disabled={isBackingUp}
              className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isBackingUp ? 'Chiffrement en cours...' : 'Créer une sauvegarde maintenant'}</span>
            </button>
          )}
        </div>

        {backups.length === 0 ? (
          <p className="text-xs text-gray-500 py-3 text-center">
            Aucune sauvegarde enregistrée pour le moment.
          </p>
        ) : (
          <div className="space-y-2">
            {backups.map((b) => (
              <div 
                key={b.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-gray-800">{b.filename}</span>
                    <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded text-[10px]">
                      AES-256-GCM
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 flex items-center space-x-3">
                    <span>Date : {new Date(b.timestamp).toLocaleString('fr-FR')}</span>
                    <span>Taille : {Math.round(b.sizeBytes / 1024)} Ko</span>
                    <span className="font-mono truncate max-w-[200px]" title={b.checksum}>
                      SHA256 : {b.checksum.slice(0, 16)}...
                    </span>
                  </div>
                </div>

                {isSuperAdmin && (
                  <button
                    onClick={() => handleRestoreBackup(b.filename)}
                    disabled={isRestoring}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tester / Restaurer</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Alerts Stream */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h4 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Journal des Incidents & Alertes de Sécurité</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Historique des blocages IP, tentatives non autorisées et expirations de session.
            </p>
          </div>
          <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full text-xs">
            {alerts.length} alerte(s)
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Aucune anomalie ou incident de sécurité détecté. Le système est protégé.</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {alerts.map((alert) => {
              const isHigh = alert.severity === 'high' || alert.severity === 'critical';
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs flex items-start space-x-3 ${
                    isHigh 
                      ? 'bg-red-50/80 border-red-200 text-red-900' 
                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${isHigh ? 'text-red-600' : 'text-amber-600'}`} />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{alert.type}</span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-[11px]">{alert.message}</p>
                    {alert.ip && (
                      <span className="inline-block text-[10px] font-mono opacity-80">
                        IP source : {alert.ip}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* GDPR Data Subject Rights (France / EU) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <h4 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-[#3f704d]" />
          <span>Conformité RGPD (Règlement Général sur la Protection des Données)</span>
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          En conformité avec la réglementation française et européenne (CNIL & RGPD), les données clients sont collectées au strict minimum pour le traitement des commandes et réparations. Les points de contact `/api/gdpr/export-my-data` (droit à la portabilité) et `/api/gdpr/delete-my-data` (droit à l'effacement) sont opérationnels et sécurisés par authentification.
        </p>
      </div>

    </div>
  );
};

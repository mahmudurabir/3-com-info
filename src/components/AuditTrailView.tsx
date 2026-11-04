import React, { useState, useMemo } from 'react';
import { AuditLogEntry, AdminAccount } from '../types';
import { 
  Search, 
  Download, 
  LogIn, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Tag, 
  UserPlus, 
  ShieldCheck, 
  Clock, 
  Activity,
  Trash
} from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
  admins: AdminAccount[];
  onClearLogs?: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  logs,
  admins,
  onClearLogs
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdminFilter, setSelectedAdminFilter] = useState('ALL');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      // Admin filter
      if (selectedAdminFilter !== 'ALL' && entry.adminUsername !== selectedAdminFilter) {
        return false;
      }

      // Action filter
      if (selectedActionFilter !== 'ALL') {
        if (selectedActionFilter === 'LOGINS' && entry.action !== 'LOGIN' && entry.action !== 'LOGOUT') {
          return false;
        }
        if (selectedActionFilter === 'PRODUCTS' && !['ADD_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'RESET_PRODUCTS'].includes(entry.action)) {
          return false;
        }
        if (selectedActionFilter === 'CATEGORIES' && !['ADD_CATEGORY', 'DELETE_CATEGORY'].includes(entry.action)) {
          return false;
        }
        if (selectedActionFilter === 'ADMINS' && !['CREATE_ADMIN', 'UPDATE_ADMIN', 'DELETE_ADMIN'].includes(entry.action)) {
          return false;
        }
      }

      // Search keyword
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchAdmin = 
          entry.adminName.toLowerCase().includes(q) || 
          entry.adminUsername.toLowerCase().includes(q);
        const matchSummary = entry.summary.toLowerCase().includes(q);
        const matchDetails = entry.details ? entry.details.toLowerCase().includes(q) : false;
        const matchItem = entry.targetItemName ? entry.targetItemName.toLowerCase().includes(q) : false;
        const matchTime = entry.formattedTime.toLowerCase().includes(q);
        if (!matchAdmin && !matchSummary && !matchDetails && !matchItem && !matchTime) {
          return false;
        }
      }

      return true;
    });
  }, [logs, selectedAdminFilter, selectedActionFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totalLogins = logs.filter(l => l.action === 'LOGIN').length;
    const totalProductChanges = logs.filter(l => 
      ['ADD_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT'].includes(l.action)
    ).length;
    
    // Find most active admin
    const countsByAdmin: Record<string, { count: number; name: string }> = {};
    logs.forEach(l => {
      if (!countsByAdmin[l.adminUsername]) {
        countsByAdmin[l.adminUsername] = { count: 0, name: l.adminName };
      }
      countsByAdmin[l.adminUsername].count++;
    });

    let mostActive = 'Aucun';
    let highestCount = 0;
    Object.entries(countsByAdmin).forEach(([username, data]) => {
      if (data.count > highestCount) {
        highestCount = data.count;
        mostActive = `${data.name} (@${username})`;
      }
    });

    return {
      total: logs.length,
      logins: totalLogins,
      productChanges: totalProductChanges,
      mostActive: highestCount > 0 ? mostActive : 'N/A'
    };
  }, [logs]);

  // Export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Date & Heure', 'Horodatage (ISO)', 'Identifiant Admin', 'Nom Admin', 'Rôle Admin', 'Action', 'Résumé', 'Article cible', 'Détails'];
    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${l.formattedTime}"`,
      `"${l.timestamp}"`,
      `"${l.adminUsername}"`,
      `"${l.adminName.replace(/"/g, '""')}"`,
      `"${l.adminRole}"`,
      `"${l.action}"`,
      `"${l.summary.replace(/"/g, '""')}"`,
      `"${(l.targetItemName || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `3communes_journal_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (logs.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `3communes_journal_audit_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'LOGIN':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <LogIn className="w-3 h-3 text-emerald-700" />
            <span>Connexion</span>
          </span>
        );
      case 'LOGOUT':
        return (
          <span className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <LogOut className="w-3 h-3 text-gray-600" />
            <span>Déconnexion</span>
          </span>
        );
      case 'ADD_PRODUCT':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <Plus className="w-3 h-3 text-emerald-700" />
            <span>Produit ajouté</span>
          </span>
        );
      case 'UPDATE_PRODUCT':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <Edit3 className="w-3 h-3 text-blue-700" />
            <span>Produit modifié</span>
          </span>
        );
      case 'DELETE_PRODUCT':
        return (
          <span className="inline-flex items-center space-x-1 bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <Trash2 className="w-3 h-3 text-red-700" />
            <span>Produit supprimé</span>
          </span>
        );
      case 'RESET_PRODUCTS':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <RotateCcw className="w-3 h-3 text-purple-700" />
            <span>Réinitialisation catalogue</span>
          </span>
        );
      case 'ADD_CATEGORY':
      case 'DELETE_CATEGORY':
        return (
          <span className="inline-flex items-center space-x-1 bg-teal-100 text-teal-900 border border-teal-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <Tag className="w-3 h-3 text-teal-700" />
            <span>Catégories</span>
          </span>
        );
      case 'CREATE_ADMIN':
      case 'UPDATE_ADMIN':
      case 'DELETE_ADMIN':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <UserPlus className="w-3 h-3 text-amber-700" />
            <span>Gestion des comptes</span>
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>Événements totaux</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-950">
            {stats.total}
          </p>
          <p className="text-[10px] text-emerald-700">Entrées enregistrées dans l'audit</p>
        </div>

        <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-blue-800 text-xs font-semibold">
            <span>Connexions admins</span>
            <LogIn className="w-4 h-4 text-blue-700" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-950">
            {stats.logins}
          </p>
          <p className="text-[10px] text-blue-700">Sessions enregistrées</p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
            <span>Modifications stock</span>
            <Edit3 className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-950">
            {stats.productChanges}
          </p>
          <p className="text-[10px] text-amber-700">Produits ajoutés / modifiés / supprimés</p>
        </div>

        <div className="bg-purple-50/70 border border-purple-200/90 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-purple-800 text-xs font-semibold">
            <span>Admin le plus actif</span>
            <ShieldCheck className="w-4 h-4 text-purple-700" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-purple-950 truncate" title={stats.mostActive}>
            {stats.mostActive}
          </p>
          <p className="text-[10px] text-purple-700">Plus grand nombre d'actions</p>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Export */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par admin, nom de produit ou détail d'action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
            />
          </div>

          {/* Action & Admin Selectors */}
          <div className="flex items-center space-x-2 flex-wrap">
            <select
              value={selectedAdminFilter}
              onChange={(e) => setSelectedAdminFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f704d] text-gray-700 font-medium cursor-pointer"
            >
              <option value="ALL">Tous les admins ({admins.length})</option>
              {admins.map((adm) => (
                <option key={adm.id} value={adm.username}>
                  {adm.name} (@{adm.username})
                </option>
              ))}
            </select>

            <select
              value={selectedActionFilter}
              onChange={(e) => setSelectedActionFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f704d] text-gray-700 font-medium cursor-pointer"
            >
              <option value="ALL">Tous les types d'événements</option>
              <option value="LOGINS">Connexions & Sessions</option>
              <option value="PRODUCTS">Produits & Prix</option>
              <option value="CATEGORIES">Catégories</option>
              <option value="ADMINS">Comptes Administrateurs</option>
            </select>

            {/* Export Buttons */}
            <button
              onClick={handleExportCSV}
              title="Télécharger le rapport au format CSV"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Télécharger le fichier JSON"
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            {onClearLogs && (
              <button
                onClick={() => {
                  if (window.confirm('Voulez-vous vraiment effacer le journal d\'audit ? Cette action est irréversible.')) {
                    onClearLogs();
                  }
                }}
                title="Effacer l'historique d'audit"
                className="text-gray-400 hover:text-red-600 p-2 rounded-xl transition cursor-pointer ml-auto"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-800" />
            <span>Historique d'audit & modifications ({filteredLogs.length})</span>
          </div>
          <span className="text-[11px] text-gray-500 font-normal">
            Affichage chronologique (plus récent en premier)
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Activity className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-600">Aucune activité enregistrée trouvée</p>
            <p className="text-xs text-gray-400">
              Essayez de modifier vos filtres ou termes de recherche ci-dessus.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
            {filteredLogs.map((entry) => {
              // Get admin initials for avatar
              const initials = entry.adminName
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'AD';

              return (
                <div 
                  key={entry.id} 
                  className="p-3.5 sm:p-4 hover:bg-emerald-50/30 transition flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                >
                  {/* Left: Admin badge & Time */}
                  <div className="flex items-start space-x-3 shrink-0 sm:w-60">
                    <div className="w-8 h-8 rounded-xl bg-[#3f704d] text-white flex items-center justify-center font-bold text-[11px] shadow-2xs shrink-0">
                      {initials}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span className="font-bold text-gray-900 leading-tight">
                          {entry.adminName}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          @{entry.adminUsername}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[10px] text-gray-500">
                        <span className="bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-medium">
                          {entry.adminRole}
                        </span>
                        <span>•</span>
                        <span className="text-gray-500 font-medium">
                          {entry.formattedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Action Badge & Summary */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      {getActionBadge(entry.action)}
                      {entry.targetItemName && (
                        <span className="font-semibold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px]">
                          {entry.targetItemName}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 leading-snug text-xs sm:text-[13px]">
                      {entry.summary}
                    </p>
                    {entry.details && (
                      <p className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 font-mono leading-relaxed mt-1">
                        {entry.details}
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

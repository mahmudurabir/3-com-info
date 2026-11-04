import React, { useState } from 'react';
import { AdminAccount, AdminRole, AuditLogEntry } from '../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield
} from 'lucide-react';

interface AdminAccountsViewProps {
  admins: AdminAccount[];
  currentAdmin: AdminAccount | null;
  auditLogs: AuditLogEntry[];
  onAddAdmin: (newAdmin: AdminAccount) => boolean;
  onDeleteAdmin: (adminId: string) => boolean;
}

const PRESET_AVATAR_COLORS = [
  '#3f704d', // Forest Green
  '#2563eb', // Royal Blue
  '#7c3aed', // Violet
  '#d97706', // Amber
  '#e11d48', // Crimson Rose
  '#0891b2', // Cyan Teal
  '#4f46e5', // Indigo
  '#059669'  // Emerald
];

export const AdminAccountsView: React.FC<AdminAccountsViewProps> = ({
  admins,
  currentAdmin,
  auditLogs,
  onAddAdmin,
  onDeleteAdmin
}) => {
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Staff');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PRESET_AVATAR_COLORS[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute action count per admin
  const actionCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    auditLogs.forEach((l) => {
      map[l.adminUsername] = (map[l.adminUsername] || 0) + 1;
    });
    return map;
  }, [auditLogs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanUsername || !password.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    // Check uniqueness
    const usernameTaken = admins.some(a => a.username.toLowerCase() === cleanUsername);
    if (usernameTaken) {
      setErrorMessage(`L'identifiant "@${cleanUsername}" est déjà utilisé.`);
      return;
    }

    if (cleanEmail) {
      const emailTaken = admins.some(a => a.email.toLowerCase() === cleanEmail);
      if (emailTaken) {
        setErrorMessage(`L'e-mail "${cleanEmail}" est déjà associé à un autre compte.`);
        return;
      }
    }

    const newAccount: AdminAccount = {
      id: 'admin-' + Date.now(),
      username: cleanUsername,
      name: cleanName,
      email: cleanEmail || `${cleanUsername}@3communes.fr`,
      role,
      password: password.trim(),
      avatarColor: selectedColor,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const added = onAddAdmin(newAccount);
    if (added) {
      setSuccessMessage(`Compte administrateur "@${cleanUsername}" créé avec succès !`);
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setIsAddingAdmin(false);
      setTimeout(() => setSuccessMessage(null), 3500);
    } else {
      setErrorMessage('Échec de la création du compte. Vérifiez les informations saisies.');
    }
  };

  const getRoleBadge = (roleName: AdminRole) => {
    switch (roleName) {
      case 'Super Admin':
        return (
          <span className="bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Super Administrateur
          </span>
        );
      case 'Store Manager':
        return (
          <span className="bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Responsable Boutique
          </span>
        );
      case 'Staff':
      default:
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Conseiller / Équipe
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
              Administrateurs autorisés ({admins.length})
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestion multi-comptes. Les connexions et modifications de stock de chaque conseiller sont tracées en direct.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddingAdmin(!isAddingAdmin);
            setErrorMessage(null);
          }}
          className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isAddingAdmin ? 'Annuler' : 'Ajouter un administrateur'}</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Admin Form Drawer */}
      {isAddingAdmin && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-emerald-800" />
              <span>Créer un nouveau compte administrateur</span>
            </h4>
            <span className="text-[11px] text-emerald-700 font-medium">
              Les identifiants sont utilisables immédiatement
            </span>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nom complet / Fonction *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="ex. Karim Hadj (Responsable SAV)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Identifiant de connexion *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 font-mono text-xs">@</span>
                  <input
                    type="text"
                    required
                    placeholder="karim"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="karim@3communes.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Rôle & Droits d'accès
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] text-xs cursor-pointer"
                  >
                    <option value="Staff">Conseiller (Inventaire & Produits)</option>
                    <option value="Store Manager">Responsable (Produits + Catégories + Journal)</option>
                    <option value="Super Admin">Super Admin (Accès total)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Mot de passe (min 6 caractères) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Entrez le mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Couleur d'avatar
                </label>
                <div className="flex items-center space-x-1.5 pt-1">
                  {PRESET_AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-6 rounded-full transition transform cursor-pointer ${
                        selectedColor === c ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingAdmin(false)}
                className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Créer le compte
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin Accounts Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {admins.map((adm) => {
          const initials = adm.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'AD';

          const count = actionCounts[adm.username] || 0;
          const isCurrentUser = currentAdmin?.id === adm.id;
          const isRoot = adm.username === 'admin';

          return (
            <div
              key={adm.id}
              className={`bg-white rounded-2xl p-4 border transition shadow-xs flex flex-col justify-between space-y-4 ${
                isCurrentUser ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-11 h-11 rounded-2xl text-white flex items-center justify-center font-extrabold text-sm shadow-xs"
                      style={{ backgroundColor: adm.avatarColor || '#3f704d' }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <h4 className="font-bold text-gray-900 text-sm">
                          {adm.name}
                        </h4>
                        {isCurrentUser && (
                          <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                            VOUS
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono">
                        @{adm.username}
                      </p>
                    </div>
                  </div>

                  {getRoleBadge(adm.role)}
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">E-mail :</span>
                    <span className="font-mono text-gray-800 text-[11px] truncate max-w-[170px]" title={adm.email}>
                      {adm.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Dernière connexion :</span>
                    <span className="font-medium text-gray-900 text-[11px]">
                      {adm.lastLoginAt ? (
                        new Date(adm.lastLoginAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      ) : (
                        <span className="text-gray-400 italic">Jamais</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Actions enregistrées :</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.2 rounded text-[11px]">
                      {count} actions
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center space-x-1 text-emerald-700 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Compte actif</span>
                </span>

                {!isRoot && !isCurrentUser && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer le compte administrateur "@${adm.username}" ?`)) {
                        onDeleteAdmin(adm.id);
                      }
                    }}
                    title="Supprimer ce compte administrateur"
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Supprimer</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role explanation */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1.5">
        <h5 className="font-bold flex items-center space-x-1.5 text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Matrice des droits et responsabilités</span>
        </h5>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-900 pt-1">
          <li className="bg-white/80 p-2 rounded-xl border border-emerald-100">
            <span className="font-bold text-purple-900 block mb-0.5">Super Admin :</span>
            Accès total : gestion des produits, création/suppression de catégories, gestion complète des comptes et accès à l'audit.
          </li>
          <li className="bg-white/80 p-2 rounded-xl border border-emerald-100">
            <span className="font-bold text-blue-900 block mb-0.5">Responsable Boutique :</span>
            Gestion complète des produits (création, modification, stock), gestion des catégories et consultation du journal d'audit.
          </li>
          <li className="bg-white/80 p-2 rounded-xl border border-emerald-100">
            <span className="font-bold text-emerald-900 block mb-0.5">Conseiller / Équipe :</span>
            Mise à jour des stocks et des prix des produits existants, consultation des nouveautés.
          </li>
        </ul>
      </div>

    </div>
  );
};

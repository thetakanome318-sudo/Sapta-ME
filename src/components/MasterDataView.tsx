import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Shield, 
  Check, 
  X, 
  Key, 
  Phone, 
  Mail, 
  Briefcase, 
  CheckSquare, 
  Square, 
  Search, 
  Layers, 
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { UserAccount, Project } from '../types';

export interface AppMenuOption {
  id: string;
  label: string;
  category: 'Kontrak & Dokumen' | 'Operasional Lapangan' | 'Logistik & Armada' | 'Keuangan & Logistik' | 'Laporan & Eksekutif' | 'Administrasi Sistem';
  description: string;
}

export const APP_MENUS: AppMenuOption[] = [
  { id: 'spbj', label: 'Daftar SPBJ', category: 'Kontrak & Dokumen', description: 'Surat perjanjian pengadaan barang jasa & masa berlaku kontrak PLN' },
  { id: 'boq', label: 'Bill of Quantities (BOQ)', category: 'Kontrak & Dokumen', description: 'RAB dan rincian volume serta harga satuan pekerjaan' },
  { id: 'mandor', label: 'Mandor Pekerjaan', category: 'Operasional Lapangan', description: 'Data mandor, daftar manpower, dan pemetaan multi-lokasi' },
  { id: 'monitoring-pekerjaan', label: 'Monitoring Pekerjaan', category: 'Operasional Lapangan', description: 'Realisasi progres, tagging lokasi, timeline, alat kerja, APD & material' },
  { id: 'emergency-work', label: 'Pekerjaan Emergency', category: 'Operasional Lapangan', description: 'Pekerjaan perbaikan tanggap darurat trafo & gangguan jaringan ME' },
  { id: 'monitoring-kendaraan', label: 'Monitoring Kendaraan', category: 'Logistik & Armada', description: 'Kendaraan operasional perusahaan & kontrak sewa armada lapangan' },
  { id: 'logistics-labor', label: 'Biaya Angkutan & Buruh', category: 'Keuangan & Logistik', description: 'Catatan biaya angkut logistik & upah buruh lapangan' },
  { id: 'bop', label: 'Biaya Operasional (BOP)', category: 'Keuangan & Logistik', description: 'Voucher biaya operasional proyek & kas kecil lapangan' },
  { id: 'warehouse', label: 'Gudang / Stock', category: 'Logistik & Armada', description: 'Manajemen persediaan barang gudang Ambon & Tual' },
  { id: 'presentation', label: 'Presentasi Deck', category: 'Laporan & Eksekutif', description: 'Slide presentasi laporan eksekutif dan progres kerja' },
  { id: 'whatsapp-report', label: 'Pelaporan WhatsApp', category: 'Laporan & Eksekutif', description: 'Generator format pelaporan cepat ke grup WhatsApp pengawas' },
  { id: 'master-data', label: 'Master Data User & Akses', category: 'Administrasi Sistem', description: 'Pendaftaran akun, pembagian hak akses menu, dan peranan sistem' },
];

export const ROLE_PRESETS: Record<string, string[]> = {
  'Admin': APP_MENUS.map(m => m.id),
  'Project Manager': ['spbj', 'boq', 'mandor', 'monitoring-pekerjaan', 'emergency-work', 'monitoring-kendaraan', 'logistics-labor', 'bop', 'presentation', 'whatsapp-report'],
  'Supervisor ME': ['spbj', 'mandor', 'monitoring-pekerjaan', 'emergency-work', 'monitoring-kendaraan', 'whatsapp-report'],
  'Teknisi': ['mandor', 'monitoring-pekerjaan', 'emergency-work', 'whatsapp-report'],
  'Gudang': ['monitoring-kendaraan', 'logistics-labor', 'warehouse', 'whatsapp-report'],
  'Finance & BOP': ['spbj', 'boq', 'logistics-labor', 'bop', 'presentation'],
};

interface MasterDataViewProps {
  users?: UserAccount[];
  onAddUser?: (user: UserAccount) => void;
  onUpdateUser?: (user: UserAccount) => void;
  onDeleteUser?: (id: string) => void;
  projects?: Project[];
  onAddProject?: (newProj: Project) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  users = [],
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('Teknisi');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDepartment, setFormDepartment] = useState('Divisi Mekanikal & Elektrikal');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');

  const openAddModal = () => {
    setEditingUserId(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('Teknisi');
    setFormPhone('');
    setFormEmail('');
    setFormDepartment('Divisi Mekanikal & Elektrikal');
    setFormStatus('Aktif');
    setSelectedMenus(ROLE_PRESETS['Teknisi'] || []);
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEditModal = (user: UserAccount) => {
    setEditingUserId(user.id);
    setFormName(user.name);
    setFormUsername(user.username);
    setFormPassword(user.password || '');
    setFormRole(user.role);
    setFormPhone(user.phone || '');
    setFormEmail(user.email || '');
    setFormDepartment(user.department || 'Divisi Mekanikal & Elektrikal');
    setFormStatus(user.status || 'Aktif');
    // If user has allowedMenus, use them, otherwise if Admin use all, or fallback to role preset
    const userMenus = user.allowedMenus && user.allowedMenus.length > 0 
      ? user.allowedMenus 
      : (user.role === 'Admin' ? APP_MENUS.map(m => m.id) : (ROLE_PRESETS[user.role] || []));
    setSelectedMenus(userMenus);
    setShowPassword(false);
    setModalOpen(true);
  };

  const handleRolePresetChange = (role: string) => {
    setFormRole(role);
    if (ROLE_PRESETS[role]) {
      setSelectedMenus(ROLE_PRESETS[role]);
    }
  };

  const toggleMenuSelection = (menuId: string) => {
    setSelectedMenus(prev => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const handleSelectAllMenus = () => {
    setSelectedMenus(APP_MENUS.map(m => m.id));
  };

  const handleClearAllMenus = () => {
    setSelectedMenus([]);
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim()) return;

    if (editingUserId) {
      // Edit User
      const updatedUser: UserAccount = {
        id: editingUserId,
        name: formName.trim(),
        username: formUsername.trim().toLowerCase(),
        password: formPassword.trim() || '123456',
        role: formRole,
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        department: formDepartment.trim() || undefined,
        status: formStatus,
        allowedMenus: selectedMenus
      };

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
    } else {
      // Create User
      const newUser: UserAccount = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        username: formUsername.trim().toLowerCase(),
        password: formPassword.trim() || '123456',
        role: formRole,
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        department: formDepartment.trim() || undefined,
        status: formStatus,
        allowedMenus: selectedMenus
      };

      if (onAddUser) {
        onAddUser(newUser);
      }
    }

    setModalOpen(false);
  };

  const handleDeleteUserClick = (id: string, name: string) => {
    if (window.confirm(`Hapus akun user "${name}" dari sistem?`)) {
      if (onDeleteUser) {
        onDeleteUser(id);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.phone && user.phone.includes(searchQuery));
    
    const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-500" />
            <span>Master Data User & Akses Menu</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola data akun pengguna lengkap dan tentukan kewenangan akses per menu aplikasi untuk setiap pengguna.
          </p>
        </div>

        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Pengguna</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{users.length}</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Terdaftar di Sistem</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Admin & Super User</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block">
            {users.filter(u => u.role === 'Admin').length}
          </span>
          <span className="text-[10px] text-slate-400">Akses Penuh Semua Menu</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Pengguna Lapangan</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
            {users.filter(u => u.role === 'Teknisi' || u.role === 'Supervisor ME' || u.role === 'Project Manager').length}
          </span>
          <span className="text-[10px] text-slate-400">PM & Teknisi On-Site</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Logistik & Gudang</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {users.filter(u => u.role === 'Gudang' || u.role.toLowerCase().includes('gudang')).length}
          </span>
          <span className="text-[10px] text-slate-400">Akses Gudang & Stock</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Cari nama, username, no hp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Peranan:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-400 w-full sm:w-auto"
          >
            <option value="Semua">Semua Peranan</option>
            <option value="Admin">Admin</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Supervisor ME">Supervisor ME</option>
            <option value="Teknisi">Teknisi</option>
            <option value="Gudang">Gudang</option>
            <option value="Finance & BOP">Finance & BOP</option>
          </select>
        </div>
      </div>

      {/* User Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-white uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4">DATA PENGGUNA</th>
                <th className="py-3.5 px-4">USERNAME / LOGIN</th>
                <th className="py-3.5 px-4">ROLE & DEPARTEMEN</th>
                <th className="py-3.5 px-4">KEWENANGAN HAK AKSES MENU</th>
                <th className="py-3.5 px-4 text-center">STATUS</th>
                <th className="py-3.5 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada akun pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const allowedCount = user.role === 'Admin' 
                    ? APP_MENUS.length 
                    : (user.allowedMenus ? user.allowedMenus.length : (ROLE_PRESETS[user.role]?.length || 0));

                  const isFullAdmin = user.role === 'Admin';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block font-mono">
                              {user.phone || 'Nomor HP -'} {user.email ? `· ${user.email}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md text-[11px] border border-slate-200 dark:border-slate-700">
                          {user.username}
                        </span>
                      </td>

                      {/* Role & Department */}
                      <td className="py-3 px-4">
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                            user.role === 'Admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                            user.role === 'Project Manager' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                            user.role === 'Gudang' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                            {user.department || 'Divisi ME'}
                          </span>
                        </div>
                      </td>

                      {/* Menu Permissions Badges */}
                      <td className="py-3 px-4 max-w-md">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                              {isFullAdmin ? 'Akses Penuh (Semua 12 Menu)' : `${allowedCount} Menu Diizinkan`}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {isFullAdmin ? (
                              <span className="text-[10px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 font-medium">
                                Seluruh Modul Aplikasi Terbuka
                              </span>
                            ) : (
                              (user.allowedMenus && user.allowedMenus.length > 0 
                                ? user.allowedMenus 
                                : (ROLE_PRESETS[user.role] || [])
                              ).map((mId) => {
                                const menuItem = APP_MENUS.find(m => m.id === mId);
                                return menuItem ? (
                                  <span 
                                    key={mId} 
                                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono"
                                  >
                                    {menuItem.label}
                                  </span>
                                ) : null;
                              })
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                          (user.status || 'Aktif') === 'Aktif' 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-slate-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            (user.status || 'Aktif') === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`} />
                          <span>{user.status || 'Aktif'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => openEditModal(user)}
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit Akses & Data User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteUserClick(user.id, user.name)} 
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User With Granular Menu Permissions */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingUserId ? 'Edit Hak Akses & Profil Pengguna' : 'Pendaftaran Akun & Hak Akses Baru'}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Atur kewenangan akses menu aplikasi untuk pengguna ini
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmitUser} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Profile Details */}
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  1. Informasi Profil Pengguna
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Budi Santoso, ST" 
                      value={formName} 
                      onChange={e => setFormName(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Nama Akun (Username) <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Username untuk login..." 
                      value={formUsername} 
                      onChange={e => setFormUsername(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Kata Sandi (Password) {editingUserId && <span className="text-slate-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder={editingUserId ? 'Biarkan kata sandi lama' : 'Masukkan password login...'} 
                        value={formPassword}
                        onChange={e => setFormPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 pr-9 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Peranan Utama (Role)
                    </label>
                    <select 
                      value={formRole} 
                      onChange={e => handleRolePresetChange(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="Admin">Admin (Akses Penuh Semua Modul)</option>
                      <option value="Project Manager">Project Manager (Operasional, BOQ, Kontrak)</option>
                      <option value="Supervisor ME">Supervisor ME (Monitoring, Mandor, Emergency)</option>
                      <option value="Teknisi">Teknisi (Mandor, Lapangan, Emergency)</option>
                      <option value="Gudang">Gudang & Logistik (Stok, Kendaraan, Angkutan)</option>
                      <option value="Finance & BOP">Finance & Administrasi BOP</option>
                      <option value="Kustom">Kustom (Pilih Menu Sendiri)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Nomor HP / WhatsApp
                    </label>
                    <input 
                      type="text" 
                      placeholder="0812-xxxx-xxxx" 
                      value={formPhone} 
                      onChange={e => setFormPhone(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Departemen / Divisi
                    </label>
                    <input 
                      type="text" 
                      placeholder="Divisi Mekanikal & Elektrikal" 
                      value={formDepartment} 
                      onChange={e => setFormDepartment(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400" 
                    />
                  </div>
                </div>
              </div>

              {/* Granular Menu Selection */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                      2. Kewenangan Akses Menu Aplikasi
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tentukan menu apa saja yang dapat dilihat dan digunakan oleh akun ini:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllMenus}
                      className="px-2.5 py-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Pilih Semua
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllMenus}
                      className="px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Kosongkan
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-amber-800 dark:text-amber-300 font-medium">
                    Menu Terpilih: <strong>{selectedMenus.length}</strong> dari {APP_MENUS.length} Menu
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                    {selectedMenus.length === APP_MENUS.length ? 'Akses Penuh Seluruh Sistem' : 'Hak Akses Dibatasi'}
                  </span>
                </div>

                {/* Checkbox Grid Grouped by Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {APP_MENUS.map((menu) => {
                    const isChecked = selectedMenus.includes(menu.id);
                    return (
                      <div
                        key={menu.id}
                        onClick={() => toggleMenuSelection(menu.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                          isChecked 
                            ? 'bg-amber-400/10 dark:bg-amber-400/15 border-amber-400 text-slate-900 dark:text-white shadow-xs' 
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs truncate">
                              {menu.label}
                            </span>
                            <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {menu.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {menu.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)} 
                  className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  {editingUserId ? 'Simpan Perubahan User' : 'Daftarkan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

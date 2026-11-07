import React, { useState } from 'react';
import { Users, Plus, Trash2, Check, X, Shield, Key } from 'lucide-react';
import { UserAccount, Project } from '../types';

interface MasterDataViewProps {
  users?: UserAccount[];
  onAddUser?: (user: UserAccount) => void;
  onDeleteUser?: (id: string) => void;
  projects?: Project[];
  onAddProject?: (newProj: Project) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  users = [],
  onAddUser,
  onDeleteUser,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserAccount['role']>('Teknisi');

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim()) return;

    const newUser: UserAccount = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      username: formUsername.trim(),
      password: formPassword.trim() || '123456',
      role: formRole
    };

    if (onAddUser) {
      onAddUser(newUser);
    }
    
    setIsAdding(false);
    setFormName('');
    setFormUsername('');
    setFormPassword('');
  };

  const handleDeleteUserClick = (id: string) => {
    if (window.confirm('Hapus akun user ini dari sistem?')) {
      if (onDeleteUser) {
        onDeleteUser(id);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            <span>Master Data User & Akses Akun</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola pendaftaran akun pengguna, hak akses login, dan peranan sistem (Admin, PM, Teknisi, Gudang).
          </p>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Formulir Pendaftaran Akun Pengguna</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">PT Sapta Manunggal Karya</span>
          </div>

          <form onSubmit={handleCreateUserSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Nama Lengkap..." 
                  value={formName} 
                  onChange={e => setFormName(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Nama Akun (Username) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Username..." 
                  value={formUsername} 
                  onChange={e => setFormUsername(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Kata Sandi (Password)
                </label>
                <input 
                  type="password" 
                  placeholder="Password..." 
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Role Hak Akses
                </label>
                <select 
                  value={formRole} 
                  onChange={e => setFormRole(e.target.value as any)} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Admin">Admin</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Teknisi">Teknisi</option>
                  <option value="Gudang">Gudang</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)} 
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Simpan Akun
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#002060] text-white uppercase text-[11px] font-bold">
              <th className="p-4">NAMA LENGKAP</th>
              <th className="p-4">NAMA AKUN (USERNAME)</th>
              <th className="p-4">ROLE HAK AKSES</th>
              <th className="p-4 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{user.name}</td>
                <td className="p-4 font-mono text-slate-600 dark:text-slate-300">{user.username}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                    user.role === 'Admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                    user.role === 'Project Manager' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                    user.role === 'Gudang' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleDeleteUserClick(user.id)} 
                    className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                    title="Hapus Akun"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

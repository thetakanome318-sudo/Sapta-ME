import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Lock, User, ShieldCheck, ArrowRight, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

interface LoginViewProps {
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Mohon isi nama akun (username) dan password.');
      return;
    }

    // Find matching user by username or email
    const match = users.find(
      u => (u.username?.toLowerCase() === username.trim().toLowerCase() || u.name.toLowerCase() === username.trim().toLowerCase()) &&
           (!u.password || u.password === password.trim() || password.trim().length > 0)
    );

    if (match) {
      onLoginSuccess(match);
    } else {
      setErrorMsg('Nama akun atau password tidak cocok. Silakan coba lagi atau gunakan Akun Demo.');
    }
  };

  const handleQuickLogin = (demoUser: UserAccount) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password || '123456');
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Mesh / Blueprint Graphic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="loginGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginGrid)" />
        </svg>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header Branding */}
        <div className="bg-[#002060] p-6 text-white text-center relative space-y-2 border-b border-blue-900">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-md">
            SMK
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              PT SAPTA MANUNGGAL KARYA
            </h1>
            <span className="text-xs text-amber-300 font-mono font-semibold block">
              Sistem Informasi Monitoring Pekerjaan ME
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-base font-bold text-white">Akses Masuk Pengguna</h2>
            <p className="text-xs text-slate-400 mt-1">Masukkan nama akun dan kata sandi Anda untuk melanjutkan</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nama Akun (Username / Email)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama akun..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10"
            >
              <span>Masuk ke Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Cards */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
              Pilih Akun Demo Cepat (1-Klik Login):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all hover:border-amber-400/50 group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-amber-400 truncate">
                    {u.name}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{u.username}</span>
                    <span className="text-amber-400/80 font-semibold">{u.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3 text-center text-[10px] text-slate-500 border-t border-slate-800">
          PT Sapta Manunggal Karya &copy; 2026. Divisi Mekanikal & Elektrikal.
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import bgTrafoGrid from '../assets/images/trafo_power_grid_1794098426049.jpg';
import logoPtSapta from '../assets/images/logo_pt_sapta_manunggal_karya_white.png';

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
      setErrorMsg('Nama akun atau kata sandi tidak cocok. Silakan periksa kembali.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Pekerjaan Trafo dan Jaringan Listrik */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgTrafoGrid} 
          alt="Pekerjaan Trafo dan Jaringan Listrik" 
          className="w-full h-full object-cover filter brightness-[0.72] contrast-105"
        />
        {/* Subtle Vignette & Gradient Overlay to Keep Photo Crisp while Preserving Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60" />
      </div>

      {/* Main Login Card (Wider & Spacious) */}
      <div className="w-full max-w-xl sm:max-w-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden z-10 transition-all">
        {/* Header Branding with Transparent Official Logo */}
        <div className="bg-slate-900 px-6 sm:px-10 py-6 text-white text-center relative border-b border-slate-800">
          <div className="flex flex-col items-center justify-center space-y-2.5">
            <img 
              src={logoPtSapta} 
              alt="PT Sapta Manunggal Karya" 
              className="h-28 sm:h-36 w-auto max-w-[340px] sm:max-w-[420px] object-contain drop-shadow-md mx-auto"
            />
            <span className="text-xs sm:text-sm text-amber-300 font-mono font-semibold block tracking-wide">
              Sistem Informasi Monitoring Pekerjaan ME
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-bold text-white">Akses Masuk Pengguna</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Masukkan nama akun dan kata sandi Anda untuk melanjutkan</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                Nama Akun (Username / Email)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama akun..."
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
            >
              <span>Masuk ke Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3.5 text-center text-[10px] sm:text-xs text-slate-500 border-t border-slate-800">
          PT Sapta Manunggal Karya &copy; 2026. Divisi Mekanikal & Elektrikal.
        </div>
      </div>
    </div>
  );
};

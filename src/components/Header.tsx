import React from 'react';
import { Menu, LogOut, UserCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  activeTab: string;
  totalWorkersOnSite: number;
  setSidebarOpen: (open: boolean) => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  totalWorkersOnSite,
  setSidebarOpen,
  currentUser,
  onLogout,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Ringkasan Proyek & Peta Lapangan';
      case 'attendance': return 'Pekerja & Absensi';
      case 'spbj': return 'Daftar SPBJ';
      case 'boq': return 'Bill of Quantities (BOQ) & RAB Pekerjaan';
      case 'mandor': return 'Mandor & Lokasi Pekerjaan';
      case 'monitoring-pekerjaan': return 'Monitoring Progres & Pekerjaan';
      case 'monitoring-realisasi': return 'Realisasi Pekerjaan & Progres Fisik';
      case 'monitoring-tagging': return 'Tagging Lokasi Proyek & Aset';
      case 'monitoring-timeline': return 'Timeline & Jadwal Pelaksanaan';
      case 'monitoring-alat': return 'Monitoring Alat Kerja & Kalibrasi';
      case 'monitoring-apd': return 'Monitoring APD & Keselamatan';
      case 'monitoring-mdu': return 'Monitoring Material MDU';
      case 'monitoring-nonmdu': return 'Monitoring Material NON MDU';
      case 'monitoring-bongkar': return 'Monitoring Material Bongkar & Eksisting';
      case 'logistics-labor': return 'Biaya Angkutan & Buruh Lapangan';
      case 'warehouse': return 'Manajemen Gudang & Stok Pusat';
      case 'warehouse-ambon': return 'Manajemen Gudang Ambon';
      case 'warehouse-tual': return 'Manajemen Gudang Tual';
      case 'master-data': return 'Master Data User & Akses';
      case 'tasks': return 'Penugasan & Analisis JSA K3';
      case 'equipment': return 'Alat Pengujian & Kalibrasi';
      default: return 'Monitoring Proyek ME';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <span className="text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              PT Sapta Manunggal Karya · Divisi ME
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {getTabTitle(activeTab)}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 pl-3 pr-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                  {currentUser.role}
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Menu, ShieldCheck, Zap, HardHat } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  totalWorkersOnSite: number;
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  totalWorkersOnSite,
  setSidebarOpen,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Ringkasan Proyek & Peta Lapangan';
      case 'attendance': return 'Pekerja & Absensi';
      case 'spbj': return 'Kontrak SPBJ & UP3 PLN';
      case 'mandor': return 'Mandor & Lokasi Pekerjaan';
      case 'monitoring-pekerjaan': return 'Monitoring Progres & Pekerjaan';
      case 'monitoring-realisasi': return 'Realisasi Pekerjaan & Progres Fisik';
      case 'monitoring-tagging': return 'Tagging Lokasi Proyek & Aset';
      case 'monitoring-timeline': return 'Timeline & Jadwal Pelaksanaan';
      case 'monitoring-alat': return 'Monitoring Alat Kerja & Kalibrasi';
      case 'monitoring-apd': return 'Monitoring APD & Keselamatan';
      case 'monitoring-mdu': return 'Monitoring Material MDU';
      case 'monitoring-nonmdu': return 'Monitoring Material NON MDU';
      case 'logistics-labor': return 'Biaya Angkutan & Buruh Lapangan';
      case 'warehouse': return 'Manajemen Gudang & Stok Pusat';
      case 'warehouse-ambon': return 'Manajemen Gudang Ambon';
      case 'warehouse-tual': return 'Manajemen Gudang Tual';
      case 'master-data': return 'Master Data & Referensi';
      case 'tasks': return 'Penugasan & Analisis JSA K3';
      case 'equipment': return 'Alat Pengujian & Kalibrasi';
      case 'ai-assistant': return 'Asisten AI & Laporan Proyek';
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
          <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Standard PUIL 2020</span>
          </div>
        </div>
      </div>
    </header>
  );
};

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
      case 'spbj': return 'Daftar & Rangkuman 360° SPBJ';
      case 'spbj-list': return 'Daftar SPBJ Kontrak';
      case 'spbj-summary': return 'Rangkuman 360° per SPBJ';
      case 'boq': return 'Bill of Quantities (BOQ) & RAB Pekerjaan';
      case 'presentation': return 'Mode Presentasi & Slide Eksekutif';
      case 'whatsapp-report': return 'Pelaporan Pekerjaan via WhatsApp';
      case 'mandor': return 'Mandor Pekerjaan & Monitoring Lokasi';
      case 'monitoring-pekerjaan': return 'Monitoring Progres & Pekerjaan';
      case 'emergency-work': return 'Pekerjaan Emergency & Fast Response ME';
      case 'rehap-work': return 'Pekerjaan Rehap & Pemeliharaan Jaringan';
      case 'pohon-tumbang': return 'Penanganan Gangguan Pohon Tumbang & ROW';
      case 'other-work': return 'Pekerjaan Khusus & Insiden Lain';
      case 'monitoring-manpower': return 'Daftar Man Power & Identitas KTP';
      case 'monitoring-realisasi': return 'Realisasi Pekerjaan & Progres Fisik';
      case 'monitoring-tagging': return 'Tagging Lokasi Proyek & Aset';
      case 'monitoring-timeline': return 'Timeline & Jadwal Pelaksanaan';
      case 'monitoring-alat': return 'Monitoring Alat Kerja & Kalibrasi';
      case 'monitoring-apd': return 'Monitoring APD & Keselamatan';
      case 'monitoring-mdu': return 'Monitoring Material MDU';
      case 'monitoring-nonmdu': return 'Monitoring Material NON MDU';
      case 'monitoring-bongkar': return 'Monitoring Material Bongkar & Eksisting';
      case 'vehicle-company': return 'Kendaraan Operasional Perusahaan';
      case 'vehicle-lease': return 'Kontrak Sewa Kendaraan Operasional';
      case 'bop-angkutan': return 'Biaya Angkutan & Ekspedisi Lapangan';
      case 'bop-buruh': return 'Upah Buruh & Tenaga Kerja Lapangan';
      case 'wage-advance': return 'Panjar Mandor (Wage Advance)';
      case 'bop-operasional': return 'Biaya Operasional Proyek (BOP Lapangan)';
      case 'bop-sewa-mobil': return 'Sewa Mobil & Kendaraan Operasional';
      case 'logistics-labor': return 'Biaya Angkutan & Buruh Lapangan';
      case 'bop': return 'Biaya Operasional Proyek (BOP Lapangan)';
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
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {getTabTitle(activeTab)}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-500/10 dark:bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-500/20 dark:border-amber-400/20">
            PT Sapta Manunggal Karya · Divisi ME
          </span>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Truck, Users, Wallet, Receipt, DollarSign, Car } from 'lucide-react';

interface BopSubmenuBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BopSubmenuBar: React.FC<BopSubmenuBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { 
      id: 'bop-angkutan', 
      label: 'Angkutan', 
      shortTitle: 'Biaya Angkutan',
      desc: 'Mobilisasi Trafo, Tiang & Sewa Crane', 
      icon: Truck 
    },
    { 
      id: 'bop-buruh', 
      label: 'Buruh', 
      shortTitle: 'Upah Buruh',
      desc: 'Upah Gali Tiang, Lembur & Buruh Harian', 
      icon: Users 
    },
    { 
      id: 'wage-advance', 
      label: 'Panjar Mandor', 
      shortTitle: 'Panjar Mandor',
      desc: 'Uang Muka / Panjar Upah Mandor per SPBJ', 
      icon: Wallet 
    },
    { 
      id: 'bop-operasional', 
      label: 'Operasional', 
      shortTitle: 'Biaya Operasional',
      desc: 'Kas Kecil BOP, BBM, Mess & Logistik', 
      icon: Receipt 
    },
    { 
      id: 'bop-sewa-mobil', 
      label: 'Sewa Mobil', 
      shortTitle: 'Sewa Mobil',
      desc: 'Kontrak Sewa Hilux 4x4, Crane & Armada', 
      icon: Car 
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 pb-2.5 mb-2.5 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              Menu Utama: BOP (Biaya Operasional Proyek)
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Pilihan kategori biaya operasional & keuangan lapangan:
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700/60 shrink-0">
          5 Kategori Tersedia
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = 
            activeTab === t.id || 
            (t.id === 'bop-operasional' && activeTab === 'bop') ||
            (t.id === 'bop-sewa-mobil' && activeTab === 'vehicle-lease');

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20 ring-2 ring-amber-400 scale-[1.01]'
                  : 'bg-slate-950/70 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-amber-400 border border-slate-700/60'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold truncate">{t.label}</span>
                </div>
                <div className={`text-[10px] font-medium truncate mt-0.5 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                  {t.shortTitle}
                </div>
                <div className={`text-[9px] truncate mt-0.5 ${isActive ? 'text-slate-950/80 font-bold' : 'text-slate-500'}`}>
                  {t.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

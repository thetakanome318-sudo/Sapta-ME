import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileSpreadsheet,
  HardHat, 
  CheckSquare, 
  Wrench, 
  Sparkles, 
  Sun, 
  Moon, 
  UserCheck, 
  ShieldCheck, 
  Zap,
  Menu,
  X,
  Database,
  Activity,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Package,
  Box,
  Coins,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  totalWorkersOnSite: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  totalWorkersOnSite,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'monitoring-pekerjaan': true // Default open
  });

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan Proyek', icon: LayoutDashboard },
    { id: 'spbj', label: 'Kontrak SPBJ & UP3', icon: FileText },
    { id: 'boq', label: 'Bill of Quantities (BOQ)', icon: FileSpreadsheet },
    { id: 'mandor', label: 'Mandor & Lokasi', icon: HardHat },
    { 
      id: 'monitoring-pekerjaan', 
      label: 'Monitoring Pekerjaan', 
      icon: Activity,
      subItems: [
        { id: 'monitoring-realisasi', label: 'Realisasi Pekerjaan', icon: TrendingUp },
        { id: 'monitoring-tagging', label: 'Tagging Lokasi', icon: MapPin },
        { id: 'monitoring-timeline', label: 'Timeline Pekerjaan', icon: Calendar },
        { id: 'monitoring-alat', label: 'Alat Kerja', icon: Wrench },
        { id: 'monitoring-apd', label: 'Monitoring APD', icon: ShieldCheck },
        { id: 'monitoring-mdu', label: 'Material MDU', icon: Package },
        { id: 'monitoring-nonmdu', label: 'Material NON MDU', icon: Box }
      ]
    },
    { id: 'master-data', label: 'Master Data', icon: Database },
    { id: 'logistics-labor', label: 'Biaya Angkutan & Buruh', icon: Coins },
    { 
      id: 'warehouse', 
      label: 'Gudang / Stock', 
      icon: Building2,
      subItems: [
        { id: 'warehouse-ambon', label: 'Gudang Ambon', icon: MapPin },
        { id: 'warehouse-tual', label: 'Gudang Tual', icon: MapPin }
      ]
    },
    { id: 'ai-assistant', label: 'Asisten AI & Report', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base shadow-md shadow-amber-500/20">
              SMK
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                PT Sapta Manunggal Karya
              </h1>
              <span className="text-[11px] text-amber-400 font-mono font-semibold block">
                Divisi Mekanikal Elektrikal
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* K3 Status & Field Ticker */}
        <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-semibold">1.420 Hari Bebas Kecelakaan</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Teknisi di Lapangan:</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              {totalWorkersOnSite} Org
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isParentActive = activeTab === item.id || (hasSubItems && item.subItems?.some(sub => activeTab === sub.id));
            const isExpanded = expandedMenus[item.id];

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.id);
                    } else {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isParentActive
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 shrink-0 ${isParentActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {hasSubItems && (
                    isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {hasSubItems && isExpanded && (
                  <div className="pl-9 space-y-1">
                    {item.subItems?.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab(sub.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                            isSubActive
                              ? 'text-amber-400 bg-slate-800'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                          }`}
                        >
                          <SubIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions (Theme Toggle) */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">Mode Tampilan</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
              title="Toggle Dark Mode"
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-300" />
                  <span>Gelap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

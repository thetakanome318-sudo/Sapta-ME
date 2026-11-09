import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  FileSpreadsheet,
  HardHat, 
  Presentation,
  MessageSquare,
  CheckSquare, 
  Wrench, 
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
  Building2,
  Truck,
  Car,
  LogOut,
  Siren,
  Receipt,
  Wallet,
  Plus,
  Layers
} from 'lucide-react';
import { UserAccount } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  totalWorkersOnSite: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  totalWorkersOnSite,
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  onLogout,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const navItems = [
    { id: 'spbj-list', label: 'Daftar SPBJ Kontrak', icon: FileText },
    { id: 'boq', label: 'Bill of Quantities (BOQ)', icon: FileSpreadsheet },
    { id: 'mandor', label: 'Database Mandor', icon: Users },
    { 
      id: 'bop', 
      label: 'BOP (Biaya Operasional)', 
      icon: Receipt,
      subItems: [
        { id: 'bop-angkutan', label: 'Angkutan', icon: Truck },
        { id: 'bop-buruh', label: 'Buruh', icon: Users },
        { id: 'wage-advance', label: 'Panjar Mandor', icon: Wallet },
        { id: 'bop-operasional', label: 'Operasional', icon: Coins },
        { id: 'bop-sewa-mobil', label: 'Sewa Mobil', icon: Car }
      ]
    },
    { 
      id: 'monitoring-pekerjaan', 
      label: 'Monitoring Pekerjaan', 
      icon: Activity,
      subItems: [
        { id: 'monitoring-manpower', label: 'Daftar Man Power', icon: Users },
        { id: 'monitoring-realisasi', label: 'Realisasi Pekerjaan', icon: TrendingUp },
        { id: 'monitoring-tagging', label: 'Tagging Lokasi', icon: MapPin },
        { id: 'monitoring-timeline', label: 'Timeline Pekerjaan', icon: Calendar },
        { id: 'monitoring-alat', label: 'Alat Kerja', icon: Wrench },
        { id: 'monitoring-apd', label: 'Monitoring APD', icon: ShieldCheck },
        { id: 'monitoring-mdu', label: 'Material MDU', icon: Package },
        { id: 'monitoring-nonmdu', label: 'Material NON MDU', icon: Box },
        { id: 'monitoring-bongkar', label: 'Material Bongkar', icon: Package }
      ]
    },
    { 
      id: 'emergency-management', 
      label: 'Emergency & Gangguan', 
      icon: Siren,
      subItems: [
        { id: 'emergency-work', label: 'Pekerjaan Emergency', icon: Siren },
        { id: 'rehap-work', label: 'Pekerjaan Rehap', icon: Wrench },
        { id: 'pohon-tumbang', label: 'Pohon Tumbang', icon: Zap },
        { id: 'other-work', label: 'Pekerjaan Lain', icon: Plus }
      ]
    },
    { 
      id: 'warehouse', 
      label: 'Gudang / Stock', 
      icon: Building2,
      subItems: [
        { id: 'warehouse-ambon', label: 'Gudang Ambon', icon: MapPin },
        { id: 'warehouse-tual', label: 'Gudang Tual', icon: MapPin }
      ]
    },
    { id: 'presentation', label: 'Presentasi Deck', icon: Presentation },
    { id: 'whatsapp-report', label: 'Pelaporan WhatsApp', icon: MessageSquare },
    { id: 'master-data', label: 'Master Data', icon: Database },
  ];

  // Robust permission check helper supporting backward compatibility
  const isMenuAllowed = (id: string): boolean => {
    if (!currentUser || currentUser.role === 'Admin') return true;
    const allowed = currentUser.allowedMenus;
    if (!allowed || allowed.length === 0) return true;

    // Direct match
    if (allowed.includes(id)) return true;

    // SPBJ family: any SPBJ permission allows spbj, spbj-list, spbj-summary
    const spbjFamily = ['spbj', 'spbj-list', 'spbj-summary'];
    if (spbjFamily.includes(id)) {
      if (allowed.some(a => spbjFamily.includes(a))) return true;
    }

    // BOP family: any BOP permission allows bop and its submenus
    const bopFamily = ['bop', 'bop-management', 'logistics-labor', 'bop-angkutan', 'bop-buruh', 'wage-advance', 'bop-operasional', 'bop-sewa-mobil', 'vehicle-lease'];
    if (bopFamily.includes(id)) {
      if (allowed.some(a => bopFamily.includes(a))) return true;
    }

    // Emergency family
    const emergencyFamily = ['emergency-management', 'emergency-work', 'rehap-work', 'pohon-tumbang', 'other-work'];
    if (emergencyFamily.includes(id)) {
      if (allowed.some(a => emergencyFamily.includes(a))) return true;
    }

    // Monitoring family
    if (id === 'monitoring-pekerjaan' || id.startsWith('monitoring-')) {
      if (allowed.includes('monitoring-pekerjaan') || allowed.includes(id)) return true;
    }

    // Vehicle family
    const vehicleFamily = ['monitoring-kendaraan', 'vehicle-company', 'vehicle-lease'];
    if (vehicleFamily.includes(id)) {
      if (allowed.some(a => vehicleFamily.includes(a))) return true;
    }

    // Warehouse family
    const warehouseFamily = ['warehouse', 'warehouse-ambon', 'warehouse-tual'];
    if (warehouseFamily.includes(id)) {
      if (allowed.some(a => warehouseFamily.includes(a))) return true;
    }

    return false;
  };

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
        {/* User Profile & Logout Header (Replaces Divisi ME) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {currentUser ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm shrink-0 shadow-md shadow-amber-400/20">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-400 truncate">
                  {currentUser.role}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm font-bold text-white">Akun Pengguna</div>
          )}

          <div className="flex items-center gap-1">
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Keluar / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links (Filtered by User Role & Allowed Menus) */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems
            .filter((item) => {
              if (!currentUser || currentUser.role === 'Admin') return true;
              if (isMenuAllowed(item.id)) return true;
              if (item.subItems && item.subItems.some(sub => isMenuAllowed(sub.id))) {
                return true;
              }
              return false;
            })
            .map((item) => {
              const IconComponent = item.icon;
              const allowedSubItems = item.subItems?.filter((sub) => isMenuAllowed(sub.id));
              const hasSubItems = allowedSubItems && allowedSubItems.length > 0;
              
              const isSpbjFamily = item.id === 'spbj' && ['spbj', 'spbj-list', 'spbj-summary'].includes(activeTab);
              const isBopFamily = item.id === 'bop' && ['bop', 'bop-management', 'bop-angkutan', 'bop-buruh', 'wage-advance', 'bop-operasional', 'bop-sewa-mobil', 'vehicle-lease', 'logistics-labor'].includes(activeTab);
              const isParentActive = activeTab === item.id || isSpbjFamily || isBopFamily || (hasSubItems && allowedSubItems?.some(sub => activeTab === sub.id));
              const isExpanded = expandedMenus[item.id] !== undefined ? expandedMenus[item.id] : isParentActive;

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        toggleMenu(item.id);
                        if (!isParentActive && allowedSubItems && allowedSubItems.length > 0) {
                          setActiveTab(allowedSubItems[0].id);
                        }
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
                      {allowedSubItems.map((sub) => {
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
                                ? 'text-amber-400 bg-slate-800 font-bold'
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

        {/* Bottom Actions (Online Sync Cloud & Theme Toggle) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online Sync Cloud</span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
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

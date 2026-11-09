import React, { useState } from 'react';
import { 
  SpbjContract, 
  BoqItem, 
  Mandor, 
  ManpowerRecord, 
  LogisticsLaborCost, 
  WageAdvance, 
  BopItem, 
  VehicleLease, 
  EmergencyWork, 
  MaterialBongkarItem,
  MaterialSummaryItem,
  Equipment,
  TaskAssignment,
  LocationTag,
  Worker
} from '../types';
import { 
  FileText, 
  FileSpreadsheet, 
  Users, 
  Truck, 
  Wallet, 
  Receipt, 
  Car, 
  Siren, 
  Package, 
  Box, 
  Calendar, 
  Building2, 
  DollarSign, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  ChevronRight, 
  Eye, 
  Phone, 
  MapPin, 
  HardHat, 
  CreditCard,
  TrendingUp,
  Activity
} from 'lucide-react';

interface SpbjSummaryViewProps {
  spbjList: SpbjContract[];
  initialSpbjId?: string;
  boqItems: BoqItem[];
  mandors: Mandor[];
  manpowerList: ManpowerRecord[];
  logisticsLaborCosts: LogisticsLaborCost[];
  bopItems: BopItem[];
  leaseVehicles: VehicleLease[];
  emergencyWorks: EmergencyWork[];
  materialBongkarItems: MaterialBongkarItem[];
  mduMaterials?: MaterialSummaryItem[];
  nonMduMaterials?: MaterialSummaryItem[];
  equipment?: Equipment[];
  tasks?: TaskAssignment[];
  locationTags?: LocationTag[];
  workers?: Worker[];
  setActiveTab?: (tab: string) => void;
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const SpbjSummaryView: React.FC<SpbjSummaryViewProps> = ({
  spbjList,
  initialSpbjId,
  boqItems,
  mandors,
  manpowerList,
  logisticsLaborCosts,
  bopItems,
  leaseVehicles,
  emergencyWorks,
  materialBongkarItems,
  mduMaterials = [],
  nonMduMaterials = [],
  equipment = [],
  tasks = [],
  locationTags = [],
  workers = [],
  setActiveTab,
}) => {
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>(
    initialSpbjId || (spbjList.length > 0 ? spbjList[0].id : '')
  );

  const [activeSummaryTab, setActiveSummaryTab] = useState<
    | 'overview'
    | 'boq'
    | 'realisasi'
    | 'mdu-nonmdu'
    | 'bongkar'
    | 'alat'
    | 'timeline'
    | 'tagging'
    | 'apd'
    | 'manpower'
    | 'costs'
    | 'vehicles'
    | 'emergency'
  >('overview');

  const selectedSpbj = spbjList.find((s) => s.id === selectedSpbjId) || spbjList[0];

  if (!selectedSpbj) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
        <h3 className="text-base font-bold text-white">Belum Ada Data SPBJ Kontrak</h3>
        <p className="text-xs mt-1">Silakan daftarkan SPBJ kontrak baru terlebih dahulu.</p>
      </div>
    );
  }

  // Filter datasets specifically linked to selected SPBJ
  const matchedBoq = boqItems.filter((b) => b.spbjId === selectedSpbj.id);
  const matchedMandors = mandors.filter(
    (m) => m.projectId === selectedSpbj.id || m.projectName?.includes(selectedSpbj.id) || m.projectName?.includes(selectedSpbj.up3Name)
  );
  const matchedManpower = manpowerList.filter(
    (mp) => mp.spbjId === selectedSpbj.id || (matchedMandors.some(m => m.id === mp.mandorId))
  );
  
  const matchedAngkutan = logisticsLaborCosts.filter(
    (c) => c.spbjId === selectedSpbj.id && c.type === 'Angkutan'
  );
  const matchedBuruh = logisticsLaborCosts.filter(
    (c) => c.spbjId === selectedSpbj.id && c.type === 'Buruh'
  );
  const matchedBop = bopItems.filter((b) => b.spbjId === selectedSpbj.id);
  const matchedVehicles = leaseVehicles.filter((v) => v.spbjId === selectedSpbj.id);
  const matchedEmergency = emergencyWorks.filter((e) => e.spbjId === selectedSpbj.id);
  const matchedBongkar = materialBongkarItems.filter((m) => m.spbjId === selectedSpbj.id);
  const matchedMdu = (mduMaterials || []).filter((m) => m.spbjId === selectedSpbj.id);
  const matchedNonMdu = (nonMduMaterials || []).filter((m) => m.spbjId === selectedSpbj.id);
  const matchedEquipment = (equipment || []).filter((e) => e.currentProjectId === selectedSpbj.id || e.currentProjectId === selectedSpbj.up3Name);
  const matchedTasks = (tasks || []).filter((t) => t.projectId === selectedSpbj.id || t.projectName?.includes(selectedSpbj.spbjNumber) || t.projectName?.includes(selectedSpbj.up3Name));
  const matchedLocationTags = (locationTags || []).filter((l) => l.spbjId === selectedSpbj.id);
  const matchedWorkers = (workers || []).filter((w) => w.projectId === selectedSpbj.id || w.projectName?.includes(selectedSpbj.up3Name));

  // Financial Calculations
  const totalBoqContractValue = matchedBoq.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalBoqRealizedValue = matchedBoq.reduce((sum, item) => sum + (item.realizedPrice || 0), 0);
  const totalAngkutanCost = matchedAngkutan.reduce((sum, item) => sum + item.amount, 0);
  const totalBuruhCost = matchedBuruh.reduce((sum, item) => sum + item.amount, 0);
  const totalBopCost = matchedBop.reduce((sum, item) => sum + item.amount, 0);
  const totalVehicleLeaseCost = matchedVehicles.reduce((sum, item) => sum + item.monthlyRate, 0);

  const totalAllOperationalCosts = totalAngkutanCost + totalBuruhCost + totalBopCost + totalVehicleLeaseCost;

  // Days remaining
  const calculateDaysLeft = (dateStr: string) => {
    const today = new Date();
    const end = new Date(dateStr);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(selectedSpbj.contractEndDate);

  // Print Full 360 PDF Report for 1 SPBJ
  const handleExportPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rangkuman 360° SPBJ - ${selectedSpbj.spbjNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #0f172a; line-height: 1.4; font-size: 11px; }
            .header-banner { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
            h1 { font-size: 18px; margin: 0 0 4px 0; color: #0f172a; }
            h3 { font-size: 13px; margin: 16px 0 8px 0; color: #0369a1; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .grid-stats { display: flex; gap: 12px; margin-bottom: 15px; }
            .stat-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; }
            .stat-val { font-size: 14px; font-weight: bold; color: #0369a1; }
            .text-right { text-align: right; }
            .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
            .aktif { background: #dcfce7; color: #15803d; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <h1>PT SAPTA MANUNGGAL KARYA - DIVISI ME</h1>
            <div style="font-size: 12px; font-weight: bold; color: #475569;">Laporan Konsolidasi Rangkuman 360° SPBJ</div>
            <div style="font-size: 10px; color: #64748b;">Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>

          <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; margin-bottom: 15px;">
            <div style="font-size: 14px; font-weight: bold;">NO SPBJ: ${selectedSpbj.spbjNumber}</div>
            <div><strong>Pekerjaan:</strong> ${selectedSpbj.projectName}</div>
            <div><strong>Unit / UP3:</strong> ${selectedSpbj.up3Name} | <strong>Nilai Kontrak:</strong> ${selectedSpbj.contractValue}</div>
            <div><strong>Masa Berlaku:</strong> ${selectedSpbj.startDate} s.d ${selectedSpbj.contractEndDate} (${daysLeft} Hari Tersisa)</div>
          </div>

          <div class="grid-stats">
            <div class="stat-card">
              <div style="font-size: 9px; color: #64748b;">TOTAL BOQ REALISASI</div>
              <div class="stat-val">${formatRupiah(totalBoqRealizedValue)}</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 9px; color: #64748b;">TOTAL BIAYA OPERASIONAL & LOGISTIK</div>
              <div class="stat-val">${formatRupiah(totalAllOperationalCosts)}</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 9px; color: #64748b;">MANPOWER ON-SITE</div>
              <div class="stat-val">${matchedManpower.length} Personil</div>
            </div>
          </div>

          <h3>1. Rincian Item BOQ (${matchedBoq.length} Item)</h3>
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Uraian Pekerjaan / Material</th>
                <th>Satuan</th>
                <th class="text-right">Vol Kontrak</th>
                <th class="text-right">Vol Realisasi</th>
                <th class="text-right">Harga Satuan</th>
                <th class="text-right">Total Realisasi</th>
              </tr>
            </thead>
            <tbody>
              ${matchedBoq.map(b => `
                <tr>
                  <td>${b.itemCode}</td>
                  <td>${b.materialOrWork}</td>
                  <td>${b.unit}</td>
                  <td class="text-right">${b.contractVolume}</td>
                  <td class="text-right">${b.realizedVolume}</td>
                  <td class="text-right">${formatRupiah(b.unitPrice)}</td>
                  <td class="text-right">${formatRupiah(b.realizedPrice || 0)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3>2. Mandor & Man Power Pekerja (${matchedManpower.length} Personil)</h3>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pekerja</th>
                <th>NIK KTP</th>
                <th>Keahlian / Posisi</th>
                <th>Mandor PJ</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${matchedManpower.map((mp, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong>${mp.name}</strong></td>
                  <td>${mp.ktpNumber || '-'}</td>
                  <td>${mp.role}</td>
                  <td>${mp.mandorName || '-'}</td>
                  <td><span class="badge aktif">${mp.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3>3. Biaya Operasional, Angkutan & Buruh (${matchedAngkutan.length + matchedBuruh.length + matchedBop.length} Voucher)</h3>
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Uraian Pengeluaran</th>
                <th>Tanggal</th>
                <th>Pengaju</th>
                <th class="text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              ${[...matchedAngkutan, ...matchedBuruh].map(c => `
                <tr>
                  <td>${c.type} - ${c.category}</td>
                  <td>${c.description}</td>
                  <td>${c.date}</td>
                  <td>${c.submittedBy}</td>
                  <td class="text-right">${formatRupiah(c.amount)}</td>
                </tr>
              `).join('')}
              ${matchedBop.map(b => `
                <tr>
                  <td>BOP Kas Kecil - ${b.category}</td>
                  <td>${b.description}</td>
                  <td>${b.date}</td>
                  <td>${b.submittedBy}</td>
                  <td class="text-right">${formatRupiah(b.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 30px; font-size: 10px; color: #64748b;">
            Dokumen Rangkuman 360° SPBJ PT Sapta Manunggal Karya.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header & SPBJ Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Layers className="w-64 h-64 text-amber-500" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Rangkuman 360° per SPBJ</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Konsolidasi Data SPBJ
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Tampilan rangkuman lengkap terintegrasi dari seluruh menu (BOQ, Mandor, Man Power, Angkutan, Buruh, Panjar, BOP, Kendaraan, Emergency & Material) dalam 1 SPBJ.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportPdf}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-400/20"
              >
                <Download className="w-4 h-4" />
                <span>Cetak Rangkuman 1 SPBJ (PDF)</span>
              </button>
            </div>
          </div>

          {/* SPBJ Selection Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <FileText className="w-5 h-5 text-amber-400 shrink-0" />
              <label className="text-xs font-bold text-slate-300 shrink-0">Pilih SPBJ:</label>
              <select
                value={selectedSpbjId}
                onChange={(e) => setSelectedSpbjId(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-2 focus:outline-hidden focus:border-amber-400 min-w-0"
              >
                {spbjList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                Nilai Kontrak: {selectedSpbj.contractValue}
              </span>
              <span className={`px-3 py-1.5 rounded-lg border ${
                daysLeft > 30 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                Sisa Masa Berlaku: {daysLeft} Hari
              </span>
            </div>
          </div>
        </div>

        {/* Executive Stat Grid for this SPBJ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-medium">Nilai Kontrak SPBJ</span>
            <div className="text-sm font-bold text-amber-400 mt-0.5 truncate">{selectedSpbj.contractValue}</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-medium">Realisasi BOQ</span>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 truncate">{formatRupiah(totalBoqRealizedValue)}</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-medium">Biaya Angkutan & Buruh</span>
            <div className="text-sm font-bold text-blue-400 mt-0.5 truncate">{formatRupiah(totalAngkutanCost + totalBuruhCost)}</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-medium">Pengeluaran BOP (Kas)</span>
            <div className="text-sm font-bold text-purple-400 mt-0.5 truncate">{formatRupiah(totalBopCost)}</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-medium">Manpower On-Site</span>
            <div className="text-sm font-bold text-white mt-0.5">{matchedManpower.length} Personil</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-medium">Armada / Sewa Mobil</span>
            <div className="text-sm font-bold text-amber-400 mt-0.5">{matchedVehicles.length} Unit Armada</div>
          </div>
        </div>
      </div>

      {/* Detail Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Ringkasan Utama', icon: Layers, count: null },
          { id: 'boq', label: 'BOQ Pekerjaan', icon: FileSpreadsheet, count: matchedBoq.length },
          { id: 'realisasi', label: 'Realisasi Pekerjaan', icon: TrendingUp, count: matchedBoq.filter(b => (b.realizedVolume || 0) > 0).length },
          { id: 'mdu-nonmdu', label: 'Material MDU & Non-MDU', icon: Box, count: matchedMdu.length + matchedNonMdu.length },
          { id: 'bongkar', label: 'Material Bongkar', icon: Package, count: matchedBongkar.length },
          { id: 'alat', label: 'Alat Kerja & Kalibrasi', icon: Activity, count: matchedEquipment.length },
          { id: 'timeline', label: 'Timeline Pekerjaan', icon: Calendar, count: matchedTasks.length },
          { id: 'tagging', label: 'Tagging Lokasi', icon: MapPin, count: matchedLocationTags.length },
          { id: 'apd', label: 'Monitoring APD', icon: HardHat, count: matchedWorkers.length },
          { id: 'manpower', label: 'Mandor & Manpower', icon: Users, count: matchedManpower.length },
          { id: 'costs', label: 'Angkutan, Buruh & BOP', icon: Receipt, count: matchedAngkutan.length + matchedBuruh.length + matchedBop.length },
          { id: 'vehicles', label: 'Sewa Mobil & Armada', icon: Car, count: matchedVehicles.length },
          { id: 'emergency', label: 'Emergency & Incident', icon: Siren, count: matchedEmergency.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSummaryTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSummaryTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeSummaryTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card: Detail Kontrak SPBJ */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Informasi Dokumen SPBJ Kontrak
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {selectedSpbj.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Nomor SPBJ Contract:</span>
                <p className="font-mono font-bold text-white text-xs mt-0.5">{selectedSpbj.spbjNumber}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Unit Listrik / UP3:</span>
                <p className="font-bold text-amber-400 text-xs mt-0.5">{selectedSpbj.up3Name}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Nama Proyek & Lokasi:</span>
                <p className="font-semibold text-slate-200 text-xs mt-0.5">{selectedSpbj.projectName}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Vendor Pelaksana:</span>
                <p className="font-bold text-white text-xs mt-0.5">{selectedSpbj.vendorCompany || 'PT Sapta Manunggal Karya'}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Masa Berlaku Kontrak:</span>
                <p className="font-mono text-slate-300 text-xs mt-0.5">{selectedSpbj.startDate} s.d {selectedSpbj.contractEndDate}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Nilai Total SPBJ:</span>
                <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{selectedSpbj.contractValue}</p>
              </div>
            </div>

            {selectedSpbj.scopeOfWork && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Scope Pekerjaan SPBJ</span>
                <p className="text-slate-300 text-xs">{selectedSpbj.scopeOfWork}</p>
              </div>
            )}
          </div>

          {/* Card: Total Rincian Biaya Operational */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Rekap Keuangan Lapangan
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Total Nilai BOQ (RAB):</span>
                <span className="font-mono font-bold text-slate-200">{formatRupiah(totalBoqContractValue)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Realisasi BOQ Fisik:</span>
                <span className="font-mono font-bold text-emerald-400">{formatRupiah(totalBoqRealizedValue)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Biaya Angkutan & Logistik:</span>
                <span className="font-mono text-blue-400 font-semibold">{formatRupiah(totalAngkutanCost)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Upah Buruh Lapangan:</span>
                <span className="font-mono text-amber-400 font-semibold">{formatRupiah(totalBuruhCost)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">BOP Kas Kecil Proyek:</span>
                <span className="font-mono text-purple-400 font-semibold">{formatRupiah(totalBopCost)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Sewa Armada Mobil:</span>
                <span className="font-mono text-slate-300">{formatRupiah(totalVehicleLeaseCost)}</span>
              </div>
              <div className="pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 font-bold text-xs">Total Pengeluaran Site:</span>
                  <span className="font-mono font-extrabold text-amber-400 text-sm">{formatRupiah(totalAllOperationalCosts)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. BOQ PEKERJAAN */}
      {(activeSummaryTab === 'overview' || activeSummaryTab === 'boq') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Bill of Quantities (BOQ) & RAB Proyek SPBJ ini ({matchedBoq.length} Item)
            </h3>
            {setActiveTab && (
              <button
                onClick={() => setActiveTab('boq')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Buka Menu BOQ Lengkap <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {matchedBoq.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada item BOQ terdaftar untuk SPBJ ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Material / Uraian Pekerjaan</th>
                    <th className="py-2.5 px-3">Satuan</th>
                    <th className="py-2.5 px-3 text-right">Vol Kontrak</th>
                    <th className="py-2.5 px-3 text-right">Vol Realisasi</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-right">Total Realisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchedBoq.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">{b.itemCode}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{b.materialOrWork}</td>
                      <td className="py-2.5 px-3 text-slate-400">{b.unit}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{b.contractVolume}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-bold">{b.realizedVolume}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(b.unitPrice)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-bold">{formatRupiah(b.realizedPrice || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 3. MANDOR & MANPOWER */}
      {(activeSummaryTab === 'overview' || activeSummaryTab === 'manpower') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Personil Mandor & Man Power Terdaftar di SPBJ ini ({matchedManpower.length} Personil)
            </h3>
            {setActiveTab && (
              <button
                onClick={() => setActiveTab('monitoring-manpower')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Buka Kelola Man Power <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {matchedManpower.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada personil man power yang dialokasikan ke SPBJ ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Nama Pekerja</th>
                    <th className="py-2.5 px-3">NIK KTP</th>
                    <th className="py-2.5 px-3 text-center">Foto KTP</th>
                    <th className="py-2.5 px-3">Posisi / Keahlian</th>
                    <th className="py-2.5 px-3">Mandor PJ</th>
                    <th className="py-2.5 px-3">No. HP</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchedManpower.map((mp) => (
                    <tr key={mp.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-white">{mp.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">{mp.ktpNumber || '-'}</td>
                      <td className="py-2.5 px-3 text-center">
                        {mp.ktpPhotoUrl ? (
                          <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                            ✓ Foto Terlampir
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-rose-400 px-2 py-0.5 bg-rose-500/10 rounded border border-rose-500/20">
                            Belum Ada
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-amber-400 font-semibold">{mp.role}</td>
                      <td className="py-2.5 px-3 text-slate-300">{mp.mandorName || '-'}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{mp.phone || '-'}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {mp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 4. BIAYA ANGKUTAN, BURUH & BOP */}
      {(activeSummaryTab === 'overview' || activeSummaryTab === 'costs') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Angkutan & Buruh */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                Biaya Angkutan & Upah Buruh Lapangan ({matchedAngkutan.length + matchedBuruh.length} Voucher)
              </h3>
            </div>

            {matchedAngkutan.length === 0 && matchedBuruh.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada pengeluaran angkutan / buruh tercatat.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {[...matchedAngkutan, ...matchedBuruh].map((c) => (
                  <div key={c.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.type === 'Angkutan' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {c.type}
                        </span>
                        <span className="font-bold text-white text-xs">{c.category}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{c.description}</p>
                      <div className="text-[10px] text-slate-500 mt-0.5">Tgl: {c.date} | Oleh: {c.submittedBy}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-emerald-400 text-xs">{formatRupiah(c.amount)}</div>
                      <span className="text-[10px] font-semibold text-slate-400">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOP Vouchers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-purple-400" />
                Voucher BOP (Kas Kecil Lapangan) ({matchedBop.length} Voucher)
              </h3>
            </div>

            {matchedBop.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada klaim BOP tercatat untuk SPBJ ini.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {matchedBop.map((b) => (
                  <div key={b.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-xs">{b.category}</div>
                      <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">{b.description}</p>
                      <div className="text-[10px] text-slate-500 mt-0.5">Voucher: {b.voucherNumber} | Tgl: {b.date}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-purple-400 text-xs">{formatRupiah(b.amount)}</div>
                      <span className="text-[10px] font-bold text-emerald-400">{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. SEWA MOBIL & EMERGENCY */}
      {(activeSummaryTab === 'overview' || activeSummaryTab === 'vehicles' || activeSummaryTab === 'emergency') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sewa Mobil */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                Armada & Sewa Mobil SPBJ ({matchedVehicles.length} Unit)
              </h3>
            </div>

            {matchedVehicles.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada armada sewa mobil terdaftar di SPBJ ini.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {matchedVehicles.map((v) => (
                  <div key={v.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-xs">{v.vehicleType}</div>
                      <div className="text-[11px] text-amber-400 font-mono font-bold mt-0.5">Plat: {v.plateNumber} | Vendor: {v.vendorName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">No Kontrak: {v.contractNumber}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-emerald-400 text-xs">{formatRupiah(v.monthlyRate)}/bln</div>
                      <span className="text-[10px] font-bold text-emerald-400">{v.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency & Repair */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Siren className="w-4 h-4 text-rose-400" />
                Pekerjaan Emergency & Pemeliharaan ({matchedEmergency.length} Tiket)
              </h3>
            </div>

            {matchedEmergency.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Tidak ada catatan tiket emergency / gangguan di rute SPBJ ini.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {matchedEmergency.map((e) => (
                  <div key={e.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {e.workType || 'Emergency'}
                        </span>
                        <span className="font-bold text-white text-xs">{e.locationName}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{e.description}</p>
                      <div className="text-[10px] text-slate-500 mt-0.5">Tiket: {e.ticketNumber} | Mandor: {e.mandorName}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {e.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: REALISASI PEKERJAAN */}
      {activeSummaryTab === 'realisasi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Realisasi Pekerjaan & Progres Fisik ({matchedBoq.length} Item BOQ)
            </h3>
          </div>
          {matchedBoq.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada data realisasi pekerjaan untuk SPBJ ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Uraian Pekerjaan</th>
                    <th className="py-2.5 px-3">Sat</th>
                    <th className="py-2.5 px-3 text-right">Vol RAB</th>
                    <th className="py-2.5 px-3 text-right">Vol Realisasi</th>
                    <th className="py-2.5 px-3 text-right">Nilai Realisasi (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Bobot (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchedBoq.map((b) => {
                    const bobot = totalBoqContractValue > 0 ? (((b.realizedPrice || 0) / totalBoqContractValue) * 100).toFixed(2) : '0.00';
                    return (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-bold text-white">{b.materialOrWork}</td>
                        <td className="py-2.5 px-3 text-slate-400">{b.unit}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{b.contractVolume}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-bold">{b.realizedVolume}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{formatRupiah(b.realizedPrice || 0)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-400 font-bold">{bobot}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MATERIAL MDU & NON-MDU */}
      {activeSummaryTab === 'mdu-nonmdu' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                Material MDU ({matchedMdu.length} Item)
              </h3>
            </div>
            {matchedMdu.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada material MDU terdaftar untuk SPBJ ini.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {matchedMdu.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{m.material}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Kategori: {m.category}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-amber-400 text-xs">
                      {m.quantity} {m.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-400" />
                Material Non-MDU ({matchedNonMdu.length} Item)
              </h3>
            </div>
            {matchedNonMdu.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada material Non-MDU terdaftar untuk SPBJ ini.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {matchedNonMdu.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{m.material}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Kategori: {m.category}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-blue-400 text-xs">
                      {m.quantity} {m.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MATERIAL BONGKAR */}
      {activeSummaryTab === 'bongkar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              Material Bongkar Gudang / Site ({matchedBongkar.length} Item)
            </h3>
          </div>
          {matchedBongkar.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada material bongkar tercatat untuk SPBJ ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Nama Material Bongkar</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3 text-right">Vol</th>
                    <th className="py-2.5 px-3">Kondisi</th>
                    <th className="py-2.5 px-3">Lokasi Gudang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchedBongkar.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-amber-400">{b.itemCode}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{b.materialName}</td>
                      <td className="py-2.5 px-3 text-slate-300">{b.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">{b.volumeBongkar} {b.unit}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {b.condition}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{b.warehouseLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ALAT KERJA */}
      {activeSummaryTab === 'alat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Alat Kerja & Kalibrasi ({matchedEquipment.length} Alat)
            </h3>
          </div>
          {matchedEquipment.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada alat kerja teralokasi khusus untuk SPBJ ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">ID Alat</th>
                    <th className="py-2.5 px-3">Nama & Brand</th>
                    <th className="py-2.5 px-3">No. Seri</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Kalibrasi Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchedEquipment.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">{eq.code}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{eq.name} <span className="block text-[10px] text-slate-400 font-normal">{eq.category}</span></td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">{eq.serialNumber}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {eq.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">{eq.lastCalibrated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TIMELINE PEKERJAAN */}
      {activeSummaryTab === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Timeline & Jadwal Rencana Pekerjaan ({matchedTasks.length} Agenda)
            </h3>
          </div>
          {matchedTasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada agenda timeline pekerjaan terjadwal untuk SPBJ ini.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {matchedTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {t.priority}
                      </span>
                      <span className="font-bold text-white text-xs">{t.taskTitle}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Lokasi: {t.locationDetails || 'Site Proyek'} | Target: {t.dueDate}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TAGGING LOKASI */}
      {activeSummaryTab === 'tagging' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              Tagging Lokasi GPS & Gardu / Tiang ({matchedLocationTags.length} Titik)
            </h3>
          </div>
          {matchedLocationTags.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada titik tagging koordinat GPS terdaftar untuk SPBJ ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Nama Titik / Tiang / Gardu</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3">Koordinat (Lat, Lng)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchedLocationTags.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-white">{l.name}</td>
                      <td className="py-2.5 px-3 text-amber-400">{l.type}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{l.lat.toFixed(6)}, {l.lng.toFixed(6)}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MONITORING APD */}
      {activeSummaryTab === 'apd' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-400" />
              Monitoring APD (Alat Pelindung Diri) Personil ({matchedWorkers.length} Pekerja)
            </h3>
          </div>
          {matchedWorkers.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada data pekerja & APD tercatat untuk SPBJ ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Nama Pekerja</th>
                    <th className="py-2.5 px-3">Posisi / Keahlian</th>
                    <th className="py-2.5 px-3 text-center">Sertifikasi K3</th>
                    <th className="py-2.5 px-3 text-center">Status APD K3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchedWorkers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-white">{w.name} <span className="block text-[10px] text-slate-400 font-mono">NIP: {w.nip}</span></td>
                      <td className="py-2.5 px-3 text-amber-400">{w.role}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-300">{w.certification}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          w.ppeVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {w.ppeVerified ? '✓ APD Lengkap Terverifikasi' : 'Belum Terverifikasi'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

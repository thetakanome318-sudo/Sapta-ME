import React, { useState } from 'react';
import { Wrench, Search, Filter, ShieldCheck, AlertCircle, Plus, History } from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  brand: string;
  serialNumber: string;
  status: 'Ready' | 'In Use' | 'Maintenance';
  assignedTo: string;
  lastCalibrated: string;
}

const TOOLS_DATA: ToolItem[] = [
  { id: 'TOOL-001', name: 'Insulation Tester 10kV', brand: 'Megger', serialNumber: 'MG-9921', status: 'In Use', assignedTo: 'Agus Prasetyo', lastCalibrated: '2026-06-15' },
  { id: 'TOOL-002', name: 'Digital Multimeter', brand: 'Fluke', serialNumber: 'FLK-8812', status: 'Ready', assignedTo: '-', lastCalibrated: '2026-08-20' },
  { id: 'TOOL-003', name: 'Earth Ground Tester', brand: 'Megger', serialNumber: 'MG-7710', status: 'Maintenance', assignedTo: '-', lastCalibrated: '2026-01-10' },
  { id: 'TOOL-004', name: 'Thermal Camera', brand: 'FLIR', serialNumber: 'FLIR-E8', status: 'In Use', assignedTo: 'Heri Susanto', lastCalibrated: '2026-09-05' },
];

export const EquipmentMonitoringView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-500" />
            <span>Monitoring Alat Kerja & Kalibrasi</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen inventaris alat ukur, jadwal kalibrasi rutin, dan status peminjaman peralatan lapangan.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4" />
          <span>Tambah Alat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari alat, brand, atau teknisi..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="md:col-span-4">
          <select className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none">
            <option>Semua Status</option>
            <option>Ready</option>
            <option>In Use</option>
            <option>Maintenance</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">ID Alat</th>
                <th className="p-4">Nama & Brand</th>
                <th className="p-4">No. Seri</th>
                <th className="p-4">Status</th>
                <th className="p-4">Peminjam</th>
                <th className="p-4">Terakhir Kalibrasi</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {TOOLS_DATA.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-400">{tool.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{tool.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{tool.brand}</div>
                  </td>
                  <td className="p-4 font-mono">{tool.serialNumber}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      tool.status === 'Ready' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
                      tool.status === 'In Use' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                      'text-rose-500 bg-rose-500/10 border-rose-500/20'
                    }`}>
                      {tool.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{tool.assignedTo}</td>
                  <td className="p-4">{tool.lastCalibrated}</td>
                  <td className="p-4 text-right">
                    <button className="text-amber-600 hover:underline font-bold">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

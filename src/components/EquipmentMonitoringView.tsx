import React, { useState } from 'react';
import { Wrench, Search, Filter, ShieldCheck, Plus, CheckCircle2, X } from 'lucide-react';
import { SpbjContract, Worker } from '../types';

export interface ToolItem {
  id: string;
  spbjId: string;
  name: string;
  brand: string;
  serialNumber: string;
  status: 'Ready' | 'In Use' | 'Maintenance';
  assignedTo: string;
  lastCalibrated: string;
}

interface EquipmentMonitoringViewProps {
  spbjList?: SpbjContract[];
  workers?: Worker[];
}

const DEFAULT_TOOLS_DATA: ToolItem[] = [
  { id: 'TOOL-001', spbjId: 'SPBJ-001', name: 'Insulation Tester 10kV', brand: 'Megger', serialNumber: 'MG-9921', status: 'In Use', assignedTo: 'Agus Prasetyo', lastCalibrated: '2026-06-15' },
  { id: 'TOOL-002', spbjId: 'SPBJ-001', name: 'Digital Multimeter', brand: 'Fluke', serialNumber: 'FLK-8812', status: 'Ready', assignedTo: '-', lastCalibrated: '2026-08-20' },
  { id: 'TOOL-003', spbjId: 'SPBJ-002', name: 'Earth Ground Tester', brand: 'Megger', serialNumber: 'MG-7710', status: 'Maintenance', assignedTo: '-', lastCalibrated: '2026-01-10' },
  { id: 'TOOL-004', spbjId: 'SPBJ-002', name: 'Thermal Camera 20kV', brand: 'FLIR', serialNumber: 'FLIR-E8', status: 'In Use', assignedTo: 'Heri Susanto', lastCalibrated: '2026-09-05' },
  { id: 'TOOL-005', spbjId: 'SPBJ-001', name: 'Hydraulic Crimping Tool', brand: 'Izumi', serialNumber: 'IZM-2026', status: 'In Use', assignedTo: 'Rahmat Hidayat', lastCalibrated: '2026-07-10' },
];

export const EquipmentMonitoringView: React.FC<EquipmentMonitoringViewProps> = ({ spbjList = [], workers = [] }) => {
  const [tools, setTools] = useState<ToolItem[]>(DEFAULT_TOOLS_DATA);
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formSpbjId, setFormSpbjId] = useState(spbjList[0]?.id || 'SPBJ-001');
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Fluke');
  const [formSerial, setFormSerial] = useState('');
  const [formStatus, setFormStatus] = useState<ToolItem['status']>('Ready');
  const [formAssignedTo, setFormAssignedTo] = useState('-');
  const [formCalibrated, setFormCalibrated] = useState(new Date().toISOString().slice(0, 10));

  const filteredTools = tools.filter((tool) => {
    const matchesSpbj = selectedSpbjId === 'all' || tool.spbjId === selectedSpbjId;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || tool.status === statusFilter;
    return matchesSpbj && matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSerial.trim()) return;

    const newTool: ToolItem = {
      id: `TOOL-${String(tools.length + 1).padStart(3, '0')}`,
      spbjId: formSpbjId,
      name: formName.trim(),
      brand: formBrand.trim(),
      serialNumber: formSerial.trim(),
      status: formStatus,
      assignedTo: formAssignedTo,
      lastCalibrated: formCalibrated,
    };

    setTools([newTool, ...tools]);
    setIsAddModalOpen(false);

    // Reset Form
    setFormName('');
    setFormSerial('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-500" />
            <span>Monitoring Alat Kerja & Kalibrasi</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen inventaris alat ukur, jadwal kalibrasi rutin, dan status peminjaman peralatan lapangan per SPBJ.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md shadow-amber-400/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Alat Kerja per SPBJ</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari alat, brand, atau teknisi..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={selectedSpbjId}
            onChange={(e) => setSelectedSpbjId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white font-semibold"
          >
            <option value="all">Semua Kontrak SPBJ ({spbjList.length} Proyek)</option>
            {spbjList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="Ready">Ready (Tersedia)</option>
            <option value="In Use">In Use (Dipinjam)</option>
            <option value="Maintenance">Maintenance (Kalibrasi)</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">ID Alat</th>
                <th className="p-4">Nama & Brand</th>
                <th className="p-4">No. Seri</th>
                <th className="p-4">Status</th>
                <th className="p-4">Peminjam / Teknisi</th>
                <th className="p-4">Terhubung SPBJ</th>
                <th className="p-4">Terakhir Kalibrasi</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredTools.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                    Belum ada data alat kerja terdaftar untuk kriteria ini.
                  </td>
                </tr>
              ) : (
                filteredTools.map((tool) => {
                  const spbj = spbjList.find((s) => s.id === tool.spbjId);
                  return (
                    <tr key={tool.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-400">{tool.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{tool.name}</div>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-semibold">{tool.brand}</div>
                      </td>
                      <td className="p-4 font-mono font-bold">{tool.serialNumber}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                          tool.status === 'Ready' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' :
                          tool.status === 'In Use' ? 'text-blue-600 bg-blue-500/10 border-blue-500/20' :
                          'text-rose-600 bg-rose-500/10 border-rose-500/20'
                        }`}>
                          {tool.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{tool.assignedTo}</td>
                      <td className="p-4 font-mono text-slate-500">
                        {spbj ? `${spbj.spbjNumber} (${spbj.up3Name})` : '-'}
                      </td>
                      <td className="p-4 font-mono">{tool.lastCalibrated}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            const newStatus = tool.status === 'Ready' ? 'In Use' : tool.status === 'In Use' ? 'Maintenance' : 'Ready';
                            setTools(tools.map(t => t.id === tool.id ? { ...t, status: newStatus } : t));
                          }}
                          className="text-amber-600 dark:text-amber-400 hover:underline font-bold"
                        >
                          Ubah Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Alat Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="bg-amber-400 p-4 text-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-slate-950" />
                <h3 className="font-bold text-sm">Tambah Alat Kerja Baru per SPBJ</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-950 hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih SPBJ Proyek *</label>
                <select
                  value={formSpbjId}
                  onChange={(e) => setFormSpbjId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {spbjList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Alat Ukur *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Insulation Tester 10kV"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brand / Merek</label>
                  <input
                    type="text"
                    required
                    placeholder="Megger / Fluke / FLIR"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor Seri (SN) *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: FLK-8812"
                    value={formSerial}
                    onChange={(e) => setFormSerial(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Alat</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Ready">Ready (Tersedia)</option>
                    <option value="In Use">In Use (Dipinjam)</option>
                    <option value="Maintenance">Maintenance (Kalibrasi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Peminjam / Teknisi</label>
                  <input
                    type="text"
                    placeholder="Nama Teknisi atau '-'"
                    value={formAssignedTo}
                    onChange={(e) => setFormAssignedTo(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal Kalibrasi</label>
                  <input
                    type="date"
                    value={formCalibrated}
                    onChange={(e) => setFormCalibrated(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:underline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md"
                >
                  Simpan Alat Kerja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

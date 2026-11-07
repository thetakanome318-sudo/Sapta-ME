import React, { useState } from 'react';
import { Equipment, Worker, Project } from '../types';
import { 
  Wrench, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Plus,
  SlidersHorizontal
} from 'lucide-react';

interface EquipmentViewProps {
  equipment: Equipment[];
  workers: Worker[];
  projects: Project[];
  onUpdateEquipmentStatus: (id: string, status: Equipment['status'], assignedWorkerName?: string) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  equipment,
  workers,
  projects,
  onUpdateEquipmentStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEqForAssign, setSelectedEqForAssign] = useState<Equipment | null>(null);
  const [assignWorker, setAssignWorker] = useState('');

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const readyCount = equipment.filter((e) => e.status === 'Siap Pakai').length;
  const inUseCount = equipment.filter((e) => e.status === 'Sedang Digunakan').length;
  const calibDueCount = equipment.filter((e) => e.status === 'Jadwal Kalibrasi').length;

  const handleAssign = () => {
    if (!selectedEqForAssign || !assignWorker) return;
    onUpdateEquipmentStatus(selectedEqForAssign.id, 'Sedang Digunakan', assignWorker);
    setSelectedEqForAssign(null);
    setAssignWorker('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Inventaris Alat Pengujian & Kalibrasi ME
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pelacakan Megger Insulation Tester 10kV, FLIR Thermal Camera, Hydraulic Crimper, dan APD Khusus VDE.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Siap Pakai (Ready)</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {readyCount} Alat
            </span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/20" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Sedang Digunakan (In Use)</span>
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {inUseCount} Alat
            </span>
          </div>
          <Wrench className="w-8 h-8 text-amber-500/20" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Jadwal Kalibrasi Mendatang</span>
            <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
              {calibDueCount} Alat
            </span>
          </div>
          <Clock className="w-8 h-8 text-blue-500/20" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama alat (Fluke, Megger, FLIR), nomor seri, kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="md:col-span-6">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Kategori Alat</option>
            <option value="Pengukur Tahanan Isolasi (Megger)">Pengukur Tahanan Isolasi (Megger)</option>
            <option value="Kamera Termograf FLIR">Kamera Termograf FLIR</option>
            <option value="Tester Grounding (Tahanan Tanah)">Tester Grounding (Tahanan Tanah)</option>
            <option value="Alat Crimping Hidrolik">Alat Crimping Hidrolik</option>
            <option value="APD Khusus Tegangan Tinggi">APD Khusus Tegangan Tinggi</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <th className="p-3.5">Kode / S/N</th>
                <th className="p-3.5">Nama Alat Pengujian</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Status Alat</th>
                <th className="p-3.5">Masa Kalibrasi</th>
                <th className="p-3.5">Penanggung Jawab / User</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredEquipment.map((item) => {
                const isReady = item.status === 'Siap Pakai';

                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {item.code}
                      <span className="block text-[10px] text-slate-400 font-normal">S/N: {item.serialNumber}</span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                      {item.category}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isReady
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : item.status === 'Sedang Digunakan'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                      {item.nextCalibration}
                    </td>
                    <td className="p-3.5">
                      {item.assignedWorkerName ? (
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.assignedWorkerName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Gudang Utama ME</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {isReady ? (
                        <button
                          onClick={() => setSelectedEqForAssign(item)}
                          className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded text-[11px]"
                        >
                          Serah Terima
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateEquipmentStatus(item.id, 'Siap Pakai')}
                          className="px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded text-[11px]"
                        >
                          Kembalikan Alat
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedEqForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Serah Terima Alat Pengujian
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alat: <strong className="text-slate-900 dark:text-white">{selectedEqForAssign.name}</strong> ({selectedEqForAssign.code})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Teknisi Penanggung Jawab
                </label>
                <select
                  value={assignWorker}
                  onChange={(e) => setAssignWorker(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="">-- Pilih Teknisi --</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name} ({w.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setSelectedEqForAssign(null)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAssign}
                disabled={!assignWorker}
                className="px-4 py-2 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg disabled:opacity-50"
              >
                Konfirmasi Serah Terima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

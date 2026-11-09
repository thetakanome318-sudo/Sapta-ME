import React, { useState } from 'react';
import { HardHat, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, UserCheck, Search, Plus, X } from 'lucide-react';
import { SpbjContract, Worker } from '../types';

export interface PpeItem {
  id: string;
  spbjId: string;
  workerName: string;
  helmet: boolean;
  vdeGloves: boolean;
  safetyShoes10kV: boolean;
  harness: boolean;
  status: 'Complete' | 'Incomplete';
  lastChecked: string;
}

interface PpeMonitoringViewProps {
  spbjList?: SpbjContract[];
  workers?: Worker[];
}

const DEFAULT_PPE_DATA: PpeItem[] = [
  { id: 'PPE-101', spbjId: 'SPBJ-001', workerName: 'Rahmat Hidayat', helmet: true, vdeGloves: true, safetyShoes10kV: true, harness: true, status: 'Complete', lastChecked: '2026-11-06 07:42' },
  { id: 'PPE-102', spbjId: 'SPBJ-001', workerName: 'Agus Prasetyo', helmet: true, vdeGloves: true, safetyShoes10kV: true, harness: false, status: 'Incomplete', lastChecked: '2026-11-06 07:48' },
  { id: 'PPE-103', spbjId: 'SPBJ-002', workerName: 'Dwi Kurniawan', helmet: true, vdeGloves: true, safetyShoes10kV: true, harness: true, status: 'Complete', lastChecked: '2026-11-06 07:55' },
  { id: 'PPE-104', spbjId: 'SPBJ-002', workerName: 'Sujono Tri', helmet: true, vdeGloves: true, safetyShoes10kV: true, harness: true, status: 'Complete', lastChecked: '2026-11-06 08:00' },
];

export const PpeMonitoringView: React.FC<PpeMonitoringViewProps> = ({ spbjList = [], workers = [] }) => {
  const [ppeList, setPpeList] = useState<PpeItem[]>(DEFAULT_PPE_DATA);
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formSpbjId, setFormSpbjId] = useState(spbjList[0]?.id || 'SPBJ-001');
  const [formWorkerName, setFormWorkerName] = useState(workers[0]?.name || 'Rahmat Hidayat');
  const [formHelmet, setFormHelmet] = useState(true);
  const [formVdeGloves, setFormVdeGloves] = useState(true);
  const [formSafetyShoes, setFormSafetyShoes] = useState(true);
  const [formHarness, setFormHarness] = useState(true);

  const filteredPpe = ppeList.filter((item) => {
    const matchesSpbj = selectedSpbjId === 'all' || item.spbjId === selectedSpbjId;
    const matchesSearch = item.workerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpbj && matchesSearch;
  });

  const completeCount = filteredPpe.filter(p => p.status === 'Complete').length;
  const incompleteCount = filteredPpe.filter(p => p.status === 'Incomplete').length;
  const completePercentage = filteredPpe.length > 0 ? Math.round((completeCount / filteredPpe.length) * 100) : 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWorkerName.trim()) return;

    const isAllComplete = formHelmet && formVdeGloves && formSafetyShoes && formHarness;

    const newItem: PpeItem = {
      id: `PPE-${Date.now().toString().slice(-4)}`,
      spbjId: formSpbjId,
      workerName: formWorkerName.trim(),
      helmet: formHelmet,
      vdeGloves: formVdeGloves,
      safetyShoes10kV: formSafetyShoes,
      harness: formHarness,
      status: isAllComplete ? 'Complete' : 'Incomplete',
      lastChecked: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    setPpeList([newItem, ...ppeList]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-500" />
            <span>Monitoring APD (Personal Protective Equipment)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verifikasi kelengkapan alat pelindung diri teknisi di lapangan per SPBJ untuk menjamin K3.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition-colors"
        >
          <UserCheck className="w-4 h-4" />
          <span>Verifikasi APD Harian per SPBJ</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama teknisi..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="md:col-span-6">
          <select
            value={selectedSpbjId}
            onChange={(e) => setSelectedSpbjId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-semibold"
          >
            <option value="all">Semua Kontrak SPBJ ({spbjList.length} Proyek)</option>
            {spbjList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Aman (Lengkap APD)</span>
            <div className="text-2xl font-bold text-emerald-500 font-mono">{completePercentage}%</div>
            <span className="text-[10px] text-slate-400">{completeCount} dari {filteredPpe.length} Teknisi</span>
          </div>
          <ShieldCheck className="w-10 h-10 text-emerald-500/20" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Peringatan (Belum Lengkap)</span>
            <div className="text-2xl font-bold text-amber-500 font-mono">{100 - completePercentage}%</div>
            <span className="text-[10px] text-slate-400">{incompleteCount} Teknisi Perlu Diperhatikan</span>
          </div>
          <ShieldAlert className="w-10 h-10 text-amber-500/20" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Incident Free Days</span>
            <div className="text-2xl font-bold text-blue-500 font-mono">1,420 Hari</div>
            <span className="text-[10px] text-slate-400">Zero Accident Protocol SMK</span>
          </div>
          <CheckCircle2 className="w-10 h-10 text-blue-500/20" />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Nama Teknisi</th>
                <th className="p-4">Terhubung SPBJ</th>
                <th className="p-4 text-center">Helm K3</th>
                <th className="p-4 text-center">Gloves VDE</th>
                <th className="p-4 text-center">Sepatu 10kV</th>
                <th className="p-4 text-center">Harness</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Terakhir Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPpe.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                    Belum ada data verifikasi APD terdaftar untuk kriteria ini.
                  </td>
                </tr>
              ) : (
                filteredPpe.map((item) => {
                  const spbj = spbjList.find((s) => s.id === item.spbjId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{item.workerName}</td>
                      <td className="p-4 font-mono text-slate-500">
                        {spbj ? `${spbj.spbjNumber} (${spbj.up3Name})` : '-'}
                      </td>
                      <td className="p-4 text-center">
                        {item.helmet ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {item.vdeGloves ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {item.safetyShoes10kV ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {item.harness ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                          item.status === 'Complete' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-600 bg-rose-500/10 border-rose-500/20'
                        }`}>
                          {item.status === 'Complete' ? 'Aman (Lengkap)' : 'Peringatan'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{item.lastChecked}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Verifikasi APD Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm">Verifikasi APD K3 Teknisi per SPBJ</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target SPBJ Proyek *</label>
                <select
                  value={formSpbjId}
                  onChange={(e) => setFormSpbjId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {spbjList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Teknisi / Pekerja *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Teknisi"
                  value={formWorkerName}
                  onChange={(e) => setFormWorkerName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Checklist Peralatan APD K3:</label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHelmet}
                    onChange={(e) => setFormHelmet(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Helm Pelindung K3 (Standard PLN)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVdeGloves}
                    onChange={(e) => setFormVdeGloves(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Gloves Isolasi VDE (Tegangan)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSafetyShoes}
                    onChange={(e) => setFormSafetyShoes(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Sepatu Safety Isolasi 10kV</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHarness}
                    onChange={(e) => setFormHarness(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Full Body Harness (Pekerjaan Ketinggian)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:underline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Verifikasi APD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Truck, 
  Users, 
  DollarSign, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  X,
  User
} from 'lucide-react';
import { LogisticsLaborCost, SpbjContract } from '../types';
import { BopSubmenuBar } from './BopSubmenuBar';

interface LogisticsLaborCostViewProps {
  mode?: 'angkutan' | 'buruh' | 'all';
  spbjList?: SpbjContract[];
  costs?: LogisticsLaborCost[];
  onAddCost?: (cost: Omit<LogisticsLaborCost, 'id'>) => void;
  onUpdateStatus?: (id: string, status: LogisticsLaborCost['status']) => void;
  onDeleteCost?: (id: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const LogisticsLaborCostView: React.FC<LogisticsLaborCostViewProps> = ({
  mode = 'angkutan',
  spbjList = [],
  costs = [],
  onAddCost,
  onUpdateStatus,
  onDeleteCost,
  activeTab,
  setActiveTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpbj, setSelectedSpbj] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const defaultCategory = mode === 'angkutan' ? 'Sewa Crane & Mobilisasi Trafo' : 'Gali Lubang Tiang';
  const [category, setCategory] = useState(defaultCategory);
  const [spbjId, setSpbjId] = useState(spbjList[0]?.id || 'SPBJ-001');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(3500000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submittedBy, setSubmittedBy] = useState('');
  const [notes, setNotes] = useState('');

  const isAngkutan = mode === 'angkutan';
  const isBuruh = mode === 'buruh';

  // Filter costs based on mode
  const filteredByMode = costs.filter((c) => {
    if (mode === 'angkutan') return c.type === 'Angkutan';
    if (mode === 'buruh') return c.type === 'Buruh';
    return true;
  });

  const filteredCosts = filteredByMode.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.submittedBy && item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpbj = selectedSpbj === 'ALL' || item.spbjId === selectedSpbj;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesSpbj && matchesStatus;
  });

  const totalAmount = filteredCosts.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = filteredCosts.filter((i) => i.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = filteredCosts.filter((i) => i.status === 'Pending').reduce((sum, item) => sum + item.amount, 0);

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);

  const handleDownloadNota = (item: LogisticsLaborCost) => {
    const content = `
NOTA TRANSAKSI ${item.type === 'Angkutan' ? 'BIAYA ANGKUTAN & MOBILISASI' : 'UPAH BURUH LAPANGAN'}
------------------------------------------------------------
No Transaksi  : ${item.id}
Tanggal       : ${item.date}
Jenis Biaya   : ${item.type}
Kategori      : ${item.category}
Proyek / SPBJ : ${item.projectName}
Uraian        : ${item.description}
Jumlah        : ${formatIDR(item.amount)}
Pengaju / PJ  : ${item.submittedBy || 'Tim Lapangan'}
Status        : ${item.status}
Catatan       : ${item.notes || '-'}

Dicetak pada  : ${new Date().toLocaleString('id-ID')}
PT SAPTA MANUNGGAL KARYA - DIVISI ME
------------------------------------------------------------
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nota_${item.type}_${item.id}_${item.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const targetSpbj = spbjList.find((s) => s.id === spbjId);
    const costType: 'Angkutan' | 'Buruh' = mode === 'buruh' ? 'Buruh' : 'Angkutan';

    if (onAddCost) {
      onAddCost({
        type: costType,
        category,
        description,
        projectName: targetSpbj?.projectName || 'Proyek Kelistrikan ME',
        spbjId,
        amount,
        date,
        submittedBy: submittedBy || 'Staff Lapangan',
        status: 'Pending',
        notes: notes || undefined,
      });
    }

    // Reset
    setDescription('');
    setAmount(3500000);
    setSubmittedBy('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* BOP Submenu Bar Navigation */}
      {setActiveTab && (
        <BopSubmenuBar 
          activeTab={activeTab || (mode === 'angkutan' ? 'bop-angkutan' : 'bop-buruh')} 
          setActiveTab={setActiveTab} 
        />
      )}

      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          {isAngkutan ? (
            <Truck className="w-64 h-64 text-blue-500" />
          ) : isBuruh ? (
            <Users className="w-64 h-64 text-amber-500" />
          ) : (
            <DollarSign className="w-64 h-64 text-emerald-500" />
          )}
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
              isAngkutan
                ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}>
              {isAngkutan ? <Truck className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
              <span>
                {isAngkutan ? 'BOP: Logistik & Angkutan' : 'BOP: Upah Tenaga Kerja Lapangan'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              {isAngkutan && 'Biaya Angkutan & Logistik'}
              {isBuruh && 'Upah Buruh Lapangan'}
              {!isAngkutan && !isBuruh && 'Biaya Angkutan & Buruh Lapangan'}
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl">
              {isAngkutan && 'Monitoring pengeluaran sewa truk crane, mobilisasi trafo, angkutan tiang besi/beton, dan langsir material antar site per SPBJ.'}
              {isBuruh && 'Monitoring upah tenaga kerja harian lepas, tim gali lubang tiang, lembur terminasi kabel, dan upah langsir jalur rawa.'}
              {!isAngkutan && !isBuruh && 'Monitoring pengeluaran operasional logistik, mobilisasi alat berat, dan manajemen upah buruh harian.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 ${
                isAngkutan
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isAngkutan ? 'Input Biaya Angkutan Baru' : 'Input Upah Buruh Baru'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {isAngkutan ? 'Total Biaya Angkutan' : isBuruh ? 'Total Upah Buruh' : 'Total Biaya'}
            </span>
            <div className={`p-2 rounded-lg ${isAngkutan ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-amber-50 dark:bg-amber-900/30'}`}>
              {isAngkutan ? <Truck className="w-4 h-4 text-blue-500" /> : <Users className="w-4 h-4 text-amber-500" />}
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{formatIDR(totalAmount)}</div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>Dari {filteredCosts.length} Transaksi Terdaftar</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Paid (Telah Dibayar)</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-500 font-mono">{formatIDR(paidAmount)}</div>
          <div className="mt-2 text-[10px] text-slate-400 uppercase font-bold tracking-tight">
            Telah Ditransfer & Diselesaikan
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outstanding (Pending)</span>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-orange-500 font-mono">{formatIDR(pendingAmount)}</div>
          <div className="mt-2 text-[10px] text-orange-500 uppercase font-bold tracking-tight">
            Menunggu Persetujuan PM / Kasir
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isAngkutan ? "Cari angkutan, vendor, trafo..." : "Cari pekerjaan buruh, mandor..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSpbj}
              onChange={(e) => setSelectedSpbj(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 dark:text-slate-200"
            >
              <option value="ALL">Semua SPBJ Proyek</option>
              {spbjList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 dark:text-slate-200"
          >
            <option value="ALL">Semua Status</option>
            <option value="Paid">Paid (Sudah Bayar)</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Kategori Biaya</th>
                <th className="p-4">Deskripsi Rincian Pekerjaan</th>
                <th className="p-4">Proyek / SPBJ</th>
                <th className="p-4">Pengaju / PJ</th>
                <th className="p-4 text-right">Jumlah (Rp)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredCosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 italic">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-8 h-8 opacity-20" />
                      <span>Belum ada transaksi {isAngkutan ? 'biaya angkutan' : isBuruh ? 'upah buruh' : 'biaya'} untuk kriteria ini.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCosts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono whitespace-nowrap text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase border ${
                        item.type === 'Angkutan'
                          ? 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                          : 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs">
                      {item.description}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={item.projectName}>
                      <div className="font-semibold text-slate-900 dark:text-slate-200 truncate">{item.projectName}</div>
                      {item.spbjId && <div className="text-[10px] text-blue-500 font-mono">{item.spbjId}</div>}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{item.submittedBy || 'Tim Lapangan'}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-black text-right text-slate-900 dark:text-white whitespace-nowrap">
                      {formatIDR(item.amount)}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus && onUpdateStatus(item.id, e.target.value as LogisticsLaborCost['status'])}
                        className={`text-[9px] font-bold rounded-full px-2 py-0.5 border outline-none cursor-pointer ${
                          item.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                            : item.status === 'Approved'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
                            : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400'
                        }`}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadNota(item)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold hover:underline"
                          title="Cetak & Unduh Nota Kuitansi"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Nota</span>
                        </button>
                        {onDeleteCost && (
                          <button
                            onClick={() => {
                              if (confirm('Hapus transaksi ini?')) onDeleteCost(item.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Input Biaya Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {isAngkutan ? <Truck className="w-5 h-5 text-blue-500" /> : <Users className="w-5 h-5 text-amber-500" />}
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isAngkutan ? 'Input Pengeluaran Biaya Angkutan' : 'Input Pengeluaran Upah Buruh'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
                  Pilih Kontrak SPBJ Proyek *
                </label>
                <select
                  value={spbjId}
                  onChange={(e) => setSpbjId(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {spbjList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
                    Kategori {isAngkutan ? 'Angkutan' : 'Upah Buruh'} *
                  </label>
                  {isAngkutan ? (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Sewa Crane & Mobilisasi Trafo">Sewa Crane & Mobilisasi Trafo</option>
                      <option value="Angkutan Tiang & Kabel">Angkutan Tiang & Kabel</option>
                      <option value="Langsir Material Site">Langsir Material Site</option>
                      <option value="Mobilisasi Tim & Alat">Mobilisasi Tim & Alat</option>
                      <option value="Ekspedisi Kapal / Antar Pulau">Ekspedisi Kapal / Antar Pulau</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </select>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Gali Lubang Tiang">Gali Lubang Tiang</option>
                      <option value="Lembur Tim Lapangan">Lembur Tim Lapangan</option>
                      <option value="Upah Buruh Langsir">Upah Buruh Langsir</option>
                      <option value="Upah Harian Lepas">Upah Harian Lepas</option>
                      <option value="Bongkar Pasang Jaringan">Bongkar Pasang Jaringan</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
                    Tanggal Transaksi *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
                  Uraian Pekerjaan / Pengeluaran *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={
                    isAngkutan
                      ? "Contoh: Sewa Crane 25T angkat trafo 50kVA atau Angkutan 20 tiang besi 12m..."
                      : "Contoh: Upah lembur 4 teknisi terminasi kabel atau gali 15 lubang tiang desa..."
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
                    Jumlah Nominal (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
                    Pengaju / Mandor PJ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Pengaju / Mandor"
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="No. plat kendaraan, rincian personil, nomor kuitansi..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 ${
                    isAngkutan
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                      : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

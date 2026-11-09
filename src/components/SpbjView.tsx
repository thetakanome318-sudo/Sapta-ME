import React, { useState } from 'react';
import { SpbjContract, Project } from '../types';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Building2, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Zap,
  ShieldCheck,
  ChevronRight,
  Layers,
  Eye
} from 'lucide-react';

interface SpbjViewProps {
  spbjList: SpbjContract[];
  projects: Project[];
  onAddSpbj: (newSpbj: SpbjContract) => void;
  onUpdateSpbjEndDate: (spbjId: string, newEndDate: string, newStatus?: SpbjContract['status']) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenSummary?: (spbjId: string) => void;
}

export const SpbjView: React.FC<SpbjViewProps> = ({
  spbjList,
  projects,
  onAddSpbj,
  onUpdateSpbjEndDate,
  activeTab,
  setActiveTab,
  onOpenSummary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [up3Filter, setUp3Filter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  // Form Input State matching the exact requirements: NO SPBJ, UP3/Nama Pekerjaan, Nilai Kontrak, Tanggal Mulai, Tanggal Akhir
  const [spbjNumber, setSpbjNumber] = useState('');
  const [projectNameInput, setProjectNameInput] = useState('');
  const [up3Name, setUp3Name] = useState('UP3 Tual');
  const [contractEndDate, setContractEndDate] = useState('2026-12-31');
  const [startDate, setStartDate] = useState('2026-08-19');
  const [contractValue, setContractValue] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [notes, setNotes] = useState('');

  // Addendum / Edit Expiry Modal State
  const [editingSpbj, setEditingSpbj] = useState<SpbjContract | null>(null);
  const [editDateInput, setEditDateInput] = useState('');

  const up3Options = [
    'UP3 Tual',
    'UP3 Cengkareng',
    'UP3 Bandara Soekarno-Hatta',
    'UP3 Bekasi',
    'UP3 Cikarang',
    'UP3 Kebon Jeruk',
    'UP3 Ambon',
    'UP3 Sorong',
    'UP3 Jayapura',
    'Lainnya (Custom UP3)',
  ];

  const calculateDaysRemaining = (endDateStr: string) => {
    const today = new Date();
    const end = new Date(endDateStr);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (endDateStr: string, currentStatus: SpbjContract['status']) => {
    const daysLeft = calculateDaysRemaining(endDateStr);
    if (daysLeft < 0) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          Expired
        </span>
      );
    } else if (daysLeft <= 30) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          &lt; {daysLeft} Hari
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Aktif
        </span>
      );
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  const filteredSpbj = spbjList.filter((item) => {
    const matchesSearch =
      item.spbjNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.up3Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUp3 = up3Filter === 'all' || item.up3Name === up3Filter;

    let matchesStatus = true;
    const daysLeft = calculateDaysRemaining(item.contractEndDate);
    if (statusFilter === 'active') matchesStatus = daysLeft > 30;
    if (statusFilter === 'warning') matchesStatus = daysLeft >= 0 && daysLeft <= 30;
    if (statusFilter === 'expired') matchesStatus = daysLeft < 0;

    return matchesSearch && matchesUp3 && matchesStatus;
  });

  const handleSubmitSpbj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spbjNumber.trim() || !projectNameInput.trim() || !contractEndDate) return;

    const daysLeft = calculateDaysRemaining(contractEndDate);
    let initialStatus: SpbjContract['status'] = 'Aktif';
    if (daysLeft < 0) initialStatus = 'Expired / Addendum';
    else if (daysLeft <= 30) initialStatus = 'Mendekati Expired';

    const newRecord: SpbjContract = {
      id: `SPBJ-${Date.now().toString().slice(-4)}`,
      spbjNumber: spbjNumber.trim(),
      up3Name: up3Name,
      contractEndDate,
      startDate,
      projectName: projectNameInput.trim(),
      contractValue: contractValue.trim() || 'Rp 1.000.000.000',
      vendorCompany: 'PT Sapta Manunggal Karya',
      status: initialStatus,
      scopeOfWork: scopeOfWork.trim() || projectNameInput.trim(),
      notes: notes.trim() || 'Kontrak SPBJ baru terdaftar.',
    };

    onAddSpbj(newRecord);

    // Reset Form
    setSpbjNumber('');
    setProjectNameInput('');
    setContractValue('');
    setScopeOfWork('');
    setNotes('');
    setShowForm(false);
  };

  const handleSaveEditDate = () => {
    if (!editingSpbj || !editDateInput) return;
    const daysLeft = calculateDaysRemaining(editDateInput);
    let newStatus: SpbjContract['status'] = 'Aktif';
    if (daysLeft < 0) newStatus = 'Expired / Addendum';
    else if (daysLeft <= 30) newStatus = 'Mendekati Expired';

    onUpdateSpbjEndDate(editingSpbj.id, editDateInput, newStatus);
    setEditingSpbj(null);
    setEditDateInput('');
  };

  const activeCount = spbjList.filter((s) => calculateDaysRemaining(s.contractEndDate) > 30).length;
  const warningCount = spbjList.filter((s) => {
    const d = calculateDaysRemaining(s.contractEndDate);
    return d >= 0 && d <= 30;
  }).length;
  const expiredCount = spbjList.filter((s) => calculateDaysRemaining(s.contractEndDate) < 0).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            <span>Monitoring Kontrak SPBJ & UP3 PLN</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tabel monitoring Surat Perjanjian Barang dan Jasa (SPBJ) sesuai format standar PLN (Nama Pekerjaan, No SPBJ, Nilai Kontrak, Tanggal Mulai, Tanggal Akhir).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('spbj-summary')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-amber-400 bg-slate-900 border border-amber-400/40 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Rangkuman 360° per SPBJ</span>
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-400/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Tutup Menu Input' : '+ Input SPBJ Baru'}</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Total SPBJ</span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {spbjList.length} Kontrak
            </span>
          </div>
          <FileText className="w-8 h-8 text-amber-500/20" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Kontrak Aktif</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {activeCount}
            </span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/20" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Mendekati Expired (&lt; 30 Hari)</span>
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {warningCount}
            </span>
          </div>
          <Clock className="w-8 h-8 text-amber-500/20" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Expired / Addendum</span>
            <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
              {expiredCount}
            </span>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-500/20" />
        </div>
      </div>

      {/* Menu Input SPBJ Form (NO SPBJ, UP3, & Tanggal Akhir Kontrak) */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-400/40 dark:border-amber-500/30 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Form Input SPBJ (NO SPBJ, UP3, & Tanggal Akhir Kontrak)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">PT Sapta Manunggal Karya</span>
          </div>

          <form onSubmit={handleSubmitSpbj} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NO SPBJ */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NO SURAT PERJANJIAN / SPBJ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: 0009.SPBJ/DIS.01.01/F17070000/2026"
                  value={spbjNumber}
                  onChange={(e) => setSpbjNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* UP3 PLN */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  UP3 (Unit Pelaksana Pelayanan Pelanggan) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={up3Name}
                  onChange={(e) => setUp3Name(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {up3Options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nama Pekerjaan */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="misal: PEMBANGUNAN DAN PEMASANGAN JARINGAN DISTRIBUSI LISDES - Lokasi Desa Tamangil UP3 Tual"
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Nilai Kontrak */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nilai Kontrak (Rp)
                </label>
                <input
                  type="text"
                  placeholder="misal: Rp2.085.339.668"
                  value={contractValue}
                  onChange={(e) => setContractValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Tanggal Mulai */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Tanggal Akhir Kontrak */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Akhir Kontrak <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={contractEndDate}
                  onChange={(e) => setContractEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:underline"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow-sm"
              >
                Simpan Kontrak SPBJ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari No SPBJ, Nama Pekerjaan, UP3..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={up3Filter}
            onChange={(e) => setUp3Filter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua UP3 PLN</option>
            {up3Options.slice(0, -1).map((u, i) => (
              <option key={i} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Status Expiry</option>
            <option value="active">Kontrak Aktif (&gt; 30 Hari)</option>
            <option value="warning">Mendekati Expired (&lt;= 30 Hari)</option>
            <option value="expired">Expired / Addendum</option>
          </select>
        </div>
      </div>

      {/* Tabel Monitoring SPBJ - Styled exactly like the reference image with deep navy header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              {/* Deep Navy Header matching reference image: bg-[#0B2545] */}
              <tr className="bg-[#0B2545] text-white font-bold uppercase tracking-wider text-[11px] border-b border-[#133863]">
                <th className="p-4 text-center w-16 border-r border-[#133863]">NO</th>
                <th className="p-4 border-r border-[#133863]">NAMA PEKERJAAN</th>
                <th className="p-4 border-r border-[#133863]">NO SURAT PERJANJIAN / SPBJ</th>
                <th className="p-4 border-r border-[#133863]">NILAI KONTRAK</th>
                <th className="p-4 border-r border-[#133863]">TANGGAL MULAI</th>
                <th className="p-4 border-r border-[#133863]">TANGGAL AKHIR</th>
                <th className="p-4 text-center">STATUS / AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredSpbj.map((spbj, index) => {
                const daysLeft = calculateDaysRemaining(spbj.contractEndDate);

                return (
                  <tr 
                    key={spbj.id} 
                    className={`hover:bg-amber-50/50 dark:hover:bg-slate-800/60 transition-colors ${
                      index % 2 === 1 ? 'bg-slate-50/80 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* NO */}
                    <td className="p-4 text-center font-mono font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800">
                      {index + 1}
                    </td>

                    {/* NAMA PEKERJAAN */}
                    <td className="p-4 font-medium text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800 leading-relaxed">
                      {spbj.projectName}
                      <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                        UP3: {spbj.up3Name}
                      </span>
                    </td>

                    {/* NO SURAT PERJANJIAN / SPBJ */}
                    <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                      {spbj.spbjNumber}
                    </td>

                    {/* NILAI KONTRAK */}
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                      {spbj.contractValue}
                    </td>

                    {/* TANGGAL MULAI */}
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                      {formatDateDisplay(spbj.startDate || '2026-08-19')}
                    </td>

                    {/* TANGGAL AKHIR */}
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                      {formatDateDisplay(spbj.contractEndDate)}
                    </td>

                    {/* STATUS / AKSI */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {getStatusBadge(spbj.contractEndDate, spbj.status)}
                        <button
                          onClick={() => {
                            if (onOpenSummary) {
                              onOpenSummary(spbj.id);
                            } else if (setActiveTab) {
                              setActiveTab('spbj-summary');
                            }
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/40 font-bold rounded text-[10px] transition-colors flex items-center gap-1"
                          title="Lihat Rangkuman 360° SPBJ ini"
                        >
                          <Eye className="w-3 h-3" />
                          Rangkuman
                        </button>
                        <button
                          onClick={() => {
                            setEditingSpbj(spbj);
                            setEditDateInput(spbj.contractEndDate);
                          }}
                          className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded text-[10px] transition-colors"
                          title="Perpanjang / Addendum Tanggal Akhir"
                        >
                          Addendum
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Addendum / Perpanjangan Tanggal Akhir Kontrak */}
      {editingSpbj && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Addendum / Perpanjangan Tanggal Akhir Kontrak
            </h3>
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
              <p>NO SPBJ: <strong className="text-slate-900 dark:text-white font-mono">{editingSpbj.spbjNumber}</strong></p>
              <p>Pekerjaan: <strong className="text-slate-900 dark:text-white">{editingSpbj.projectName}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Akhir Kontrak Baru (Addendum)
              </label>
              <input
                type="date"
                value={editDateInput}
                onChange={(e) => setEditDateInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingSpbj(null)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEditDate}
                className="px-4 py-2 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg"
              >
                Simpan Tanggal Akhir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

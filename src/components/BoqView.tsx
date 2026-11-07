import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  PieChart, 
  Trash2, 
  Edit3,
  X,
  Building,
  Layers
} from 'lucide-react';
import { BoqItem, SpbjContract } from '../types';
import { exportBoqPDF } from '../utils/pdfExport';

interface BoqViewProps {
  boqItems: BoqItem[];
  spbjList: SpbjContract[];
  onAddBoqItem: (newItem: BoqItem) => void;
  onUpdateBoqItem: (updatedItem: BoqItem) => void;
  onDeleteBoqItem: (id: string) => void;
}

export const BoqView: React.FC<BoqViewProps> = ({
  boqItems,
  spbjList,
  onAddBoqItem,
  onUpdateBoqItem,
  onDeleteBoqItem,
}) => {
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BoqItem | null>(null);

  // Form State for Add
  const [formItemCode, setFormItemCode] = useState('');
  const [formSpbjId, setFormSpbjId] = useState(spbjList[0]?.id || 'SPBJ-001');
  const [formCategory, setFormCategory] = useState('Pekerjaan JTM (Jaringan Tegangan Menengah)');
  const [formMaterialOrWork, setFormMaterialOrWork] = useState('');
  const [formUnit, setFormUnit] = useState('btg');
  const [formContractVolume, setFormContractVolume] = useState<number>(0);
  const [formRealizedVolume, setFormRealizedVolume] = useState<number>(0);
  const [formUnitPrice, setFormUnitPrice] = useState<number>(0);

  // Form State for Edit Realization
  const [editRealizedVolume, setEditRealizedVolume] = useState<number>(0);

  // Filter Items
  const filteredItems = boqItems.filter((item) => {
    const matchesSpbj = selectedSpbjId === 'all' || item.spbjId === selectedSpbjId;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.materialOrWork.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpbj && matchesCategory && matchesSearch;
  });

  // Calculate Summary Metrics
  const totalContractValue = filteredItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalRealizedValue = filteredItems.reduce((acc, item) => acc + item.realizedPrice, 0);
  const remainingValue = totalContractValue - totalRealizedValue;
  const overallProgressPercentage = totalContractValue > 0 
    ? (totalRealizedValue / totalContractValue) * 100 
    : 0;

  // Categories list
  const categoriesList = Array.from(new Set(boqItems.map(i => i.category)));

  // Format IDR Helper
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMaterialOrWork.trim() || formContractVolume <= 0) return;

    const totalPrice = formContractVolume * formUnitPrice;
    const realizedPrice = formRealizedVolume * formUnitPrice;

    const newItem: BoqItem = {
      id: `BOQ-${Date.now().toString().slice(-4)}`,
      itemCode: formItemCode.trim() || `BOQ-${Math.floor(100 + Math.random() * 900)}`,
      spbjId: formSpbjId,
      category: formCategory,
      materialOrWork: formMaterialOrWork.trim(),
      unit: formUnit,
      contractVolume: Number(formContractVolume),
      realizedVolume: Number(formRealizedVolume),
      unitPrice: Number(formUnitPrice),
      totalPrice,
      realizedPrice,
    };

    onAddBoqItem(newItem);
    setIsAddModalOpen(false);

    // Reset Form
    setFormItemCode('');
    setFormMaterialOrWork('');
    setFormContractVolume(0);
    setFormRealizedVolume(0);
    setFormUnitPrice(0);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const newRealizedVol = Number(editRealizedVolume);
    const newRealizedPrice = newRealizedVol * editingItem.unitPrice;

    const updatedItem: BoqItem = {
      ...editingItem,
      realizedVolume: newRealizedVol,
      realizedPrice: newRealizedPrice,
    };

    onUpdateBoqItem(updatedItem);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            <span>Bill of Quantities (BOQ) & RAB Pekerjaan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola rincian volume kontrak, harga satuan, realisasi progres fisik, dan total nilai SPBJ PLN / Client.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportBoqPDF(boqItems, spbjList, selectedSpbjId)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF BOQ</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item BOQ</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Anggaran Kontrak BOQ</span>
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatRupiah(totalContractValue)}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            {filteredItems.length} Item Pekerjaan Terdaftar
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Realisasi Biaya Lapangan</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatRupiah(totalRealizedValue)}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            {overallProgressPercentage.toFixed(1)}% dari Total Kontrak
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Sisa Anggaran Belum Terpakai</span>
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {formatRupiah(remainingValue)}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            {(100 - overallProgressPercentage).toFixed(1)}% Sisa Alokasi Biaya
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Rata-Rata Progres Fisik BOQ</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {overallProgressPercentage.toFixed(1)}%
            </span>
          </div>
          {/* Progres Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgressPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* SPBJ Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSpbjId}
              onChange={(e) => setSelectedSpbjId(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="all">Semua Kontrak SPBJ</option>
              {spbjList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.spbjNumber} ({s.up3Name})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="all">Semua Kategori Pekerjaan</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari kode/uraian pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
      </div>

      {/* BOQ Items Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#002060] text-white uppercase text-[11px] font-bold">
                <th className="p-3.5 text-center">NO</th>
                <th className="p-3.5">KODE</th>
                <th className="p-3.5">KATEGORI & URAIAN PEKERJAAN</th>
                <th className="p-3.5 text-center">SATUAN</th>
                <th className="p-3.5 text-right">VOL KONTRAK</th>
                <th className="p-3.5 text-right">VOL REALISASI</th>
                <th className="p-3.5 text-center">PROGRES (%)</th>
                <th className="p-3.5 text-right">HARGA SATUAN (RP)</th>
                <th className="p-3.5 text-right">TOTAL KONTRAK (RP)</th>
                <th className="p-3.5 text-right">REALISASI (RP)</th>
                <th className="p-3.5 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Tidak ada data item BOQ yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const progressPct = item.contractVolume > 0 
                    ? Math.min(100, (item.realizedVolume / item.contractVolume) * 100) 
                    : 0;

                  const spbj = spbjList.find(s => s.id === item.spbjId);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-3.5 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {item.itemCode}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 block font-semibold">
                          {item.category} {spbj ? `· ${spbj.up3Name}` : ''}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                          {item.materialOrWork}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-600 dark:text-slate-300">
                        {item.unit}
                      </td>
                      <td className="p-3.5 text-right font-mono font-semibold">
                        {item.contractVolume.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.realizedVolume.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-xs font-mono">{progressPct.toFixed(1)}%</span>
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                            <div 
                              className={`h-full rounded-full ${progressPct >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-right font-mono">
                        {formatRupiah(item.unitPrice)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatRupiah(item.totalPrice)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(item.realizedPrice)}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setEditRealizedVolume(item.realizedVolume);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Update Realisasi Volume"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus item BOQ "${item.materialOrWork}"?`)) {
                                onDeleteBoqItem(item.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Item BOQ Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="bg-[#002060] p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Tambah Item BOQ & RAB Baru</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kode Item BOQ
                  </label>
                  <input
                    type="text"
                    placeholder="misal: BOQ-JTM-04"
                    value={formItemCode}
                    onChange={(e) => setFormItemCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kontrak SPBJ PLN / UP3
                  </label>
                  <select
                    value={formSpbjId}
                    onChange={(e) => setFormSpbjId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    {spbjList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.spbjNumber} ({s.up3Name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Kategori Pekerjaan
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Pekerjaan JTM (Jaringan Tegangan Menengah)">Pekerjaan JTM (Jaringan Tegangan Menengah)</option>
                  <option value="Pekerjaan JTR (Jaringan Tegangan Rendah)">Pekerjaan JTR (Jaringan Tegangan Rendah)</option>
                  <option value="Pekerjaan Gardu Distribusi">Pekerjaan Gardu Distribusi</option>
                  <option value="Pekerjaan Sipil / Pondasi">Pekerjaan Sipil / Pondasi</option>
                  <option value="Pekerjaan Penyambungan / SR">Pekerjaan Penyambungan / SR</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Uraian Pekerjaan / Material <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Deskripsi pekerjaan atau material..."
                  value={formMaterialOrWork}
                  onChange={(e) => setFormMaterialOrWork(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="btg, mtr, set..."
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Volume Kontrak <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={formContractVolume}
                    onChange={(e) => setFormContractVolume(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Realisasi Volume Initial
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formRealizedVolume}
                    onChange={(e) => setFormRealizedVolume(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Harga Satuan Kontrak (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formUnitPrice}
                  onChange={(e) => setFormUnitPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Simpan Item BOQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Realisasi Volume */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="bg-[#002060] p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Update Realisasi Volume Lapangan</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block">
                  {editingItem.itemCode} · {editingItem.category}
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {editingItem.materialOrWork}
                </p>
                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Volume Kontrak: <strong>{editingItem.contractVolume} {editingItem.unit}</strong></span>
                  <span>Harga Satuan: <strong>{formatRupiah(editingItem.unitPrice)}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Volume Realisasi Terkini ({editingItem.unit}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={editRealizedVolume}
                  onChange={(e) => setEditRealizedVolume(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-bold font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Simpan Realisasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

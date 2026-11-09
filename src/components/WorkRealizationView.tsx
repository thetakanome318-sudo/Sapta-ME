import React, { useState } from 'react';
import { TrendingUp, FileSpreadsheet, Download, Plus, Search, Filter, Edit3, Trash2, CheckCircle2, X } from 'lucide-react';
import { SpbjContract } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface RealizationItem {
  id: string;
  spbjId: string;
  description: string;
  unit: string;
  rabVolume: string;
  realizationVolume: string;
  totalRp: number;
  weightPercent: number;
  isSubItem?: boolean;
}

interface WorkRealizationViewProps {
  spbjList?: SpbjContract[];
}

const DEFAULT_REALIZATION_ITEMS: RealizationItem[] = [
  { id: 'RLZ-001', spbjId: 'SPBJ-001', description: 'Pemasangan Tiang Besi 12 Mtr 200 daN', unit: 'btg', rabVolume: '120', realizationVolume: '120', totalRp: 0, weightPercent: 0 },
  { id: 'RLZ-002', spbjId: 'SPBJ-001', description: '- Pemasangan tiang pada tanah biasa', unit: 'btg', rabVolume: '40', realizationVolume: '40', totalRp: 0, weightPercent: 0, isSubItem: true },
  { id: 'RLZ-003', spbjId: 'SPBJ-001', description: '- Pemasangan tiang pada tanah cadas', unit: 'btg', rabVolume: '30', realizationVolume: '30', totalRp: 0, weightPercent: 0, isSubItem: true },
  { id: 'RLZ-004', spbjId: 'SPBJ-001', description: '- Pemasangan tiang pada tanah karang keras', unit: 'btg', rabVolume: '50', realizationVolume: '50', totalRp: 92739200, weightPercent: 30.53, isSubItem: true },
  { id: 'RLZ-005', spbjId: 'SPBJ-001', description: 'Konduktor A3C-S 70 mm²', unit: 'kms', rabVolume: '15.5', realizationVolume: '15.5', totalRp: 25668461, weightPercent: 8.45 },
  { id: 'RLZ-006', spbjId: 'SPBJ-001', description: 'Lightning Arrester 20 kV 5 kA', unit: 'set', rabVolume: '6', realizationVolume: '6', totalRp: 262800, weightPercent: 0.09 },
  { id: 'RLZ-007', spbjId: 'SPBJ-001', description: 'Cut Out 20 KV + Fuse Link', unit: 'set', rabVolume: '6', realizationVolume: '6', totalRp: 262800, weightPercent: 0.09 },
  { id: 'RLZ-008', spbjId: 'SPBJ-001', description: 'Isolator Tumpu (Pin Post) + Asesories', unit: 'bh', rabVolume: '180', realizationVolume: '180', totalRp: 3855280, weightPercent: 1.27 },
  { id: 'RLZ-009', spbjId: 'SPBJ-001', description: 'Isolator Tarik (Suspension) + Asesories', unit: 'bh', rabVolume: '90', realizationVolume: '90', totalRp: 2426400, weightPercent: 0.80 },
  { id: 'RLZ-010', spbjId: 'SPBJ-001', description: 'LBS Motorized non RTU', unit: 'unit', rabVolume: '1', realizationVolume: '0', totalRp: 0, weightPercent: 0 },
  { id: 'RLZ-011', spbjId: 'SPBJ-001', description: 'Kontruksi TM-1 ( Konstruksi T. Penumpu )', unit: 'set', rabVolume: '60', realizationVolume: '60', totalRp: 52054340, weightPercent: 17.14 },
  { id: 'RLZ-012', spbjId: 'SPBJ-001', description: 'Kontruksi TM-3 ( Konstruksi T. Awal )', unit: 'set', rabVolume: '8', realizationVolume: '8', totalRp: 4236368, weightPercent: 1.39 },
  { id: 'RLZ-013', spbjId: 'SPBJ-001', description: 'Kontruksi TM-4 ( Konstruksi T. Akhir )', unit: 'set', rabVolume: '8', realizationVolume: '8', totalRp: 4200790, weightPercent: 1.38 },
  { id: 'RLZ-014', spbjId: 'SPBJ-001', description: 'Kontruksi TM-5 ( Konstruksi T. Tarik Ganda )', unit: 'set', rabVolume: '12', realizationVolume: '12', totalRp: 15263162, weightPercent: 5.03 },
  { id: 'RLZ-015', spbjId: 'SPBJ-002', description: 'Pengadaan & Pemasangan Trafo 50 kVA 20kV', unit: 'unit', rabVolume: '2', realizationVolume: '2', totalRp: 85000000, weightPercent: 28.00 },
  { id: 'RLZ-016', spbjId: 'SPBJ-002', description: 'Pemasangan JTR Kabel Twisted 3x70 + 1x50 mm²', unit: 'kms', rabVolume: '8.2', realizationVolume: '8.2', totalRp: 45000000, weightPercent: 14.80 },
];

export const WorkRealizationView: React.FC<WorkRealizationViewProps> = ({ spbjList = [] }) => {
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>('all');
  const [realizationItems, setRealizationItems] = useState<RealizationItem[]>(DEFAULT_REALIZATION_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formSpbjId, setFormSpbjId] = useState(spbjList[0]?.id || 'SPBJ-001');
  const [formDescription, setFormDescription] = useState('');
  const [formUnit, setFormUnit] = useState('set');
  const [formRabVolume, setFormRabVolume] = useState('10');
  const [formRealizationVolume, setFormRealizationVolume] = useState('10');
  const [formTotalRp, setFormTotalRp] = useState<number>(5000000);
  const [formWeightPercent, setFormWeightPercent] = useState<number>(2.5);

  const selectedSpbj = spbjList.find(s => s.id === selectedSpbjId) || spbjList[0];

  const filteredItems = realizationItems.filter(item => {
    const matchesSpbj = selectedSpbjId === 'all' || item.spbjId === selectedSpbjId;
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpbj && matchesSearch;
  });

  const totalRpSum = filteredItems.reduce((sum, item) => sum + item.totalRp, 0);
  const totalWeightPercent = filteredItems.reduce((sum, item) => sum + item.weightPercent, 0);
  const completedItemsCount = filteredItems.filter(item => item.totalRp > 0).length;

  const formatRupiah = (val: number) => {
    if (val === 0) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', '').trim();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) return;

    const newItem: RealizationItem = {
      id: `RLZ-${Date.now().toString().slice(-4)}`,
      spbjId: formSpbjId,
      description: formDescription.trim(),
      unit: formUnit.trim(),
      rabVolume: formRabVolume.trim(),
      realizationVolume: formRealizationVolume.trim(),
      totalRp: Number(formTotalRp),
      weightPercent: Number(formWeightPercent),
      isSubItem: formDescription.trim().startsWith('-'),
    };

    setRealizationItems([...realizationItems, newItem]);
    setIsAddModalOpen(false);

    // Reset Form
    setFormDescription('');
    setFormTotalRp(5000000);
    setFormWeightPercent(2.5);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Hapus item realisasi ini?')) {
      setRealizationItems(realizationItems.filter(i => i.id !== id));
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header
    doc.setFillColor(211, 47, 47); // Red accent
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PT SAPTA MANUNGGAL KARYA - DIVISI ME', 14, 8);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.text('LAPORAN DETAIL REALISASI PEKERJAAN & PROGRES FISIK', 14, 22);

    if (selectedSpbj) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`SPBJ: ${selectedSpbj.spbjNumber} | UP3: ${selectedSpbj.up3Name} | Proyek: ${selectedSpbj.projectName}`, 14, 27);
    }

    const tableData = filteredItems.map((item) => [
      item.description,
      item.unit || '-',
      item.rabVolume || '-',
      item.realizationVolume || '-',
      item.totalRp > 0 ? `Rp ${item.totalRp.toLocaleString('id-ID')}` : '-',
      `${item.weightPercent.toFixed(2).replace('.', ',')}%`,
    ]);

    // Total row
    tableData.push([
      'TOTAL',
      '-',
      '-',
      '-',
      `Rp ${totalRpSum.toLocaleString('id-ID')}`,
      `${totalWeightPercent.toFixed(2).replace('.', ',')}%`,
    ]);

    autoTable(doc, {
      startY: 32,
      head: [['URAIAN PEKERJAAN', 'SAT', 'RAB', 'REALISASI', 'JUMLAH (Rp)', 'BOBOT (%)']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [211, 47, 47],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
    });

    doc.save(`Realisasi_Pekerjaan_${selectedSpbj?.spbjNumber || 'Semua'}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-rose-600" />
            <span>Realisasi Pekerjaan & Progres Fisik</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Laporan detail realisasi item pekerjaan, perbandingan RAB vs Realisasi, dan bobot persentase penyelesaian per SPBJ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/20 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md shadow-amber-400/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Input Realisasi per SPBJ</span>
          </button>
        </div>
      </div>

      {/* SPBJ Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">Pilih Kontrak SPBJ:</label>
          <select
            value={selectedSpbjId}
            onChange={(e) => setSelectedSpbjId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 w-full md:w-80"
          >
            <option value="all">Semua Kontrak SPBJ ({spbjList.length} Proyek)</option>
            {spbjList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari uraian pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Top Stat Cards matching screenshot layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">TOTAL NILAI REALISASI</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              Rp {totalRpSum.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <span>Progress: {totalWeightPercent > 0 ? `${totalWeightPercent.toFixed(0)}%` : '100%'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">ITEM PEKERJAAN SELESAI</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {completedItemsCount} Items
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
            <span>Sesuai Kontrak</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">LOKASI UNIT</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white uppercase">
              {selectedSpbj ? selectedSpbj.up3Name : 'UP3 TUAL'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <span>{selectedSpbj ? selectedSpbj.projectName : 'Lisdes TA. 2026'}</span>
          </div>
        </div>
      </div>

      {/* Main Table Content - Red Header matching attached screenshot */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#D32F2F] text-white font-bold uppercase tracking-wider text-[11px] border-b border-red-700">
                <th rowSpan={2} className="p-4 border-r border-red-500/50 min-w-[280px] text-center">URAIAN PEKERJAAN</th>
                <th rowSpan={2} className="p-3 border-r border-red-500/50 text-center w-16">SAT</th>
                <th colSpan={2} className="p-2 border-b border-r border-red-500/50 text-center">JUMLAH</th>
                <th rowSpan={2} className="p-4 border-r border-red-500/50 text-center min-w-[160px]">JUMLAH (RP)</th>
                <th rowSpan={2} className="p-4 border-r border-red-500/50 text-center w-24">BOBOT (%)</th>
                <th rowSpan={2} className="p-4 text-center w-16">AKSI</th>
              </tr>
              <tr className="bg-[#D32F2F] text-white font-bold uppercase tracking-wider text-[10px] border-b border-red-700">
                <th className="p-2 border-r border-red-500/50 text-center w-20">RAB</th>
                <th className="p-2 border-r border-red-500/50 text-center w-24">REALISASI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                    Belum ada data realisasi pekerjaan terdaftar untuk SPBJ ini.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-red-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                      index % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-900/30' : 'bg-white dark:bg-slate-900'
                    }`}
                  >
                    <td className={`p-3 border-r border-slate-200 dark:border-slate-800 font-semibold ${item.isSubItem ? 'pl-8 text-slate-600 dark:text-slate-300' : 'pl-4 text-slate-900 dark:text-white'}`}>
                      {item.description}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono text-slate-600 dark:text-slate-400">
                      {item.unit || '-'}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono text-slate-600 dark:text-slate-400">
                      {item.rabVolume || '-'}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono text-slate-600 dark:text-slate-400">
                      {item.realizationVolume || '-'}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-mono font-bold text-right px-6">
                      {item.totalRp > 0 ? (
                        <div className="flex justify-between items-center w-full">
                          <span className="text-slate-400 font-normal">Rp</span>
                          <span className="text-slate-900 dark:text-white font-bold">{formatRupiah(item.totalRp)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-center block">-</span>
                      )}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-mono font-bold text-right px-6 text-slate-700 dark:text-slate-300">
                      {item.weightPercent.toFixed(2).replace('.', ',')}%
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        title="Hapus Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {/* Total Row */}
              <tr className="bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-white uppercase text-xs">
                <td colSpan={4} className="p-4 border-r border-slate-300 dark:border-slate-700 text-center tracking-widest font-extrabold">
                  TOTAL REALISASI SPBJ
                </td>
                <td className="p-4 border-r border-slate-300 dark:border-slate-700 font-mono font-black text-right px-6">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-slate-500">Rp</span>
                    <span className="text-rose-600 dark:text-rose-400 font-black text-sm">{totalRpSum.toLocaleString('id-ID')}</span>
                  </div>
                </td>
                <td className="p-4 border-r border-slate-300 dark:border-slate-700 font-mono font-black text-right px-6 text-rose-600 dark:text-rose-400 text-sm">
                  {totalWeightPercent.toFixed(2).replace('.', ',')}%
                </td>
                <td className="p-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Realisasi Pekerjaan Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="bg-[#D32F2F] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Input Realisasi Pekerjaan per SPBJ</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Target Kontrak SPBJ *
                </label>
                <select
                  value={formSpbjId}
                  onChange={(e) => setFormSpbjId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {spbjList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Uraian Pekerjaan / Material *
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Pemasangan Tiang Besi 12 Mtr atau Konduktor A3C-S 70 mm²..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Satuan (Sat)</label>
                  <input
                    type="text"
                    required
                    placeholder="btg, kms, set..."
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vol RAB</label>
                  <input
                    type="text"
                    placeholder="100"
                    value={formRabVolume}
                    onChange={(e) => setFormRabVolume(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vol Realisasi</label>
                  <input
                    type="text"
                    placeholder="100"
                    value={formRealizationVolume}
                    onChange={(e) => setFormRealizationVolume(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jumlah Total (Rp)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10000}
                    value={formTotalRp}
                    onChange={(e) => setFormTotalRp(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bobot Persentase (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    step={0.01}
                    value={formWeightPercent}
                    onChange={(e) => setFormWeightPercent(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Realisasi Pekerjaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Download, 
  Search, 
  Building, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { MaterialBongkarItem, SpbjContract } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface MaterialBongkarViewProps {
  items: MaterialBongkarItem[];
  spbjList: SpbjContract[];
  onAddItem: (newItem: MaterialBongkarItem) => void;
  onDeleteItem: (id: string) => void;
}

export const MaterialBongkarView: React.FC<MaterialBongkarViewProps> = ({
  items,
  spbjList,
  onAddItem,
  onDeleteItem,
}) => {
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [formItemCode, setFormItemCode] = useState('');
  const [formSpbjId, setFormSpbjId] = useState(spbjList[0]?.id || 'SPBJ-001');
  const [formCategory, setFormCategory] = useState('Bongkaran JTM');
  const [formMaterialName, setFormMaterialName] = useState('');
  const [formUnit, setFormUnit] = useState('btg');
  const [formVolume, setFormVolume] = useState<number>(1);
  const [formCondition, setFormCondition] = useState<MaterialBongkarItem['condition']>('Baik / Layak Pakai');
  const [formWarehouse, setFormWarehouse] = useState('Gudang Tual');
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesSpbj = selectedSpbjId === 'all' || item.spbjId === selectedSpbjId;
    const matchesCond = selectedCondition === 'all' || item.condition === selectedCondition;
    const matchesSearch =
      item.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpbj && matchesCond && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMaterialName.trim() || formVolume <= 0) return;

    const newItem: MaterialBongkarItem = {
      id: `BKG-${Date.now().toString().slice(-4)}`,
      itemCode: formItemCode.trim() || `BKG-${Math.floor(100 + Math.random() * 900)}`,
      spbjId: formSpbjId,
      category: formCategory,
      materialName: formMaterialName.trim(),
      unit: formUnit.trim(),
      volumeBongkar: Number(formVolume),
      condition: formCondition,
      warehouseLocation: formWarehouse.trim(),
      dateBongkar: formDate,
      notes: formNotes.trim(),
    };

    onAddItem(newItem);
    setIsAddModalOpen(false);

    // Reset
    setFormItemCode('');
    setFormMaterialName('');
    setFormVolume(1);
    setFormNotes('');
  };

  const exportPdfReport = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const selectedSpbj = spbjList.find(s => s.id === selectedSpbjId);

    // Header
    doc.setFillColor(0, 32, 96);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 12, 'F');
    doc.setTextColor(0, 32, 96);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PT SAPTA MANUNGGAL KARYA', 14, 22);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Laporan Material Bongkar & Sisa Hasil Pemasangan Lapangan', 14, 27);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN MATERIAL BONGKAR EKSISTING PROYEK ME', 14, 36);

    const tableData = filteredItems.map((item, idx) => {
      const spbj = spbjList.find(s => s.id === item.spbjId);
      return [
        idx + 1,
        item.itemCode,
        item.category,
        item.materialName,
        item.unit,
        item.volumeBongkar.toLocaleString('id-ID'),
        item.condition,
        item.warehouseLocation,
        spbj ? spbj.up3Name : '-',
        item.dateBongkar,
      ];
    });

    autoTable(doc, {
      startY: 42,
      head: [['NO', 'KODE', 'KATEGORI', 'NAMA MATERIAL BONGKAR', 'SAT', 'VOLUME', 'KONDISI', 'LOKASI GUDANG / SITE', 'UP3 / PROYEK', 'TANGGAL']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 32, 96],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
    });

    doc.save(`Laporan_Material_Bongkar_SMK_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            <span>Monitoring Material Bongkar & Eksisting</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pencatatan material bongkaran hasil penggantian jaringan lama (tiang, trafo, konduktor, panel) dan inventarisasi gudang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportPdfReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Material Bongkar</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Material Bongkar</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Jenis Material Bongkar</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredItems.length} Item</p>
          <span className="text-[11px] text-slate-400">Tercatat di sistem monitoring lapangan</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Kondisi Baik / Layak Pakai</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {filteredItems.filter(i => i.condition === 'Baik / Layak Pakai').length} Item
          </p>
          <span className="text-[11px] text-slate-400">Siap digunakan kembali atau dikembalikan ke PLN</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Kondisi Rusak / Scrap</span>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {filteredItems.filter(i => i.condition === 'Rusak / Scrap').length} Item
          </p>
          <span className="text-[11px] text-slate-400">Perlu berita acara pemusnahan / pelaporan</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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

          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="all">Semua Kondisi Material</option>
              <option value="Baik / Layak Pakai">Baik / Layak Pakai</option>
              <option value="Rusak / Scrap">Rusak / Scrap</option>
              <option value="Perlu Perbaikan">Perlu Perbaikan</option>
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama material / gudang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#002060] text-white uppercase text-[11px] font-bold">
                <th className="p-3.5 text-center">NO</th>
                <th className="p-3.5">KODE</th>
                <th className="p-3.5">KATEGORI & NAMA MATERIAL BONGKAR</th>
                <th className="p-3.5 text-center">SATUAN</th>
                <th className="p-3.5 text-right">VOLUME</th>
                <th className="p-3.5 text-center">KONDISI</th>
                <th className="p-3.5">LOKASI GUDANG / SITE</th>
                <th className="p-3.5">TANGGAL BONGKAR</th>
                <th className="p-3.5 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    Tidak ada data material bongkar yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const spbj = spbjList.find(s => s.id === item.spbjId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {item.itemCode}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 block font-semibold">
                          {item.category} {spbj ? `· ${spbj.up3Name}` : ''}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                          {item.materialName}
                        </span>
                        {item.notes && (
                          <span className="text-[10px] text-slate-500 italic block mt-0.5">{item.notes}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-600 dark:text-slate-300">
                        {item.unit}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {item.volumeBongkar.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                          item.condition === 'Baik / Layak Pakai' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                          item.condition === 'Rusak / Scrap' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {item.warehouseLocation}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">
                        {item.dateBongkar}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus pencatatan material bongkar "${item.materialName}"?`)) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal: Tambah Material Bongkar */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="bg-[#002060] p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Pencatatan Material Bongkaran Baru</span>
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
                    Kode Item
                  </label>
                  <input
                    type="text"
                    placeholder="misal: BKG-04"
                    value={formItemCode}
                    onChange={(e) => setFormItemCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kontrak SPBJ Induk
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kategori Bongkaran
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Bongkaran JTM">Bongkaran JTM</option>
                    <option value="Bongkaran JTR">Bongkaran JTR</option>
                    <option value="Bongkaran Trafo / Gardu">Bongkaran Trafo / Gardu</option>
                    <option value="Bongkaran Panel / Aksesoris">Bongkaran Panel / Aksesoris</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kondisi Material
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Baik / Layak Pakai">Baik / Layak Pakai</option>
                    <option value="Rusak / Scrap">Rusak / Scrap</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Nama Material / Uraian Bongkar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Tiang Besi Bekas 11 Meter..."
                  value={formMaterialName}
                  onChange={(e) => setFormMaterialName(e.target.value)}
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
                    placeholder="btg, mtr, unit..."
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Volume <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={formVolume}
                    onChange={(e) => setFormVolume(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Tanggal Bongkar
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Lokasi Penyimpanan Gudang / Site
                </label>
                <input
                  type="text"
                  placeholder="misal: Gudang Ambon / Gudang Tual..."
                  value={formWarehouse}
                  onChange={(e) => setFormWarehouse(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Keterangan / Catatan
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan kondisi material bongkaran..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                  Simpan Pencatatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

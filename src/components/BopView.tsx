import React, { useState } from 'react';
import { BopItem, SpbjContract } from '../types';
import { 
  Receipt, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Eye, 
  Fuel, 
  Utensils, 
  Home, 
  FileSpreadsheet, 
  Building2,
  X,
  UserCheck
} from 'lucide-react';

interface BopViewProps {
  bopItems: BopItem[];
  spbjList: SpbjContract[];
  onAddBopItem: (item: Omit<BopItem, 'id'>) => void;
  onUpdateBopStatus: (id: string, status: BopItem['status']) => void;
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const BopView: React.FC<BopViewProps> = ({
  bopItems,
  spbjList,
  onAddBopItem,
  onUpdateBopStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [spbjFilter, setSpbjFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  // Form State
  const [voucherNumber, setVoucherNumber] = useState(`BOP/ME/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<BopItem['category']>('Konsumsi & Makan Tim');
  const [spbjId, setSpbjId] = useState(spbjList[0]?.id || '');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(1500000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submittedBy, setSubmittedBy] = useState('');
  const [approvedBy, setApprovedBy] = useState('Budi Santoso (Project Manager)');
  const [receiptPhotoUrl, setReceiptPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

  const filteredItems = bopItems.filter((item) => {
    const matchesSearch =
      item.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSpbj = spbjFilter === 'ALL' || item.spbjId === spbjFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesSpbj && matchesStatus;
  });

  const totalApprovedAmount = bopItems
    .filter((i) => i.status === 'Disetujui')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPendingAmount = bopItems
    .filter((i) => i.status === 'Menunggu Persetujuan')
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingCount = bopItems.filter((i) => i.status === 'Menunggu Persetujuan').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !submittedBy) return;

    const targetSpbj = spbjList.find((s) => s.id === spbjId);

    onAddBopItem({
      voucherNumber,
      category,
      spbjId,
      projectName: targetSpbj?.projectName || 'Proyek Kelistrikan ME',
      description,
      amount,
      date,
      submittedBy,
      approvedBy,
      status: 'Menunggu Persetujuan',
      receiptPhotoUrl: receiptPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
      notes: notes || undefined,
    });

    // Reset Form
    setDescription('');
    setAmount(1500000);
    setSubmittedBy('');
    setNotes('');
    setReceiptPhotoUrl('');
    setIsAddModalOpen(false);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rekapitulasi Biaya Operasional Proyek (BOP) - PT Sapta Manunggal Karya</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
            h2 { margin-bottom: 2px; color: #0f172a; }
            h4 { margin-top: 0; color: #64748b; font-weight: normal; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .right { text-align: right; }
            .total-box { margin-top: 15px; text-align: right; font-weight: bold; font-size: 13px; }
            .badge { padding: 2px 5px; border-radius: 4px; font-size: 10px; font-weight: bold; }
            .disetujui { background: #dcfce7; color: #166534; }
            .pending { background: #fef3c7; color: #92400e; }
          </style>
        </head>
        <body>
          <h2>PT SAPTA MANUNGGAL KARYA - DIVISI ME</h2>
          <h4>Laporan Rekapitulasi Biaya Operasional Proyek (BOP Lapangan)</h4>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>No Voucher</th>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Proyek / SPBJ</th>
                <th>Uraian Biaya</th>
                <th>Pengaju</th>
                <th class="right">Jumlah (Rp)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredItems
                .map(
                  (item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><b>${item.voucherNumber}</b></td>
                  <td>${item.date}</td>
                  <td>${item.category}</td>
                  <td>${item.projectName}</td>
                  <td>${item.description}</td>
                  <td>${item.submittedBy}</td>
                  <td style="text-align: right;">${formatRupiah(item.amount)}</td>
                  <td><span class="badge ${item.status === 'Disetujui' ? 'disetujui' : 'pending'}">${item.status}</span></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="total-box">
            Total Biaya Disetujui: ${formatRupiah(totalApprovedAmount)}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Receipt className="w-64 h-64 text-amber-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              Manajemen Pengeluaran Kas Kecil & Operasional Lapangan
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Biaya Operasional Proyek (BOP)
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pencatatan & klaim pengeluaran operasional proyek (konsumsi tim, BBM, mess, koordinasi perizinan lokal, ATK site).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-sm border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Cetak Rekap PDF
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              Input Pengajuan BOP
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">{formatRupiah(totalApprovedAmount)}</div>
            <div className="text-slate-400 text-xs">Total Realisasi BOP Disetujui</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">{formatRupiah(totalPendingAmount)}</div>
            <div className="text-slate-400 text-xs">Menunggu Persetujuan ({pendingCount} Item)</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{bopItems.length}</div>
            <div className="text-slate-400 text-xs">Total Voucher Terdaftar</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-400">
              {bopItems.filter((i) => i.status === 'Disetujui').length}
            </div>
            <div className="text-slate-400 text-xs">Klaim Terverifikasi</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari No Voucher, Uraian, Pengaju..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Kategori BOP</option>
              <option value="Konsumsi & Makan Tim">Konsumsi & Makan Tim</option>
              <option value="BBM & Tol Kendaraan">BBM & Tol Kendaraan</option>
              <option value="Sewa Mess & Akomodasi">Sewa Mess & Akomodasi</option>
              <option value="Perizinan & Koordinasi Lokal">Perizinan & Koordinasi Lokal</option>
              <option value="ATK & Operasional Gudang">ATK & Operasional Gudang</option>
              <option value="Kas Kecil / Lainnya">Kas Kecil / Lainnya</option>
            </select>
          </div>

          <select
            value={spbjFilter}
            onChange={(e) => setSpbjFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua SPBJ Proyek</option>
            {spbjList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.up3Name} - {s.spbjNumber.split('/')[0]}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* BOP Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">No. Voucher & Tanggal</th>
                <th className="px-5 py-3.5 font-semibold">Kategori BOP</th>
                <th className="px-5 py-3.5 font-semibold">Proyek SPBJ & Uraian Biaya</th>
                <th className="px-5 py-3.5 font-semibold text-right">Nilai Biaya (Rp)</th>
                <th className="px-5 py-3.5 font-semibold">Pengaju & Approver</th>
                <th className="px-5 py-3.5 font-semibold text-center">Bukti Nota</th>
                <th className="px-5 py-3.5 font-semibold">Status Persetujuan</th>
                <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    Tidak ada transaksi Biaya Operasional Proyek (BOP) yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const spbj = spbjList.find((s) => s.id === item.spbjId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-amber-400 font-mono text-xs">{item.voucherNumber}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.date}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                          {item.category === 'Konsumsi & Makan Tim' && <Utensils className="w-3 h-3 text-amber-400" />}
                          {item.category === 'BBM & Tol Kendaraan' && <Fuel className="w-3 h-3 text-blue-400" />}
                          {item.category === 'Sewa Mess & Akomodasi' && <Home className="w-3 h-3 text-emerald-400" />}
                          {item.category !== 'Konsumsi & Makan Tim' &&
                            item.category !== 'BBM & Tol Kendaraan' &&
                            item.category !== 'Sewa Mess & Akomodasi' && (
                              <Receipt className="w-3 h-3 text-indigo-400" />
                            )}
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white text-xs">{item.description}</div>
                        {spbj && (
                          <div className="text-[11px] text-blue-400 font-mono mt-0.5 truncate max-w-xs">
                            [{spbj.up3Name}] {spbj.projectName}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="font-bold text-emerald-400 font-mono text-sm">
                          {formatRupiah(item.amount)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs text-slate-200 font-medium">{item.submittedBy}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Appr: {item.approvedBy}</div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setPreviewReceiptUrl(item.receiptPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded border border-slate-700 transition-colors"
                          title="Lihat Bukti Nota Kuitansi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Nota</span>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        {item.status === 'Disetujui' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Disetujui
                          </span>
                        )}
                        {item.status === 'Menunggu Persetujuan' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            Menunggu Approval
                          </span>
                        )}
                        {item.status === 'Ditolak' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <AlertCircle className="w-3 h-3" />
                            Ditolak
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            onUpdateBopStatus(item.id, e.target.value as BopItem['status'])
                          }
                          className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Disetujui">Disetujui</option>
                          <option value="Menunggu Persetujuan">Menunggu Approval</option>
                          <option value="Ditolak">Ditolak</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Receipt Photo Preview */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <span>Verifikasi Bukti Nota / Kuitansi BOP</span>
              </h3>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-800">
              <img
                src={previewReceiptUrl}
                alt="Bukti Kuitansi BOP"
                className="max-h-80 object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <p className="text-xs text-slate-400 text-center">
              Dokumen nota klaim kas kecil telah diverifikasi sesuai rincian pengeluaran operasional proyek.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewReceiptUrl(null)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add BOP Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-white">Input Pengajuan Biaya Operasional (BOP)</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">No. Voucher</label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={voucherNumber}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Kategori BOP *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BopItem['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-500"
                  >
                    <option value="Konsumsi & Makan Tim">Konsumsi & Makan Tim</option>
                    <option value="BBM & Tol Kendaraan">BBM & Tol Kendaraan</option>
                    <option value="Sewa Mess & Akomodasi">Sewa Mess & Akomodasi</option>
                    <option value="Perizinan & Koordinasi Lokal">Perizinan & Koordinasi Lokal</option>
                    <option value="ATK & Operasional Gudang">ATK & Operasional Gudang</option>
                    <option value="Kas Kecil / Lainnya">Kas Kecil / Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Proyek Terkait (SPBJ) *</label>
                  <select
                    value={spbjId}
                    onChange={(e) => setSpbjId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-500"
                  >
                    {spbjList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.up3Name} - {s.spbjNumber.split('/')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Uraian Transaksi / Pengeluaran *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Pembelian Solar Dex Hilux & konsumsi 6 teknisi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nilai Pengeluaran (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Pengaju / Penanggung Jawab *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Pengaju (misal: Pak Karmin)"
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Link URL Foto Nota / Kuitansi</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (atau biarkan default)"
                  value={receiptPhotoUrl}
                  onChange={(e) => setReceiptPhotoUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan persetujuan, rincian tempat pembelian..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors shadow-lg shadow-amber-500/20"
                >
                  Simpan Voucher BOP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

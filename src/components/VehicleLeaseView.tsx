import React, { useState } from 'react';
import { VehicleLease, SpbjContract } from '../types';
import { FileSpreadsheet, DollarSign, Calendar, Building2, MapPin, CheckCircle2, AlertTriangle, Clock, Plus, Search, Filter, Download, FileText } from 'lucide-react';

interface VehicleLeaseViewProps {
  leases: VehicleLease[];
  spbjContracts: SpbjContract[];
  onAddLease: (lease: Omit<VehicleLease, 'id'>) => void;
  onUpdateLeaseStatus: (id: string, status: VehicleLease['status']) => void;
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const VehicleLeaseView: React.FC<VehicleLeaseViewProps> = ({
  leases,
  spbjContracts,
  onAddLease,
  onUpdateLeaseStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [contractNumber, setContractNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Pick-up 4x4 Double Cabin');
  const [monthlyRate, setMonthlyRate] = useState<number>(15000000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [status, setStatus] = useState<VehicleLease['status']>('Aktif');
  const [assignedSite, setAssignedSite] = useState('');
  const [spbjId, setSpbjId] = useState('');
  const [notes, setNotes] = useState('');

  const filteredLeases = leases.filter((l) => {
    const matchesSearch =
      l.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.assignedSite.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMonthlyCost = leases
    .filter((l) => l.status !== 'Selesai Kontrak')
    .reduce((sum, item) => sum + item.monthlyRate, 0);

  const activeCount = leases.filter((l) => l.status === 'Aktif').length;
  const expiringCount = leases.filter((l) => l.status === 'Mendekati Expired').length;
  const finishedCount = leases.filter((l) => l.status === 'Selesai Kontrak').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractNumber || !vendorName || !plateNumber || !spbjId) return;

    onAddLease({
      contractNumber,
      vendorName,
      plateNumber,
      vehicleType,
      monthlyRate,
      startDate,
      endDate,
      status,
      assignedSite: assignedSite || 'Site Proyek',
      spbjId,
      notes: notes || undefined,
    });

    // Reset Form
    setContractNumber('');
    setVendorName('');
    setPlateNumber('');
    setNotes('');
    setAssignedSite('');
    setIsAddModalOpen(false);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Kontrak Sewa Kendaraan - PT Sapta Manunggal Karya</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
            h2 { margin-bottom: 2px; color: #0f172a; }
            h4 { margin-top: 0; color: #64748b; font-weight: normal; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .right { text-align: right; }
            .total-box { margin-top: 15px; text-align: right; font-weight: bold; font-size: 14px; }
            .badge { padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
            .aktif { background: #dcfce7; color: #166534; }
            .expired { background: #fef3c7; color: #92400e; }
          </style>
        </head>
        <body>
          <h2>PT SAPTA MANUNGGAL KARYA - DIVISI ME</h2>
          <h4>Laporan Rekapitulasi Kontrak Sewa Kendaraan Operasional</h4>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>No Kontrak</th>
                <th>Vendor / Rekanan</th>
                <th>Plat & Tipe Unit</th>
                <th>Lokasi Site</th>
                <th>Periode Sewa</th>
                <th className="right">Tarif / Bulan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLeases
                .map(
                  (l, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><b>${l.contractNumber}</b></td>
                  <td>${l.vendorName}</td>
                  <td>${l.plateNumber} - ${l.vehicleType}</td>
                  <td>${l.assignedSite}</td>
                  <td>${l.startDate} s/d ${l.endDate}</td>
                  <td style="text-align: right;">${formatRupiah(l.monthlyRate)}</td>
                  <td><span class="badge ${l.status === 'Aktif' ? 'aktif' : 'expired'}">${l.status}</span></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="total-box">
            Total Estimasi Biaya Sewa Per Bulan: ${formatRupiah(totalMonthlyCost)}
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
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <FileSpreadsheet className="w-64 h-64 text-blue-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5" />
              Monitoring Kontrak Sewa Kendaraan
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Kontrak Sewa Kendaraan Operasional
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pengelolaan perikatan sewa rental armada kendaraan outdoor dengan vendor untuk dukungan proyek kelistrikan di site.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-sm border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Cetak Laporan PDF
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Tambah Kontrak Sewa
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
            <div className="text-xl font-bold text-emerald-400">{formatRupiah(totalMonthlyCost)}</div>
            <div className="text-slate-400 text-xs">Total Biaya Sewa / Bulan</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{activeCount}</div>
            <div className="text-slate-400 text-xs">Kontrak Aktif</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{expiringCount}</div>
            <div className="text-slate-400 text-xs">Mendekati Expired (&lt; 30 Hari)</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-slate-800 text-slate-400 rounded-lg border border-slate-700">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-400">{finishedCount}</div>
            <div className="text-slate-400 text-xs">Kontrak Selesai</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari No Kontrak, Vendor, Plat, Site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 w-full md:w-auto"
          >
            <option value="ALL">Semua Status Kontrak</option>
            <option value="Aktif">Aktif</option>
            <option value="Mendekati Expired">Mendekati Expired</option>
            <option value="Selesai Kontrak">Selesai Kontrak</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">No. Kontrak Sewa</th>
                <th className="px-5 py-3.5 font-semibold">Vendor / Perusahaan Rent</th>
                <th className="px-5 py-3.5 font-semibold">Plat & Jenis Unit</th>
                <th className="px-5 py-3.5 font-semibold text-right">Biaya / Bulan</th>
                <th className="px-5 py-3.5 font-semibold">Periode Kontrak</th>
                <th className="px-5 py-3.5 font-semibold">Alokasi Site / SPBJ</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    Tidak ada kontrak sewa kendaraan yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredLeases.map((l) => {
                  const spbj = spbjContracts.find((s) => s.id === l.spbjId);
                  return (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-blue-400 font-mono text-xs">{l.contractNumber}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 font-medium text-white">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {l.vendorName}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold font-mono text-amber-400 text-sm">{l.plateNumber}</div>
                        <div className="text-xs text-slate-400">{l.vehicleType}</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="font-bold text-emerald-400 font-mono text-sm">
                          {formatRupiah(l.monthlyRate)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {l.startDate} ~ {l.endDate}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {l.assignedSite}
                        </div>
                        {spbj && (
                          <div className="text-[11px] text-blue-400 font-mono mt-0.5">
                            [{spbj.up3Name}]
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {l.status === 'Aktif' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif
                          </span>
                        )}
                        {l.status === 'Mendekati Expired' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            Mendekati Expired
                          </span>
                        )}
                        {l.status === 'Selesai Kontrak' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            <Clock className="w-3 h-3" />
                            Selesai Kontrak
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <select
                          value={l.status}
                          onChange={(e) =>
                            onUpdateLeaseStatus(l.id, e.target.value as VehicleLease['status'])
                          }
                          className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Mendekati Expired">Mendekati Expired</option>
                          <option value="Selesai Kontrak">Selesai Kontrak</option>
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-white">Tambah Kontrak Sewa Kendaraan</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nomor Kontrak Sewa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: CTR-ME-2026-110"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vendor / Perusahaan Rent *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Trans Maluku"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Plat Nomor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: DE 9912 AB"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Merek / Tipe Unit
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mitsubishi Triton 4x4"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Biaya Sewa / Bulan (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={500000}
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Status Kontrak
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VehicleLease['status'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Mendekati Expired">Mendekati Expired</option>
                    <option value="Selesai Kontrak">Selesai Kontrak</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tanggal Mulai Kontrak
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tanggal Selesai Kontrak
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Alokasi Proyek (SPBJ) *
                  </label>
                  <select
                    required
                    value={spbjId}
                    onChange={(e) => {
                      setSpbjId(e.target.value);
                      const targetSpbj = spbjContracts.find((s) => s.id === e.target.value);
                      if (targetSpbj) {
                        setAssignedSite(targetSpbj.projectName);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Pilih SPBJ Terhubung --</option>
                    {spbjContracts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.up3Name} - {s.spbjNumber.split('/')[0]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Lokasi Detail Site
                  </label>
                  <input
                    type="text"
                    placeholder="Desa Tamangil / Site Ambon"
                    value={assignedSite}
                    onChange={(e) => setAssignedSite(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Catatan / Syarat Ketentuan Sewa
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan asuransi, klausa klaim kerusakan, supir vendor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg transition-colors"
                >
                  Simpan Kontrak Sewa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { VehicleCompany, SpbjContract } from '../types';
import { Truck, Car, Wrench, CheckCircle2, Search, Filter, Plus, Calendar, User, Shield } from 'lucide-react';

interface VehicleCompanyViewProps {
  vehicles: VehicleCompany[];
  spbjContracts: SpbjContract[];
  onAddVehicle: (vehicle: Omit<VehicleCompany, 'id'>) => void;
  onUpdateVehicleStatus: (id: string, status: VehicleCompany['status']) => void;
}

export const VehicleCompanyView: React.FC<VehicleCompanyViewProps> = ({
  vehicles,
  spbjContracts,
  onAddVehicle,
  onUpdateVehicleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [type, setType] = useState('Pick-up 4x4 Operasional Site');
  const [driverName, setDriverName] = useState('');
  const [status, setStatus] = useState<VehicleCompany['status']>('Aktif Operasional');
  const [lastServiceDate, setLastServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextTaxDate, setNextTaxDate] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [spbjId, setSpbjId] = useState('');
  const [notes, setNotes] = useState('');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = vehicles.filter((v) => v.status === 'Aktif Operasional').length;
  const serviceCount = vehicles.filter((v) => v.status === 'Servis / Bengkel').length;
  const standbyCount = vehicles.filter((v) => v.status === 'Standby / Pool').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !vehicleName || !driverName) return;

    onAddVehicle({
      plateNumber,
      vehicleName,
      type,
      driverName,
      status,
      lastServiceDate,
      nextTaxDate,
      spbjId: spbjId || undefined,
      notes: notes || undefined,
    });

    // Reset Form
    setPlateNumber('');
    setVehicleName('');
    setDriverName('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Truck className="w-64 h-64 text-amber-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <Car className="w-3.5 h-3.5" />
              Monitoring Aset Kendaraan Operasional
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Kendaraan Operasional Perusahaan
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Manajemen armada kendaraan milik PT Sapta Manunggal Karya (Divisi ME) untuk proyek Lisdes & Distribusi Kelistrikan.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            Tambah Kendaraan
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{vehicles.length}</div>
            <div className="text-slate-400 text-xs">Total Unit Armada</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{activeCount}</div>
            <div className="text-slate-400 text-xs">Aktif On-Site Proyek</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{serviceCount}</div>
            <div className="text-slate-400 text-xs">Dalam Perbaikan / Bengkel</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-400">{standbyCount}</div>
            <div className="text-slate-400 text-xs">Standby Pool Gudang</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Plat No, Nama Unit, Driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 w-full md:w-auto"
          >
            <option value="ALL">Semua Status</option>
            <option value="Aktif Operasional">Aktif Operasional</option>
            <option value="Servis / Bengkel">Servis / Bengkel</option>
            <option value="Standby / Pool">Standby / Pool</option>
          </select>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Plat Nomor & Unit</th>
                <th className="px-5 py-3.5 font-semibold">Kategori / Tipe</th>
                <th className="px-5 py-3.5 font-semibold">Driver Penanggung Jawab</th>
                <th className="px-5 py-3.5 font-semibold">Terhubung SPBJ</th>
                <th className="px-5 py-3.5 font-semibold">Servis Terakhir</th>
                <th className="px-5 py-3.5 font-semibold">Jatuh Tempo Pajak</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    Tidak ada data kendaraan operasional yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => {
                  const spbj = spbjContracts.find((s) => s.id === v.spbjId);
                  return (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-amber-400 font-mono text-base">{v.plateNumber}</div>
                        <div className="text-white text-xs font-medium">{v.vehicleName}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                          <Truck className="w-3 h-3 text-amber-500" />
                          {v.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-200">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {v.driverName}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {spbj ? (
                          <div>
                            <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                              {spbj.up3Name}
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                              {spbj.projectName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Pool Umum / Stock</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {v.lastServiceDate}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                          <Shield className="w-3.5 h-3.5 text-amber-500/70" />
                          {v.nextTaxDate}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {v.status === 'Aktif Operasional' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif Operasional
                          </span>
                        )}
                        {v.status === 'Servis / Bengkel' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Wrench className="w-3 h-3" />
                            Servis / Bengkel
                          </span>
                        )}
                        {v.status === 'Standby / Pool' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                            <Car className="w-3 h-3" />
                            Standby / Pool
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <select
                          value={v.status}
                          onChange={(e) =>
                            onUpdateVehicleStatus(v.id, e.target.value as VehicleCompany['status'])
                          }
                          className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Aktif Operasional">Aktif Operasional</option>
                          <option value="Servis / Bengkel">Servis / Bengkel</option>
                          <option value="Standby / Pool">Standby / Pool</option>
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

      {/* Add Modal Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-white">Tambah Kendaraan Operasional</h3>
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
                    Plat Nomor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: DE 8812 BC"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Unit / Merek *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Toyota Hilux 4x4"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipe / Jenis Kendaraan
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pick-up 4x4 Operasional Site">Pick-up 4x4 Operasional Site</option>
                    <option value="Truk Crane 6.5 Ton">Truk Crane 6.5 Ton</option>
                    <option value="Mobil Dinas PM / Supervisor">Mobil Dinas PM / Supervisor</option>
                    <option value="Truk Box Transport Material">Truk Box Transport Material</option>
                    <option value="Minibus Transport Tim ME">Minibus Transport Tim ME</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Driver Penanggung Jawab *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Driver"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Status Operasional
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VehicleCompany['status'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Aktif Operasional">Aktif Operasional</option>
                    <option value="Servis / Bengkel">Servis / Bengkel</option>
                    <option value="Standby / Pool">Standby / Pool</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Alokasi Proyek (SPBJ)
                  </label>
                  <select
                    value={spbjId}
                    onChange={(e) => setSpbjId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Tidak Terhubung SPBJ (Pool Umum) --</option>
                    {spbjContracts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tanggal Servis Terakhir
                  </label>
                  <input
                    type="date"
                    value={lastServiceDate}
                    onChange={(e) => setLastServiceDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jatuh Tempo Pajak / STNK
                  </label>
                  <input
                    type="date"
                    value={nextTaxDate}
                    onChange={(e) => setNextTaxDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Catatan Unit</label>
                <textarea
                  rows={2}
                  placeholder="Catatan kondisi fisik, perlengkapan APD kendaraan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
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
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-lg transition-colors"
                >
                  Simpan Unit Kendaraan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

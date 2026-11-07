import React, { useState } from 'react';
import { Building2, Package, Search, Plus, ArrowUpDown, History, MapPin, Box, CheckCircle2, AlertTriangle } from 'lucide-react';

interface WarehouseStock {
  id: string;
  name: string;
  category: 'MDU' | 'NON MDU' | 'Equipment';
  quantity: number;
  unit: string;
  location: string;
  status: 'In Stock' | 'Low Stock';
}

const WAREHOUSE_DATA: WarehouseStock[] = [
  { id: 'WH-001', name: 'Kabel NYY 4x240mm2', category: 'MDU', quantity: 450, unit: 'Meter', location: 'Rack A-12', status: 'In Stock' },
  { id: 'WH-002', name: 'Isolator Tumpu 20kV', category: 'MDU', quantity: 24, unit: 'Pcs', location: 'Rack B-04', status: 'In Stock' },
  { id: 'WH-003', name: 'Skun Kabel 150mm2', category: 'NON MDU', quantity: 8, unit: 'Pcs', location: 'Bin C-01', status: 'Low Stock' },
  { id: 'WH-004', name: 'Safety Shoes 10kV', category: 'Equipment', quantity: 15, unit: 'Pairs', location: 'Locker Safety', status: 'In Stock' },
];

export const WarehouseView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-500" />
            <span>Manajemen Gudang & Stok Pusat</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pengelolaan penyimpanan material distribus utama (MDU), material pendukung (NON-MDU), dan aset alat kerja.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm transition-colors">
            <History className="w-4 h-4 text-slate-400" />
            <span>Riwayat Keluar/Masuk</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors">
            <Plus className="w-4 h-4" />
            <span>Input Barang Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Kapasitas Terpakai</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">68%</span>
            <span className="text-[10px] text-slate-400">Pusat SMK</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
            <div className="bg-blue-500 h-full w-[68%] rounded-full" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Total SKU</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">154</div>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Audit Valid
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Low Stock Alert</span>
          <div className="text-2xl font-bold text-amber-500 font-mono">12</div>
          <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Perlu Restock
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Incoming (Weekly)</span>
          <div className="text-2xl font-bold text-blue-500 font-mono">5</div>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Box className="w-3 h-3" /> Pengiriman Vendor
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inventaris Barang Gudang</h3>
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button className="px-3 py-1 text-[10px] font-bold bg-white dark:bg-slate-900 text-blue-600 rounded-md shadow-sm">Semua</button>
              <button className="px-3 py-1 text-[10px] font-bold text-slate-500">MDU</button>
              <button className="px-3 py-1 text-[10px] font-bold text-slate-500">Non-MDU</button>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input type="text" placeholder="Cari item atau lokasi..." className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">SKU / ID</th>
                <th className="p-4">Nama Barang</th>
                <th className="p-4">Kategori</th>
                <th className="p-4 text-center">Jumlah Stok</th>
                <th className="p-4">Satuan</th>
                <th className="p-4">Lokasi Rak</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {WAREHOUSE_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-400">{item.id}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium text-slate-600 dark:text-slate-400">{item.category}</span>
                  </td>
                  <td className="p-4 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="p-4">{item.unit}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{item.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border ${
                      item.status === 'In Stock' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-500 hover:underline font-bold">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

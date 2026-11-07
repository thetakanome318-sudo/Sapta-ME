import React, { useState } from 'react';
import { Building2, Package, Search, Plus, History, MapPin, Box, CheckCircle2, AlertTriangle } from 'lucide-react';

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
  { id: 'WH-TUAL-001', name: 'Tiang Besi 12m', category: 'MDU', quantity: 24, unit: 'Batang', location: 'Open Yard Tual', status: 'In Stock' },
  { id: 'WH-TUAL-002', name: 'Trafo 50kVA', category: 'MDU', quantity: 2, unit: 'Unit', location: 'Section B-Tual', status: 'Low Stock' },
  { id: 'WH-TUAL-003', name: 'Baut Galvanis M16', category: 'NON MDU', quantity: 500, unit: 'Pcs', location: 'Rack A1', status: 'In Stock' },
  { id: 'WH-TUAL-004', name: 'Safety Harness Full Body', category: 'Equipment', quantity: 8, unit: 'Sets', location: 'Safety Rack', status: 'In Stock' },
];

export const WarehouseTualView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-500" />
            <span>Manajemen Gudang Tual</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pusat penyimpanan material untuk proyek Lisdes dan distribusi wilayah UP3 Tual.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm transition-colors text-slate-700 dark:text-slate-200">
            <History className="w-4 h-4 text-slate-400" />
            <span>Riwayat Tual</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors">
            <Plus className="w-4 h-4" />
            <span>Tambah Barang</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Kapasitas Terpakai</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">75%</span>
            <span className="text-[10px] text-slate-400">Tual Storage</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
            <div className="bg-blue-500 h-full w-[75%] rounded-full" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Total SKU</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">62</div>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Stok Sinkron
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Low Stock</span>
          <div className="text-2xl font-bold text-amber-500 font-mono">8</div>
          <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Re-Order
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Incoming Tual</span>
          <div className="text-2xl font-bold text-blue-500 font-mono">3</div>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Box className="w-3 h-3" /> Pengiriman Pusat
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inventaris Barang Gudang Tual</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Cari item Tual..." 
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">ID SKU</th>
                <th className="p-4">Nama Barang</th>
                <th className="p-4">Kategori</th>
                <th className="p-4 text-center">Stok Tual</th>
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
                      <MapPin className="w-3 h-3 text-amber-500" />
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

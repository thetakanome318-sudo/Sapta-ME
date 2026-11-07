import React, { useState } from 'react';
import { Truck, Users, DollarSign, Search, Filter, Plus, FileText, TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface CostItem {
  id: string;
  category: 'Transport' | 'Labor' | 'Equipment Rental';
  description: string;
  projectName: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending' | 'Paid';
}

const COST_DATA: CostItem[] = [
  { id: 'EXP-001', category: 'Transport', description: 'Sewa Crane 25 Ton - Mobilisasi Trafo', projectName: 'Substation T3 Bandara', amount: 12500000, date: '2026-11-04', status: 'Paid' },
  { id: 'EXP-002', category: 'Labor', description: 'Upah Lembur Tim Terminasi (4 Org)', projectName: 'Substation T3 Bandara', amount: 2400000, date: '2026-11-05', status: 'Approved' },
  { id: 'EXP-003', category: 'Transport', description: 'Angkutan Tiang Besi 12m (3 Rit)', projectName: 'Desa Hoko UP3 Tual', amount: 4500000, date: '2026-11-02', status: 'Paid' },
  { id: 'EXP-004', category: 'Labor', description: 'Biaya Buruh Kasar Gali Lubang Tiang', projectName: 'Desa Tamangil UP3 Tual', amount: 8750000, date: '2026-11-03', status: 'Pending' },
];

export const LogisticsLaborCostView: React.FC = () => {
  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            <span>Biaya Angkutan & Buruh Lapangan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring pengeluaran operasional logistik, mobilisasi alat berat, dan manajemen upah tenaga kerja harian.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors">
            <Plus className="w-4 h-4" />
            <span>Input Biaya Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Biaya Angkutan</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{formatIDR(17000000)}</div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12% dari bulan lalu</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Upah Buruh</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{formatIDR(11150000)}</div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-rose-600 font-bold">
            <ArrowDownRight className="w-3 h-3" />
            <span>-5% dari estimasi RAB</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outstanding (Pending)</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">{formatIDR(8750000)}</div>
          <div className="mt-2 text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
            Menunggu Persetujuan PM
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daftar Transaksi Biaya Lapangan</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input type="text" placeholder="Cari transaksi..." className="pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none" />
            </div>
            <button className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Deskripsi Pekerjaan / Sewa</th>
                <th className="p-4">Proyek</th>
                <th className="p-4 text-right">Jumlah (Rp)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {COST_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono">{item.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase border ${
                      item.category === 'Transport' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                      item.category === 'Labor' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                      'text-purple-600 bg-purple-50 border-purple-100'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{item.description}</td>
                  <td className="p-4 text-slate-500">{item.projectName}</td>
                  <td className="p-4 font-mono font-bold text-right">{formatIDR(item.amount)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                      item.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' :
                      item.status === 'Approved' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-amber-500/10 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-amber-600 hover:underline font-bold">Nota</button>
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

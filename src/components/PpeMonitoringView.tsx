import React, { useState } from 'react';
import { HardHat, Search, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, UserCheck } from 'lucide-react';

interface PpeItem {
  id: string;
  workerName: string;
  helmet: boolean;
  vdeGloves: boolean;
  safetyShoes10kV: boolean;
  harness: boolean;
  status: 'Complete' | 'Incomplete';
  lastChecked: string;
}

const PPE_DATA: PpeItem[] = [
  { id: 'PPE-101', workerName: 'Rahmat Hidayat', helmet: true, vdeGloves: true, safetyShoes10kV: true, harness: true, status: 'Complete', lastChecked: '2026-11-06 07:42' },
  { id: 'PPE-102', workerName: 'Agus Prasetyo', helmet: true, vdeGloves: true, safetyShoes10kV: true, harness: false, status: 'Incomplete', lastChecked: '2026-11-06 07:48' },
  { id: 'PPE-103', workerName: 'Dwi Kurniawan', helmet: true, vdeGloves: true, safetyShoes10kV: true, harness: true, status: 'Complete', lastChecked: '2026-11-06 07:55' },
];

export const PpeMonitoringView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-500" />
            <span>Monitoring APD (Personal Protective Equipment)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verifikasi kelengkapan alat pelindung diri teknisi di lapangan untuk menjamin keselamatan kerja sesuai standar K3.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors">
          <UserCheck className="w-4 h-4" />
          <span>Verifikasi Harian</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Aman (Lengkap)</span>
            <div className="text-2xl font-bold text-emerald-500 font-mono">92%</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500/20" />
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Peringatan</span>
            <div className="text-2xl font-bold text-amber-500 font-mono">8%</div>
          </div>
          <ShieldAlert className="w-8 h-8 text-amber-500/20" />
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Incident Free</span>
            <div className="text-2xl font-bold text-blue-500 font-mono">1,420 Days</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-blue-500/20" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Nama Teknisi</th>
                <th className="p-4 text-center">Helm</th>
                <th className="p-4 text-center">Gloves VDE</th>
                <th className="p-4 text-center">Sepatu 10kV</th>
                <th className="p-4 text-center">Harness</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Terakhir Cek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {PPE_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{item.workerName}</td>
                  <td className="p-4 text-center">
                    {item.helmet ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                  </td>
                  <td className="p-4 text-center">
                    {item.vdeGloves ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                  </td>
                  <td className="p-4 text-center">
                    {item.safetyShoes10kV ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                  </td>
                  <td className="p-4 text-center">
                    {item.harness ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      item.status === 'Complete' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{item.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

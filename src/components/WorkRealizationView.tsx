import React from 'react';
import { TrendingUp, FileSpreadsheet, ChevronRight, Download } from 'lucide-react';

interface RealizationItem {
  id: string;
  description: string;
  unit: string;
  rab: string;
  realization: string;
  totalRp: string;
  weightPercent: string;
}

const REALIZATION_DATA: RealizationItem[] = [
  { id: '1', description: 'Pemasangan Tiang Besi 12 Mtr 200 daN', unit: '', rab: '', realization: '', totalRp: '-', weightPercent: '0,00%' },
  { id: '2', description: '- Pemasangan tiang pada tanah biasa', unit: '', rab: '', realization: '', totalRp: '-', weightPercent: '0,00%' },
  { id: '3', description: '- Pemasangan tiang pada tanah cadas', unit: '', rab: '', realization: '', totalRp: '-', weightPercent: '0,00%' },
  { id: '4', description: '- Pemasangan tiang pada tanah karang keras', unit: '', rab: '', realization: '', totalRp: '92.739.200', weightPercent: '30,53%' },
  { id: '5', description: 'Konduktor A3C-S 70 mm²', unit: '', rab: '', realization: '', totalRp: '25.668.461', weightPercent: '8,45%' },
  { id: '6', description: 'Lightning Arrester 20 kV 5 kA', unit: '', rab: '', realization: '', totalRp: '262.800', weightPercent: '0,09%' },
  { id: '7', description: 'Cut Out 20 KV + Fuse Link', unit: '', rab: '', realization: '', totalRp: '262.800', weightPercent: '0,09%' },
  { id: '8', description: 'Isolator Tumpu (Pin Post) + Asesories', unit: '', rab: '', realization: '', totalRp: '3.855.280', weightPercent: '1,27%' },
  { id: '9', description: 'Isolator Tarik (Suspension) + Asesories', unit: '', rab: '', realization: '', totalRp: '2.426.400', weightPercent: '0,80%' },
  { id: '10', description: 'LBS Motorized non RTU', unit: '', rab: '', realization: '', totalRp: '-', weightPercent: '0,00%' },
  { id: '11', description: 'Kontruksi TM-1 ( Konstruksi T. Penumpu )', unit: '', rab: '', realization: '', totalRp: '52.054.340', weightPercent: '17,14%' },
  { id: '12', description: 'Kontruksi TM-3 ( Konstruksi T. Awal )', unit: '', rab: '', realization: '', totalRp: '4.236.368', weightPercent: '1,39%' },
  { id: '13', description: 'Kontruksi TM-4 ( Konstruksi T. Akhir )', unit: '', rab: '', realization: '', totalRp: '4.200.790', weightPercent: '1,38%' },
  { id: '14', description: 'Kontruksi TM-5 ( Konstruksi T. Tarik Ganda )', unit: '', rab: '', realization: '', totalRp: '15.263.162', weightPercent: '5,03%' },
  { id: '15', description: 'Kontruksi Topang Tarik', unit: '', rab: '', realization: '', totalRp: '6.560.428', weightPercent: '2,16%' },
  { id: '16', description: 'Kontruksi Pemasangan Gronding Arrester', unit: '', rab: '', realization: '', totalRp: '3.248.072', weightPercent: '1,07%' },
  { id: '17', description: 'Pemasangan Cover Lightning Arrester', unit: '', rab: '', realization: '', totalRp: '191.979', weightPercent: '0,06%' },
  { id: '18', description: 'Pemasangan Cover Fuse Cut Out', unit: '', rab: '', realization: '', totalRp: '373.163', weightPercent: '0,12%' },
  { id: '19', description: 'Konstruksi Rambu Tanda Pengaman (Tanda Bahaya dan Penghalang Panjat)', unit: '', rab: '', realization: '', totalRp: '8.321.464', weightPercent: '2,74%' },
  { id: '20', description: 'Penanda Program Listrik Perdesaan Kementrian ESDM TA. 2026', unit: '', rab: '', realization: '', totalRp: '1.703.872', weightPercent: '0,56%' },
  { id: '21', description: 'Pengecatan Tiang 12 mtr 200 daN (Cat silver + Cat Hitam + Cat Menie = 1,8 mtr)', unit: '', rab: '', realization: '', totalRp: '15.093.648', weightPercent: '4,97%' },
  { id: '22', description: 'Manset Tiang 12 mtr 200 daN ( 1 tiang = 0,066 m3)', unit: '', rab: '', realization: '', totalRp: '15.860.660', weightPercent: '5,22%' },
  { id: '23', description: 'Penebangan Pohon dan ROW', unit: '', rab: '', realization: '', totalRp: '9.928.593', weightPercent: '3,27%' },
];

export const WorkRealizationView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-rose-500" />
            <span>Realisasi Pekerjaan & Progres Fisik</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Laporan detail realisasi item pekerjaan, perbandingan RAB vs Realisasi, dan bobot persentase penyelesaian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm shadow-rose-500/20 transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Total Nilai Realisasi</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">Rp 303.741.074</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
            <span>Progress: 100%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Item Pekerjaan Selesai</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">54 Items</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-blue-600">
            <span>Sesuai Kontrak</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Lokasi Unit</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">UP3 TUAL</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-amber-600">
            <span>Lisdes TA. 2026</span>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              {/* Main Header Rows matching image style (Red Theme) */}
              <tr className="bg-red-600 text-white font-bold uppercase tracking-wider text-[11px] border-b border-red-700">
                <th rowSpan={2} className="p-4 border-r border-red-500 min-w-[300px] text-center">URAIAN PEKERJAAN</th>
                <th rowSpan={2} className="p-4 border-r border-red-500 text-center">SAT</th>
                <th colSpan={2} className="p-2 border-b border-r border-red-500 text-center">JUMLAH</th>
                <th rowSpan={2} className="p-4 border-r border-red-500 text-center">JUMLAH (Rp)</th>
                <th rowSpan={2} className="p-4 text-center">BOBOT (%)</th>
              </tr>
              <tr className="bg-red-600 text-white font-bold uppercase tracking-wider text-[10px] border-b border-red-700">
                <th className="p-2 border-r border-red-500 text-center">RAB</th>
                <th className="p-2 border-r border-red-500 text-center">REALISASI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {REALIZATION_DATA.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-red-50/30 dark:hover:bg-slate-800/40 transition-colors ${
                    index % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-900/30' : 'bg-white dark:bg-slate-900'
                  }`}
                >
                  <td className={`p-3 border-r border-slate-200 dark:border-slate-800 font-medium ${item.description.startsWith('-') ? 'pl-8' : 'pl-4'}`}>
                    {item.description}
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono">
                    {item.unit || '-'}
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono">
                    {item.rab || '-'}
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono">
                    {item.realization || '-'}
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-mono font-bold text-right px-6">
                    {item.totalRp !== '-' ? (
                      <div className="flex justify-between items-center w-full">
                        <span className="text-slate-400 font-normal">Rp</span>
                        <span>{item.totalRp}</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="p-3 font-mono font-bold text-right px-6 text-slate-600 dark:text-slate-400">
                    {item.weightPercent}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-white uppercase">
                <td colSpan={4} className="p-4 border-r border-slate-300 dark:border-slate-700 text-center tracking-widest">
                  TOTAL
                </td>
                <td className="p-4 border-r border-slate-300 dark:border-slate-700 font-mono text-right px-6">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-slate-500">Rp</span>
                    <span>303.741.074</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-right px-6 text-rose-600 dark:text-rose-400">
                  100,00%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

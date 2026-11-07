import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, ChevronLeft, Filter, Download, Briefcase, MapPin } from 'lucide-react';

interface TimelineEvent {
  id: string;
  projectName: string;
  taskTitle: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'On Track' | 'Delayed' | 'Critical';
}

const TIMELINE_DATA: TimelineEvent[] = [
  { id: '1', projectName: 'Pemasangan Substation 20kV Terminal 3', taskTitle: 'Pemasangan Tiang Besi 12 Mtr', startDate: '2026-11-01', endDate: '2026-11-15', progress: 80, status: 'On Track' },
  { id: '2', projectName: 'Pemasangan Substation 20kV Terminal 3', taskTitle: 'Konduktor A3C-S 70 mm²', startDate: '2026-11-10', endDate: '2026-11-25', progress: 30, status: 'On Track' },
  { id: '3', projectName: 'Instalasi Genset Menara SMK', taskTitle: 'Kontruksi TM-1 (Penumpu)', startDate: '2026-11-05', endDate: '2026-11-20', progress: 95, status: 'On Track' },
  { id: '4', projectName: 'Pabrik Cikarang MDP Panel', taskTitle: 'Penebangan Pohon & ROW', startDate: '2026-11-01', endDate: '2026-11-05', progress: 100, status: 'On Track' },
  { id: '5', projectName: 'Gedung Cyber 2 Retrofit', taskTitle: 'Pengujian Tahanan Isolasi', startDate: '2026-11-12', endDate: '2026-11-14', progress: 0, status: 'Delayed' },
];

export const WorkTimelineView: React.FC = () => {
  const [currentMonth] = useState('November 2026');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span>Timeline Pekerjaan Lapangan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualisasi jadwal pelaksanaan item pekerjaan dan estimasi penyelesaian proyek secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Proyek</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-500 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Export Gantt</span>
          </button>
        </div>
      </div>

      {/* Timeline Calendar Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white min-w-[120px] text-center">
              {currentMonth}
            </h3>
            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> On Track
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Delayed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] p-6 space-y-6">
            {TIMELINE_DATA.map((event) => (
              <div key={event.id} className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{event.taskTitle}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {event.projectName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">{event.startDate} — {event.endDate}</span>
                    <span className={`px-2 py-0.5 rounded font-bold border ${
                      event.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      event.status === 'Delayed' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                <div className="relative h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50">
                  <div 
                    className={`absolute inset-y-0 left-0 transition-all duration-1000 flex items-center justify-end px-3 ${
                      event.status === 'On Track' ? 'bg-emerald-500/20 border-r-2 border-emerald-500' :
                      event.status === 'Delayed' ? 'bg-amber-500/20 border-r-2 border-amber-500' :
                      'bg-rose-500/20 border-r-2 border-rose-500'
                    }`}
                    style={{ width: `${event.progress}%` }}
                  >
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-300">
                      {event.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Estimasi Penyelesaian</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Berdasarkan progres saat ini, proyek 20kV Terminal 3 diperkirakan selesai tepat waktu pada 15 Desember 2026.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fokus Minggu Ini</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Percepatan pengerjaan konduktor A3C-S di area karang keras untuk mengejar target akhir bulan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

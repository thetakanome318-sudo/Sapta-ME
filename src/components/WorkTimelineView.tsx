import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, ChevronLeft, Filter, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { PlanItem, SpbjContract } from '../types';
import { subscribePlanItems, upsertPlanItem, deletePlanItem } from '../services/firestoreSync';

interface WorkTimelineViewProps {
  spbjList?: SpbjContract[];
}

export const WorkTimelineView: React.FC<WorkTimelineViewProps> = ({ spbjList = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({ description: '', date: new Date().toISOString().slice(0, 10), spbjId: spbjList[0]?.id || '' });

  useEffect(() => {
    const unsub = subscribePlanItems((data) => setPlanItems(data));
    return () => unsub();
  }, []);

  const handleAddPlan = () => {
    if (!newPlan.description || !newPlan.date) return;
    const targetSpbj = spbjList.find(s => s.id === (newPlan.spbjId || selectedSpbjId));
    
    const item: PlanItem = {
      id: `PLAN-${Date.now()}`,
      projectId: targetSpbj?.id || 'PRJ-GENERAL',
      projectName: targetSpbj?.projectName || 'Umum',
      date: newPlan.date,
      description: newPlan.description,
      status: 'Rencana'
    };
    upsertPlanItem(item);
    setNewPlan({ description: '', date: new Date().toISOString().slice(0, 10), spbjId: spbjList[0]?.id || '' });
    setIsAdding(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  const filteredPlanItems = planItems.filter(p => {
    if (selectedSpbjId === 'all') return true;
    return p.projectId === selectedSpbjId || p.projectName?.includes(selectedSpbjId);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span>Timeline Pekerjaan & Jadwal Rencana</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Penjadwalan timeline pelaksanaan pekerjaan proyek dan rencana milestone per SPBJ.
          </p>
        </div>

        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-400/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rencana Pekerjaan</span>
        </button>
      </div>

      {/* Filter SPBJ Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">Filter SPBJ Proyek:</label>
          <select
            value={selectedSpbjId}
            onChange={(e) => setSelectedSpbjId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-80"
          >
            <option value="all">Semua Kontrak SPBJ ({spbjList.length} Proyek)</option>
            {spbjList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Rencana Terdaftar: <strong className="text-slate-900 dark:text-white font-mono">{filteredPlanItems.length} Rencana</strong>
        </div>
      </div>

      {/* Input Modal Form */}
      {isAdding && (
        <div className="bg-amber-50 dark:bg-slate-900 p-5 rounded-2xl border border-amber-300 dark:border-amber-500/30 space-y-3 shadow-md">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Input Rencana Pekerjaan Baru per SPBJ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target SPBJ *</label>
              <select 
                value={newPlan.spbjId} 
                onChange={e => setNewPlan({...newPlan, spbjId: e.target.value})} 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-semibold"
              >
                {spbjList.map(s => (
                  <option key={s.id} value={s.id}>{s.id} · {s.spbjNumber} ({s.up3Name})</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Uraian Rencana Pekerjaan *</label>
              <input 
                type="text" 
                placeholder="misal: Penggalian lubang tiang desa..." 
                value={newPlan.description} 
                onChange={e => setNewPlan({...newPlan, description: e.target.value})} 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white" 
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal Rencana *</label>
              <input 
                type="date" 
                value={newPlan.date} 
                onChange={e => setNewPlan({...newPlan, date: e.target.value})} 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleAddPlan}
              className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs shadow-sm"
            >
              Simpan Rencana
            </button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{monthName}</h3>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => (
            <div key={d} className="text-center font-bold text-[11px] text-slate-400 uppercase tracking-wider py-1">
              {d}
            </div>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const plans = filteredPlanItems.filter(p => p.date === dateStr);
            const isToday = new Date().toISOString().slice(0, 10) === dateStr;

            return (
              <div 
                key={day} 
                className={`min-h-[110px] p-2 rounded-xl border transition-all flex flex-col justify-between ${
                  isToday 
                    ? 'border-amber-400 bg-amber-500/5 dark:bg-amber-500/10' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    isToday ? 'bg-amber-400 text-slate-950' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {day}
                  </span>
                  {plans.length > 0 && (
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {plans.length} Agenda
                    </span>
                  )}
                </div>

                <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[80px]">
                  {plans.map(p => (
                    <div 
                      key={p.id} 
                      className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-1.5 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-1 group"
                    >
                      <span className="truncate">{p.description}</span>
                      <button
                        onClick={() => deletePlanItem(p.id)}
                        className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 shrink-0 transition-opacity"
                        title="Hapus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

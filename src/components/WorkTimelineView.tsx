import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, ChevronLeft, Filter, Download, Briefcase, Plus, Trash2 } from 'lucide-react';
import { PlanItem } from '../types';
import { subscribePlanItems, upsertPlanItem, deletePlanItem } from '../services/firestoreSync';

export const WorkTimelineView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({ description: '', date: '' });

  useEffect(() => {
    const unsub = subscribePlanItems((data) => setPlanItems(data));
    return () => unsub();
  }, []);

  const handleAddPlan = () => {
    if (!newPlan.description || !newPlan.date) return;
    const item: PlanItem = {
      id: `PLAN-${Date.now()}`,
      projectId: 'PRJ-GENERAL',
      projectName: 'Umum',
      date: newPlan.date,
      description: newPlan.description,
      status: 'Rencana'
    };
    upsertPlanItem(item);
    setNewPlan({ description: '', date: '' });
    setIsAdding(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span>Timeline Pekerjaan & Rencana</span>
          </h2>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rencana</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-2">
          <input type="text" placeholder="Rencana pekerjaan..." value={newPlan.description} onChange={e => setNewPlan({...newPlan, description: e.target.value})} className="flex-1 p-2 border rounded-lg text-xs" />
          <input type="date" value={newPlan.date} onChange={e => setNewPlan({...newPlan, date: e.target.value})} className="p-2 border rounded-lg text-xs" />
          <button onClick={handleAddPlan} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs">Simpan</button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}><ChevronLeft /></button>
          <h3 className="font-bold">{monthName}</h3>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}><ChevronRight /></button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const plans = planItems.filter(p => p.date === dateStr);
            return (
              <div key={day} className="min-h-[100px] border p-1 rounded-lg">
                <span className="text-xs font-bold">{day}</span>
                {plans.map(p => (
                  <div key={p.id} className="text-[9px] bg-blue-100 p-1 mt-1 rounded truncate flex justify-between">
                    {p.description}
                    <Trash2 className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => deletePlanItem(p.id)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { TaskAssignment, Project, Worker } from '../types';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Search, 
  Filter,
  ArrowUpRight,
  Zap,
  MoreVertical,
  Activity,
  MapPin,
  Download,
  HardHat
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { exportProgressReportPDF } from '../utils/pdfExport';

interface WorkMonitoringViewProps {
  tasks: TaskAssignment[];
  projects: Project[];
  workers: Worker[];
  onUpdateTaskStatus: (taskId: string, status: TaskAssignment['status']) => void;
}

export const WorkMonitoringView: React.FC<WorkMonitoringViewProps> = ({
  tasks,
  projects,
  workers,
  onUpdateTaskStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'table' | 'map'>('table');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.assignedWorkerNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesProject && matchesStatus;
  });

  const handleExportPDF = () => {
    const projName = projectFilter !== 'all' ? projects.find(p => p.id === projectFilter)?.name : undefined;
    exportProgressReportPDF(filteredTasks, projects, projName);
  };

  const getStatusColor = (status: TaskAssignment['status']) => {
    switch (status) {
      case 'Selesai': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Dalam Proses': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Menunggu Inspeksi K3': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityColor = (priority: TaskAssignment['priority']) => {
    switch (priority) {
      case 'Kritis': return 'text-rose-500';
      case 'Tinggi': return 'text-amber-500';
      case 'Sedang': return 'text-blue-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-500" />
            <span>Monitoring Progres & Pekerjaan Lapangan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pemantauan real-time status penugasan teknisi, progres fisik proyek, dan verifikasi penyelesaian pekerjaan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold mr-2">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'table' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Tabel
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'map' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Peta</span>
            </button>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Laporan Harian</span>
          </button>
        </div>
      </div>

      {/* Project Progress Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.slice(0, 3).map((proj) => (
          <div key={proj.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {proj.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{proj.name}</h3>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <BarChart3 className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Progres Konstruksi</span>
                <span className="text-slate-900 dark:text-white font-mono">{proj.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-50 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Target: {proj.targetDate}
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {tasks.filter(t => t.projectId === proj.id && t.status === 'Selesai').length} / {tasks.filter(t => t.projectId === proj.id).length} Tugas Selesai
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari tugas atau nama teknisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">Semua Proyek</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.code}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Belum Mulai">Belum Mulai</option>
            <option value="Dalam Proses">Dalam Proses</option>
            <option value="Menunggu Inspeksi K3">Menunggu Inspeksi K3</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Detailed Task Progress Table / Map */}
      {activeTab === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">Prioritas</th>
                  <th className="p-4">Pekerjaan / Item Tugas</th>
                  <th className="p-4">Lokasi / Site</th>
                  <th className="p-4">Teknisi Pelaksana</th>
                  <th className="p-4">Tenggat Waktu</th>
                  <th className="p-4">Status Progres</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            task.priority === 'Kritis' ? 'bg-rose-500 animate-pulse' :
                            task.priority === 'Tinggi' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <span className={`font-bold ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                        </div>
                      </td>
                      <td className="p-4 min-w-[200px]">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{task.taskTitle}</p>
                          <p className="text-[10px] text-slate-400 font-mono uppercase">{task.id} · {task.voltageLevel}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{task.locationDetails}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {task.assignedWorkerIds.slice(0, 3).map((id, idx) => (
                            <div 
                              key={id} 
                              className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold"
                              title={task.assignedWorkerNames[idx]}
                            >
                              {task.assignedWorkerNames[idx]?.charAt(0)}
                            </div>
                          ))}
                          {task.assignedWorkerIds.length > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-500">
                              +{task.assignedWorkerIds.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                        {task.dueDate}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as any)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="Belum Mulai">Belum Mulai</option>
                            <option value="Dalam Proses">Dalam Proses</option>
                            <option value="Menunggu Inspeksi K3">Menunggu Inspeksi K3</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400 italic">
                      Tidak ada data penugasan yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-[500px]">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
            <Map defaultCenter={{ lat: -5.6, lng: 132.7 }} defaultZoom={13}>
              {filteredTasks.map(task => (
                <AdvancedMarker key={task.id} position={{ lat: -5.6 + Math.random() * 0.05, lng: 132.7 + Math.random() * 0.05 }}>
                  <div className="bg-amber-500 text-white p-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        </div>
      )}
    </div>
  );
};

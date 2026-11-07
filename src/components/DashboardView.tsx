import React, { useState } from 'react';
import { Project, Worker, TaskAssignment, Equipment, SpbjContract } from '../types';
import { 
  Users, 
  CheckCircle2, 
  MapPin, 
  Zap, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle,
  Layers,
  FileText,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  workers: Worker[];
  tasks: TaskAssignment[];
  equipment: Equipment[];
  spbjList: SpbjContract[];
  onSelectProject: (projectId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenWorkerModal: (worker: Worker) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  workers,
  tasks,
  equipment,
  spbjList,
  onSelectProject,
  onNavigateTab,
  onOpenWorkerModal,
}) => {
  const [voltageFilter, setVoltageFilter] = useState<string>('all');
  const [selectedMapSite, setSelectedMapSite] = useState<string>('all');

  const activeWorkersCount = workers.filter((w) => w.status !== 'Belum Presensi').length;
  const highVoltageProjectsCount = projects.filter((p) => p.voltageCategory.includes('20kV')).length;
  
  // Refers to Monitoring Pekerjaan (Status 'Menunggu Inspeksi K3' or 'Dalam Proses' with High Priority)
  const criticalTasksCount = tasks.filter((t) => t.priority === 'Kritis' || t.status === 'Menunggu Inspeksi K3').length;
  const readyEquipmentCount = equipment.filter((e) => e.status === 'Siap Pakai').length;

  const filteredProjects = projects.filter((p) => {
    if (voltageFilter === 'all') return true;
    if (voltageFilter === 'hv') return p.voltageCategory.includes('20kV');
    if (voltageFilter === 'mv') return p.voltageCategory.includes('1kV-20kV');
    if (voltageFilter === 'lv') return p.voltageCategory.includes('380V');
    return true;
  });

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter(t => t.status === 'Selesai').length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  const getProjectSpbj = (projectName: string) => {
    return spbjList.find(s => 
      s.projectName.toLowerCase().includes(projectName.toLowerCase()) || 
      projectName.toLowerCase().includes(s.projectName.toLowerCase())
    );
  };

  const heroProject = projects[0];
  const heroSpbj = heroProject ? getProjectSpbj(heroProject.name) : null;
  const heroProgress = heroProject ? getProjectProgress(heroProject.id) : 0;

  const mapWorkers = workers.filter((w) => {
    if (selectedMapSite === 'all') return true;
    return w.projectId === selectedMapSite;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Teknisi Presensi Hari Ini
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {activeWorkersCount}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                / {workers.length} Total SDM
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
              Absensi GPS Valid & APD Lengkap
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Total Kontrak SPBJ
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {spbjList.length}
              </span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Aktif & Valid
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
              PT Sapta Manunggal Karya
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Antrean Inspeksi K3
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {criticalTasksCount}
              </span>
              <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                Perlu Verifikasi
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
              Sesuai Monitoring Pekerjaan
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Kesiapan Alat Pengujian
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {readyEquipmentCount}
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                / {equipment.length} Terkalibrasi
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
              Fluke, Megger & FLIR Thermal
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Hero Showcase Project Split */}
      {heroProject && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg text-white relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[360px]">
            {/* Left Info Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-amber-400 font-semibold tracking-wide">
                  <span className="px-2.5 py-1 bg-amber-400/10 border border-amber-400/20 rounded-md font-mono">
                    {heroProject.code}
                  </span>
                  <span>·</span>
                  <span>{heroProject.voltageCategory}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  {heroProject.name}
                </h2>

                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {heroProject.description}
                </p>
              </div>

              {/* Progress Bar & Sub details */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-400">Progres Fisik (Real-time Monitoring)</span>
                    <span className="text-amber-400 font-mono font-bold">{heroProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${heroProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">No SPBJ Kontrak</span>
                    <span className="font-medium text-amber-400 font-mono text-[10px] break-all">{heroSpbj?.spbjNumber || 'N/A (Cek Master Data)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Akhir Kontrak SPBJ</span>
                    <span className="font-medium text-slate-200 font-mono">{heroSpbj?.contractEndDate || heroProject.targetDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Project Manager</span>
                    <span className="font-medium text-slate-200">{heroProject.manager.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigateTab('monitoring-pekerjaan')}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Lihat Progres Detail</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateTab('spbj')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Cek Kontrak SPBJ</span>
                </button>
              </div>
            </div>

            {/* Right Media Banner */}
            <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full">
              <img
                src={heroProject.image}
                alt={heroProject.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-transparent lg:to-transparent" />
              <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono">
                Lokasi: {heroProject.location.split(',')[0]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Site Worker Map Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>Monitoring Posisi GPS & Presensi Pekerja Lapangan</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visualisasi persebaran teknisi elektrikal PT Sapta Manunggal Karya di berbagai area proyek.
            </p>
          </div>

          {/* Site Filter Segmented Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setSelectedMapSite('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedMapSite === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Semua Lokasi ({workers.length})
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedMapSite(p.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedMapSite === p.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {p.code}
              </button>
            ))}
          </div>
        </div>

        {/* Simulated Interactive Blueprint Map View */}
        <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Blueprint Grid Lines SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Substation Outline Mockup Graphic */}
          <div className="absolute inset-8 border border-dashed border-sky-500/30 rounded-lg pointer-events-none flex items-center justify-center">
            <div className="text-center space-y-1 opacity-40">
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block">
                [ ZONA KELISTRIKAN MEKANIKAL & HIGH VOLTAGE SUBSTATION ]
              </span>
              <span className="text-[10px] text-slate-400 block">
                Koordinat GPS Terintegrasi dengan Presensi APD Pekerja
              </span>
            </div>
          </div>

          {/* Map Pins for Workers */}
          <div className="absolute inset-0 p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center z-10">
            {mapWorkers.map((worker) => {
              const isPresent = worker.status !== 'Belum Presensi';
              return (
                <div
                  key={worker.id}
                  onClick={() => onOpenWorkerModal(worker)}
                  className="group relative cursor-pointer flex flex-col items-center"
                >
                  {/* Pulse Ring if active */}
                  {isPresent && (
                    <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
                  )}

                  {/* Worker Avatar & Badge */}
                  <div className={`relative w-12 h-12 rounded-full p-0.5 border-2 transition-transform group-hover:scale-110 shadow-lg ${
                    isPresent ? 'border-emerald-400 bg-slate-900' : 'border-slate-600 bg-slate-800'
                  }`}>
                    <img
                      src={worker.photoUrl}
                      alt={worker.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-slate-900 flex items-center justify-center text-[9px] font-bold ${
                      isPresent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-600 text-white'
                    }`}>
                      ✓
                    </div>
                  </div>

                  {/* Label tooltip */}
                  <div className="mt-2 text-center bg-slate-900/90 backdrop-blur border border-slate-700 rounded-md px-2 py-1 shadow-md max-w-[130px]">
                    <span className="text-[11px] font-bold text-white block truncate">
                      {worker.name}
                    </span>
                    <span className="text-[9px] text-amber-400 block truncate font-mono">
                      {worker.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 z-20">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Teknisi Hadir di Site</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span>Belum Absen / Off</span>
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
              GPS Precision: &lt; 5 Meter
            </span>
          </div>
        </div>
      </div>

      {/* Active Projects Grid & Filter */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Daftar Proyek, Monitoring & Status Kontrak
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sinkronisasi data Progres Fisik (Monitoring Pekerjaan) dengan Masa Berlaku Kontrak (SPBJ).
            </p>
          </div>

          {/* Voltage Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
            <button
              onClick={() => setVoltageFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                voltageFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Semua Proyek
            </button>
            <button
              onClick={() => setVoltageFilter('hv')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                voltageFilter === 'hv'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              20kV Substation
            </button>
            <button
              onClick={() => setVoltageFilter('mv')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                voltageFilter === 'mv'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Genset & Busduct
            </button>
            <button
              onClick={() => setVoltageFilter('lv')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                voltageFilter === 'lv'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Panel MDP & 380V
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const projectWorkers = workers.filter((w) => w.projectId === project.id);
            const activeOnSite = projectWorkers.filter((w) => w.status !== 'Belum Presensi').length;
            const projectSpbj = getProjectSpbj(project.name);
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const completedTasks = projectTasks.filter(t => t.status === 'Selesai').length;
            const dynamicProgress = getProjectProgress(project.id);

            return (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Media Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    <img
                      src={project.image}
                      alt={project.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className="bg-slate-900/90 text-amber-400 text-[10px] font-mono px-2 py-1 rounded border border-slate-700">
                        {project.code}
                      </div>
                      {projectSpbj && (
                        <div className={`text-[10px] font-bold px-2 py-1 rounded border ${
                          projectSpbj.status === 'Aktif' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-amber-500/90 text-white border-amber-400'
                        }`}>
                          SPBJ: {projectSpbj.status}
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block">
                        {project.voltageCategory}
                      </span>
                      <h4 className="text-base font-bold text-white line-clamp-1">
                        {project.name}
                      </h4>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center text-slate-500 dark:text-slate-400 gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-mono font-bold">
                        <FileText className="w-3 h-3" />
                        <span>{projectSpbj?.spbjNumber || 'Cek Master Data'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress & Workers Count */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Progres Fisik (Monitoring)</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {dynamicProgress}% ({completedTasks}/{projectTasks.length} Tugas)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${dynamicProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Worker avatars preview */}
                    <div className="flex items-center justify-between text-xs pt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {projectWorkers.slice(0, 4).map((w) => (
                            <img
                              key={w.id}
                              src={w.photoUrl}
                              alt={w.name}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full border border-white dark:border-slate-900 object-cover"
                            />
                          ))}
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                          <strong className="text-slate-900 dark:text-white font-mono">{activeOnSite}</strong>/{projectWorkers.length} Hadir
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px]">
                        <Calendar className="w-3 h-3" />
                        <span className="font-mono">{projectSpbj?.contractEndDate || project.targetDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    PM: <strong className="text-slate-700 dark:text-slate-300">{project.manager.split('(')[0]}</strong>
                  </span>
                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Monitoring Kerja</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

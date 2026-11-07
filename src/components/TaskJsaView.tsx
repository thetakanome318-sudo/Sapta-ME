import React, { useState } from 'react';
import { TaskAssignment, Project, Worker, JsaResult } from '../types';
import { analyzeJsaApi } from '../services/api';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  AlertOctagon, 
  FileText, 
  ShieldCheck, 
  HardHat, 
  Loader2,
  Zap,
  ArrowRight
} from 'lucide-react';

interface TaskJsaViewProps {
  tasks: TaskAssignment[];
  projects: Project[];
  workers: Worker[];
  onAddTask: (newTask: TaskAssignment) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskAssignment['status']) => void;
}

export const TaskJsaView: React.FC<TaskJsaViewProps> = ({
  tasks,
  projects,
  workers,
  onAddTask,
  onUpdateTaskStatus,
}) => {
  const [selectedTaskForJsa, setSelectedTaskForJsa] = useState<TaskAssignment | null>(tasks[0] || null);
  const [jsaLoading, setJsaLoading] = useState(false);
  const [jsaResult, setJsaResult] = useState<JsaResult | null>(null);
  const [jsaError, setJsaError] = useState<string | null>(null);

  // Form New Task State
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newProject, setNewProject] = useState(projects[0]?.id || '');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newVoltage, setNewVoltage] = useState('380V Low Voltage');
  const [newPriority, setNewPriority] = useState<TaskAssignment['priority']>('Tinggi');
  const [newLocationDetails, setNewLocationDetails] = useState('');
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);

  // JSA Generator Input State
  const [customTaskTitle, setCustomTaskTitle] = useState(selectedTaskForJsa?.taskTitle || '');
  const [customVoltage, setCustomVoltage] = useState(selectedTaskForJsa?.voltageLevel || '20kV (Medium Voltage)');
  const [customPpe, setCustomPpe] = useState<string[]>([
    'Sepatu Isolasi 10kV',
    'Helm K3 Elektrikal',
    'Sarung Tangan VDE Class 3 (20kV)',
    'Face Shield Bus Flash Protection',
    'LOTO Padlock Set',
  ]);

  const handleRunJsaAnalysis = async () => {
    if (!customTaskTitle.trim()) return;
    setJsaLoading(true);
    setJsaError(null);

    try {
      const location = selectedTaskForJsa?.locationDetails || 'Area Proyek Kelistrikan ME';
      const result = await analyzeJsaApi(customTaskTitle, location, customVoltage, customPpe);
      setJsaResult(result);
    } catch (err: any) {
      setJsaError(err.message || 'Terjadi kesalahan saat memproses JSA');
    } finally {
      setJsaLoading(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newProject) return;

    const proj = projects.find((p) => p.id === newProject);
    const assignedWorkers = workers.filter((w) => selectedWorkerIds.includes(w.id));

    const task: TaskAssignment = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      projectId: newProject,
      projectName: proj?.name || 'Proyek ME',
      taskTitle: newTaskTitle,
      assignedWorkerIds: selectedWorkerIds,
      assignedWorkerNames: assignedWorkers.map((w) => w.name),
      priority: newPriority,
      status: 'Belum Mulai',
      voltageLevel: newVoltage,
      jsaStatus: 'Perlu Analisis JSA',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      locationDetails: newLocationDetails || 'Site ME',
    };

    onAddTask(task);
    setShowNewTaskModal(false);
    setNewTaskTitle('');
    setSelectedWorkerIds([]);
  };

  const getPriorityBadge = (priority: TaskAssignment['priority']) => {
    switch (priority) {
      case 'Kritis':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'Tinggi':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'Sedang':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Penugasan Pekerja & Analisis K3 (JSA)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen tugas instalasi kelistrikan, verifikasi LOTO, dan pembuat Job Safety Analysis otomatis berstandar PUIL 2020.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-400/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Penugasan Baru</span>
        </button>
      </div>

      {/* Main Grid: Task Board (Left) & AI JSA Analyzer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Task Dispatch Board (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Daftar Pekerjaan Lapangan ({tasks.length})</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Klik tugas untuk jalankan analisis JSA K3
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isSelected = selectedTaskForJsa?.id === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskForJsa(task);
                    setCustomTaskTitle(task.taskTitle);
                    setCustomVoltage(task.voltageLevel);
                  }}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono text-amber-500 font-semibold">
                      {task.id} · {task.voltageLevel}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getPriorityBadge(task.priority)}`}>
                      Prioritas: {task.priority}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold mb-2 ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {task.taskTitle}
                  </h4>

                  <p className={`text-xs mb-3 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    📍 {task.projectName} ({task.locationDetails})
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/20 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}>
                        Teknisi:
                      </span>
                      <span className="font-semibold text-amber-400">
                        {task.assignedWorkerNames.join(', ') || 'Belum diisi'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          onUpdateTaskStatus(task.id, e.target.value as TaskAssignment['status']);
                        }}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border focus:outline-none ${
                          isSelected
                            ? 'bg-slate-800 text-white border-slate-700'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <option value="Belum Mulai">Belum Mulai</option>
                        <option value="Dalam Proses">Dalam Proses</option>
                        <option value="Menunggu Inspeksi K3">Menunggu Inspeksi K3</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Gemini AI JSA Analyzer (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Inspector JSA K3 Elektrikal
              </h3>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-amber-400/10 text-amber-600 dark:text-amber-400 rounded">
              Gemini 3.8 Flash
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Pekerjaan yang Dianalisis
              </label>
              <input
                type="text"
                value={customTaskTitle}
                onChange={(e) => setCustomTaskTitle(e.target.value)}
                placeholder="misal: Megger Test Trafo 2500kVA 20kV..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Tegangan / Bahaya
                </label>
                <select
                  value={customVoltage}
                  onChange={(e) => setCustomVoltage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="20kV (Medium Voltage)">20kV (Medium Voltage)</option>
                  <option value="380V Low Voltage">380V Low Voltage</option>
                  <option value="Instalasi Busduct & Genset">Instalasi Busduct & Genset</option>
                  <option value="Ketinggian / Cable Tray Ladder">Ketinggian / Cable Tray Ladder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Standar Keselamatan
                </label>
                <input
                  type="text"
                  readOnly
                  value="PUIL 2020 / SNI K3"
                  className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              onClick={handleRunJsaAnalysis}
              disabled={jsaLoading || !customTaskTitle.trim()}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {jsaLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Menganalisis Bahaya K3 (Gemini AI)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Jalankan Analisis JSA AI K3</span>
                </>
              )}
            </button>
          </div>

          {jsaError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-lg">
              {jsaError}
            </div>
          )}

          {/* JSA Result Card Output */}
          {jsaResult && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Tingkat Risiko Pekerjaan:
                </span>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    jsaResult.riskLevel === 'Kritis'
                      ? 'bg-rose-500 text-white'
                      : jsaResult.riskLevel === 'Tinggi'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {jsaResult.riskLevel}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Ringkasan Analisis:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{jsaResult.summary}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Potential Hazards (Bahaya):</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  {jsaResult.potentialHazards?.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">APD Wajib Dikenakan:</span>
                <div className="flex flex-wrap gap-1">
                  {jsaResult.requiredPpe?.map((ppe, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded text-[11px]">
                      ✓ {ppe}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Langkah Pencegahan K3:</span>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  {jsaResult.safetySteps?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono">
                Referensi: {jsaResult.puilReference}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Buat Penugasan Pekerja ME Baru
              </h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Proyek Lokasi
                </label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Pekerjaan / Tugas
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Pemasangan Busduct 4000A Lt. Basement 2..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat Tegangan
                  </label>
                  <select
                    value={newVoltage}
                    onChange={(e) => setNewVoltage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="20kV (Medium Voltage)">20kV (Medium Voltage)</option>
                    <option value="380V Low Voltage">380V Low Voltage</option>
                    <option value="Control Circuit 220V/24VDC">Control Circuit 220V/24VDC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prioritas Penugasan
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Kritis">Kritis</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detail Lokasi Site
                </label>
                <input
                  type="text"
                  placeholder="misal: Ruang Genset B2, Substation Trafo B-02"
                  value={newLocationDetails}
                  onChange={(e) => setNewLocationDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Teknisi Terlibat:
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  {workers.map((w) => (
                    <label key={w.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedWorkerIds.includes(w.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedWorkerIds([...selectedWorkerIds, w.id]);
                          } else {
                            setSelectedWorkerIds(selectedWorkerIds.filter((id) => id !== w.id));
                          }
                        }}
                      />
                      <span>{w.name} ({w.role})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg"
                >
                  Simpan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

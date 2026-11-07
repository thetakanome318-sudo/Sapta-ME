import React, { useState } from 'react';
import { Worker, AttendanceRecord, Project } from '../types';
import { 
  Search, 
  UserCheck, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  PhoneCall, 
  FileCheck2, 
  HardHat, 
  Check, 
  X,
  AlertCircle,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { exportAttendancePDF } from '../utils/pdfExport';

interface AttendanceViewProps {
  workers: Worker[];
  attendanceLog: AttendanceRecord[];
  projects: Project[];
  onOpenCheckIn: () => void;
  onOpenWorkerModal: (worker: Worker) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  workers,
  attendanceLog,
  projects,
  onOpenCheckIn,
  onOpenWorkerModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState<'workers' | 'logs'>('workers');

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.certification.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject =
      selectedProjectFilter === 'all' || worker.projectId === selectedProjectFilter;

    const matchesStatus =
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'hadir' && worker.status !== 'Belum Presensi') ||
      (selectedStatusFilter === 'absent' && worker.status === 'Belum Presensi');

    return matchesSearch && matchesProject && matchesStatus;
  });

  const handleExportPDF = () => {
    const projName = selectedProjectFilter !== 'all' ? projects.find(p => p.id === selectedProjectFilter)?.name : undefined;
    exportAttendancePDF(attendanceLog, workers, projName);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Direktori Teknisi & Presensi Lapangan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen SDM mekanikal elektrikal, sertifikasi Kemnaker K3 Listrik, dan log presensi GPS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Export PDF Presensi</span>
          </button>
          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-400/20 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Form Check-In Pekerja</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Toggle (Data Pekerja vs Log Presensi) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('workers')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'workers'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Daftar Teknisi & Sertifikasi ({workers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'logs'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Log Presensi Real-Time ({attendanceLog.length})
          </button>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
          Format Waktu: WIB (UTC+7)
        </span>
      </div>

      {activeSubTab === 'workers' && (
        <>
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama teknisi, NIP, sertifikat SKK/K3..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedProjectFilter}
                onChange={(e) => setSelectedProjectFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Lokasi Proyek</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Status Presensi</option>
                <option value="hadir">Sudah Hadir / Shift</option>
                <option value="absent">Belum Presensi</option>
              </select>
            </div>
          </div>

          {/* Worker Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map((worker) => {
              const isPresent = worker.status !== 'Belum Presensi';
              const certExpYear = new Date(worker.k3CertExpiry).getFullYear();
              const isCertValid = certExpYear >= 2027;

              return (
                <div
                  key={worker.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Worker Header */}
                    <div className="flex items-start gap-3">
                      <img
                        src={worker.photoUrl}
                        alt={worker.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-semibold text-slate-400">
                            {worker.nip}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                              isPresent
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {worker.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {worker.name}
                        </h4>
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400 block truncate">
                          {worker.role}
                        </span>
                      </div>
                    </div>

                    {/* Certification Badge Box */}
                    <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 font-medium">
                          <FileCheck2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>Sertifikasi K3 / SKK ME</span>
                        </span>
                        <span className={isCertValid ? 'text-emerald-600 dark:text-emerald-400 font-mono font-semibold' : 'text-amber-600 dark:text-amber-400 font-mono font-semibold'}>
                          Exp: {worker.k3CertExpiry}
                        </span>
                      </div>
                      <p className="font-medium text-slate-800 dark:text-slate-200 text-xs line-clamp-1">
                        {worker.certification}
                      </p>
                    </div>

                    {/* APD Status & Location */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Verifikasi APD K3:</span>
                        {worker.ppeVerified ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                            <Check className="w-3.5 h-3.5" /> APD Lengkap
                          </span>
                        ) : (
                          <span className="text-rose-500 font-semibold flex items-center gap-1 text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" /> Belum Verifikasi
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{worker.projectName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-slate-400" />
                      <span>{worker.phone}</span>
                    </span>
                    <button
                      onClick={() => onOpenWorkerModal(worker)}
                      className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                    >
                      Detail SKK & Kontak
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeSubTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Riwayat Presensi GPS & APD Terverifikasi Hari Ini</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Total {attendanceLog.length} Catatan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5">Teknisi / NIP</th>
                  <th className="p-3.5">Jabatan ME</th>
                  <th className="p-3.5">Lokasi Proyek</th>
                  <th className="p-3.5">Waktu Check-In</th>
                  <th className="p-3.5">Verifikasi APD</th>
                  <th className="p-3.5">Koordinat GPS Site</th>
                  <th className="p-3.5">Catatan Pekerjaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {attendanceLog.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {log.workerName}
                    </td>
                    <td className="p-3.5 text-amber-600 dark:text-amber-400 font-medium">
                      {log.role}
                    </td>
                    <td className="p-3.5 max-w-[180px] truncate">
                      {log.projectName}
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                      {log.checkInTime}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        ✓ Helm, Sepatu 10kV, Gloves VDE
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">
                      {log.gpsCoords}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-[220px] truncate">
                      {log.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

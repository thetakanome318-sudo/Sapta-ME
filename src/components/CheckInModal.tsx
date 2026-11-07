import React, { useState } from 'react';
import { Worker, Project, AttendanceRecord } from '../types';
import { 
  UserCheck, 
  Camera, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  HardHat
} from 'lucide-react';

interface CheckInModalProps {
  workers: Worker[];
  projects: Project[];
  onClose: () => void;
  onSubmitCheckIn: (record: AttendanceRecord) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  workers,
  projects,
  onClose,
  onSubmitCheckIn,
}) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [shiftType, setShiftType] = useState<AttendanceRecord['shiftType']>('Shift Pagi (08.00 - 17.00)');
  const [note, setNote] = useState('');

  // APD Checklist State
  const [ppe, setPpe] = useState({
    helmet: true,
    vdeGloves: true,
    safetyShoes10kV: true,
    harness: true,
    eyeProtection: true,
  });

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker || !selectedProject) return;

    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      workerId: selectedWorker.id,
      workerName: selectedWorker.name,
      role: selectedWorker.role,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      checkInTime: timeNow,
      shiftType,
      ppeChecked: ppe,
      gpsCoords: `-6.1256, 106.6558 (Valid ${selectedProject.code})`,
      status: shiftType.includes('Malam') ? 'Shift Malam' : shiftType.includes('Lembur') ? 'Overtime' : 'Shift Pagi',
      note: note || 'Presensi Mandiri via Aplikasi ME Monitoring.',
    };

    onSubmitCheckIn(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Form Presensi & Verifikasi APD K3 Lapangan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Worker Select */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Nama Teknisi / Pekerja
            </label>
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.role} ({w.nip})
                </option>
              ))}
            </select>
          </div>

          {/* Project Select */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Lokasi Proyek ME
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Select */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Jenis Shift Kerja
            </label>
            <select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="Shift Pagi (08.00 - 17.00)">Shift Pagi (08.00 - 17.00)</option>
              <option value="Shift Malam (20.00 - 05.00)">Shift Malam (20.00 - 05.00)</option>
              <option value="Lembur / Overtime">Lembur / Overtime Khusus</option>
            </select>
          </div>

          {/* APD Checklist Verification */}
          <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 block">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Daftar Periksa APD Wajib K3 Kelistrikan:</span>
            </span>

            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between cursor-pointer p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded">
                <span className="text-slate-800 dark:text-slate-200">1. Helm K3 Elektrikal Non-Konduktif</span>
                <input
                  type="checkbox"
                  checked={ppe.helmet}
                  onChange={(e) => setPpe({ ...ppe, helmet: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded">
                <span className="text-slate-800 dark:text-slate-200">2. Sepatu Safety Isolasi Listrik 10kV</span>
                <input
                  type="checkbox"
                  checked={ppe.safetyShoes10kV}
                  onChange={(e) => setPpe({ ...ppe, safetyShoes10kV: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded">
                <span className="text-slate-800 dark:text-slate-200">3. Sarung Tangan Isolasi VDE (Class 2/3)</span>
                <input
                  type="checkbox"
                  checked={ppe.vdeGloves}
                  onChange={(e) => setPpe({ ...ppe, vdeGloves: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded">
                <span className="text-slate-800 dark:text-slate-200">4. Full Body Harness Ketinggian</span>
                <input
                  type="checkbox"
                  checked={ppe.harness}
                  onChange={(e) => setPpe({ ...ppe, harness: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* Photo Preview & GPS Tag */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300">
            <span className="flex items-center gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5" /> GPS Verified: -6.1256, 106.6558
            </span>
            <span className="font-semibold">Foto Selfie APD ✓</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Tugas Hari Ini
            </label>
            <input
              type="text"
              placeholder="misal: Megger test trafo 2500kVA & wiring panel..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl shadow-sm"
            >
              Simpan Presensi Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

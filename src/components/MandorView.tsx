import React, { useState } from 'react';
import { Mandor, Project, SpbjContract, Manpower } from '../types';
import { 
  UserCheck, 
  MapPin, 
  Phone, 
  Users, 
  Plus, 
  Search, 
  Building2, 
  Briefcase, 
  Edit3, 
  CheckCircle2,
  HardHat,
  FileText,
  IdCard,
  Trash2
} from 'lucide-react';

interface MandorViewProps {
  mandors: Mandor[];
  projects: Project[];
  spbjList: SpbjContract[];
  onAddMandor: (newMandor: Mandor) => void;
  onUpdateMandorLocation: (mandorId: string, newLocation: string, newProjectName?: string) => void;
}

export const MandorView: React.FC<MandorViewProps> = ({
  mandors,
  projects,
  spbjList,
  onAddMandor,
  onUpdateMandorLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [showInputForm, setShowInputForm] = useState(false);

  // Form State for Mandor Input
  const [mandorName, setMandorName] = useState('');
  const [mandorPhone, setMandorPhone] = useState('');
  const [selectedSpbjId, setSelectedSpbjId] = useState(spbjList[0]?.id || '');
  const [workLocation, setWorkLocation] = useState('');
  const [subcontractorTeam, setSubcontractorTeam] = useState('');
  const [workerCount, setWorkerCount] = useState<number>(0);
  const [specialization, setSpecialization] = useState('Teknisi & Cable Tray');
  const [notes, setNotes] = useState('');

  // Manpower List State
  const [manpowerList, setManpowerList] = useState<Manpower[]>([]);
  const [tempManpowerName, setTempManpowerName] = useState('');
  const [tempManpowerKtp, setTempManpowerKtp] = useState('');

  // Edit Location Modal State
  const [editingMandor, setEditingMandor] = useState<Mandor | null>(null);
  const [editLocationInput, setEditLocationInput] = useState('');

  const filteredMandors = mandors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.workLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subcontractorTeam.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject = projectFilter === 'all' || m.projectId === projectFilter;
    return matchesSearch && matchesProject;
  });

  const handleAddManpower = () => {
    if (!tempManpowerName.trim() || !tempManpowerKtp.trim()) return;
    const newItem: Manpower = {
      name: tempManpowerName.trim(),
      ktpNumber: tempManpowerKtp.trim()
    };
    setManpowerList([...manpowerList, newItem]);
    setWorkerCount(manpowerList.length + 1);
    setTempManpowerName('');
    setTempManpowerKtp('');
  };

  const handleRemoveManpower = (index: number) => {
    const newList = [...manpowerList];
    newList.splice(index, 1);
    setManpowerList(newList);
    setWorkerCount(newList.length);
  };

  const handleSubmitMandor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mandorName.trim() || !workLocation.trim()) return;

    const selectedSpbj = spbjList.find(s => s.id === selectedSpbjId);
    // Find matching project by name if possible, or just use the first one as fallback for ID
    const matchingProj = projects.find(p => p.name === selectedSpbj?.projectName);

    const newMandorRecord: Mandor = {
      id: `MND-${Date.now().toString().slice(-4)}`,
      name: mandorName.trim(),
      phone: mandorPhone.trim() || '+62 812-0000-0000',
      projectId: matchingProj?.id || projects[0]?.id || 'N/A',
      projectName: selectedSpbj?.projectName || 'Proyek ME',
      workLocation: workLocation.trim(),
      subcontractorTeam: subcontractorTeam.trim() || 'Tim Subkontraktor SMK ME',
      workerCount: manpowerList.length || Number(workerCount) || 0,
      status: 'Aktif On-Site',
      specialization: specialization || 'Teknisi Mekanikal Elektrikal',
      notes: notes.trim() || 'Mandor penanggung jawab lokasi pekerjaan.',
      manpowerList: manpowerList.length > 0 ? manpowerList : undefined
    };

    onAddMandor(newMandorRecord);

    // Reset Form
    setMandorName('');
    setMandorPhone('');
    setWorkLocation('');
    setSubcontractorTeam('');
    setNotes('');
    setManpowerList([]);
    setWorkerCount(0);
    setShowInputForm(false);
  };

  const handleSaveEditLocation = () => {
    if (!editingMandor || !editLocationInput.trim()) return;
    onUpdateMandorLocation(editingMandor.id, editLocationInput.trim());
    setEditingMandor(null);
    setEditLocationInput('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-500" />
            <span>Manajemen & Menu Input Mandor Proyek</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pendaftaran mandor proyek kelistrikan, alokasi lokasi pekerjaan spesifik, dan manajemen tim subkontraktor.
          </p>
        </div>

        <button
          onClick={() => setShowInputForm(!showInputForm)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-400/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{showInputForm ? 'Tutup Form Input' : 'Input Mandor Baru'}</span>
        </button>
      </div>

      {/* Form Input Mandor (Collapsible / Hero Section) */}
      {showInputForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-400/40 dark:border-amber-500/30 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Formulir Pendaftaran Mandor & Lokasi Pekerjaan
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">PT Sapta Manunggal Karya ME</span>
          </div>

          <form onSubmit={handleSubmitMandor} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Mandor */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Mandor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Bapak Karmin Suhartono"
                  value={mandorName}
                  onChange={(e) => setMandorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* No Kontak / WA */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon / WhatsApp Mandor
                </label>
                <input
                  type="text"
                  placeholder="misal: +62 812-9900-1122"
                  value={mandorPhone}
                  onChange={(e) => setMandorPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SPBJ / Nama Pekerjaan */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Nama Pekerjaan / SPBJ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={selectedSpbjId}
                    onChange={(e) => setSelectedSpbjId(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  >
                    {spbjList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.projectName} ({s.spbjNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detail Lokasi Pekerjaan Mandor */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detail Lokasi Pekerjaan / Area Site <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Terminal 3 Substation B-02 (Gardu Trafo 20kV)"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Manpower Management Section */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Daftar Manpower (Nama & KTP)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5 relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Nama Manpower"
                    value={tempManpowerName}
                    onChange={(e) => setTempManpowerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-5 relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Nomor KTP"
                    value={tempManpowerKtp}
                    onChange={(e) => setTempManpowerKtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddManpower}
                    className="w-full h-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Manpower List Table */}
              {manpowerList.length > 0 && (
                <div className="mt-3 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="p-2 border-r border-slate-200 dark:border-slate-700">Nama</th>
                        <th className="p-2 border-r border-slate-200 dark:border-slate-700">No. KTP</th>
                        <th className="p-2 text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {manpowerList.map((m, idx) => (
                        <tr key={idx} className="bg-white dark:bg-slate-900">
                          <td className="p-2 border-r border-slate-100 dark:border-slate-800 font-medium">{m.name}</td>
                          <td className="p-2 border-r border-slate-100 dark:border-slate-800 font-mono">{m.ktpNumber}</td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveManpower(idx)}
                              className="text-rose-500 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Tim / Subkontraktor */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Tim / Sub-Kontraktor
                </label>
                <input
                  type="text"
                  placeholder="misal: Tim Subkon High Voltage SMK"
                  value={subcontractorTeam}
                  onChange={(e) => setSubcontractorTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Spesialisasi Pekerjaan */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Spesialisasi Mandor
                </label>
                <input
                  type="text"
                  placeholder="misal: Trafo 20kV & Cable Tray"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Catatan Tugas Mandor */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Penugasan / Ruang Lingkup
              </label>
              <textarea
                rows={2}
                placeholder="misal: Penanggung jawab terminasi busduct dan pengawasan JSA K3..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowInputForm(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:underline"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow-sm"
              >
                Simpan Mandor Baru
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama mandor, lokasi pekerjaan, tim subkontraktor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="md:col-span-5">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Lokasi Proyek ({mandors.length} Mandor)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Kartu Mandor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMandors.map((mandor) => (
          <div
            key={mandor.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        {mandor.id}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {mandor.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {mandor.name}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingMandor(mandor);
                    setEditLocationInput(mandor.workLocation);
                  }}
                  className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Ubah Lokasi Pekerjaan"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Lokasi Pekerjaan Box (Highlight) */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Lokasi Pekerjaan Mandor:</span>
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white pl-5 leading-relaxed">
                  {mandor.workLocation}
                </p>
              </div>

              {/* Subcontractor Team & Specialization */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Tim / Vendor:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {mandor.subcontractorTeam}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Jumlah Anggota:
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {mandor.workerCount} Teknisi ME
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Proyek Induk:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {mandor.projectName}
                  </span>
                </div>
              </div>

              {mandor.manpowerList && mandor.manpowerList.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <IdCard className="w-3 h-3" /> Detail Manpower:
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {mandor.manpowerList.map((mp, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-900 dark:text-white">{mp.name}</span>
                        <span className="text-slate-400 font-mono">{mp.ktpNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mandor.notes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                  "{mandor.notes}"
                </p>
              )}
            </div>

            {/* Card Actions / Contact */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>{mandor.phone}</span>
              </span>

              <button
                onClick={() => {
                  setEditingMandor(mandor);
                  setEditLocationInput(mandor.workLocation);
                }}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                Update Lokasi Pekerjaan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Work Location Modal */}
      {editingMandor && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Update Lokasi Pekerjaan Mandor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mandor: <strong className="text-slate-900 dark:text-white">{editingMandor.name}</strong> ({editingMandor.subcontractorTeam})
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lokasi Pekerjaan Site Baru
              </label>
              <textarea
                rows={3}
                value={editLocationInput}
                onChange={(e) => setEditLocationInput(e.target.value)}
                placeholder="misal: Terminal 3 Substation B-02 Lt. 1..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingMandor(null)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEditLocation}
                className="px-4 py-2 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg"
              >
                Simpan Lokasi Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

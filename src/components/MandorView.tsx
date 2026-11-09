import React, { useState } from 'react';
import { Mandor, Project, SpbjContract, Manpower, MandorLocation } from '../types';
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
  Trash2,
  Image as ImageIcon,
  Layers,
  Eye,
  X
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

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
  const [activeTab, setActiveTab] = useState<'table' | 'grid' | 'multi-location' | 'map'>('table');
  const [mapSpbjFilter, setMapSpbjFilter] = useState('all');

  // Form State for Mandor Input
  const [mandorName, setMandorName] = useState('');
  const [mandorPhone, setMandorPhone] = useState('');
  const [selectedSpbjId, setSelectedSpbjId] = useState(spbjList[0]?.id || '');
  const [workLocation, setWorkLocation] = useState('');
  const [subcontractorTeam, setSubcontractorTeam] = useState('');
  const [workerCount, setWorkerCount] = useState<number>(0);
  const [specialization, setSpecialization] = useState('Teknisi & Cable Tray');
  const [notes, setNotes] = useState('');
  const [ktpPhotoUrl, setKtpPhotoUrl] = useState('');

  // Manpower List State
  const [manpowerList, setManpowerList] = useState<Manpower[]>([]);
  const [tempManpowerName, setTempManpowerName] = useState('');
  const [tempManpowerKtp, setTempManpowerKtp] = useState('');

  // Multi-Locations List State for New Mandor
  const [locationsList, setLocationsList] = useState<MandorLocation[]>([]);
  const [tempLocationName, setTempLocationName] = useState('');

  // Edit Location Modal State
  const [editingMandor, setEditingMandor] = useState<Mandor | null>(null);
  const [editLocationInput, setEditLocationInput] = useState('');
  const [newLocInput, setNewLocInput] = useState('');

  // KTP Modal Preview State
  const [previewKtpUrl, setPreviewKtpUrl] = useState<string | null>(null);

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

  const handleAddLocationItem = () => {
    if (!tempLocationName.trim()) return;
    const newLoc: MandorLocation = {
      id: `LOC-${Date.now().toString().slice(-4)}`,
      locationName: tempLocationName.trim(),
      status: 'Aktif',
      date: new Date().toISOString().slice(0, 10),
    };
    setLocationsList([...locationsList, newLoc]);
    setTempLocationName('');
  };

  const handleRemoveLocationItem = (index: number) => {
    const newList = [...locationsList];
    newList.splice(index, 1);
    setLocationsList(newList);
  };

  const handleSubmitMandor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mandorName.trim() || !workLocation.trim()) return;

    const selectedSpbj = spbjList.find(s => s.id === selectedSpbjId);
    const matchingProj = projects.find(p => p.name === selectedSpbj?.projectName);

    // Default primary location + any additional locations in locationsList
    const initialLocations: MandorLocation[] = [
      {
        id: `LOC-PRM-${Date.now()}`,
        locationName: workLocation.trim(),
        projectName: selectedSpbj?.projectName || 'Proyek Utama',
        status: 'Aktif',
        date: new Date().toISOString().slice(0, 10),
      },
      ...locationsList
    ];

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
      manpowerList: manpowerList.length > 0 ? manpowerList : undefined,
      ktpPhotoUrl: ktpPhotoUrl.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
      locations: initialLocations,
    };

    onAddMandor(newMandorRecord);

    // Reset Form
    setMandorName('');
    setMandorPhone('');
    setWorkLocation('');
    setSubcontractorTeam('');
    setNotes('');
    setManpowerList([]);
    setLocationsList([]);
    setWorkerCount(0);
    setKtpPhotoUrl('');
    setShowInputForm(false);
  };

  const handleSaveEditLocation = () => {
    if (!editingMandor || !editLocationInput.trim()) return;

    const updatedLocations = editingMandor.locations ? [...editingMandor.locations] : [];
    if (newLocInput.trim()) {
      updatedLocations.push({
        id: `LOC-${Date.now()}`,
        locationName: newLocInput.trim(),
        status: 'Aktif',
        date: new Date().toISOString().slice(0, 10),
      });
    }

    onUpdateMandorLocation(editingMandor.id, editLocationInput.trim());
    editingMandor.locations = updatedLocations;

    setEditingMandor(null);
    setEditLocationInput('');
    setNewLocInput('');
  };

  // Filter Mandors with multiple locations (>= 2 locations)
  const multiLocationMandors = mandors.filter(m => m.locations && m.locations.length > 1);

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-500" />
            <span>Mandor Pekerjaan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring Mandor Pekerjaan & Penugasan Multi-Lokasi dengan Manpower.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'table' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Tabel Monitoring ({mandors.length})
            </button>
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'grid' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Grid Card ({mandors.length})
            </button>
            <button
              onClick={() => setActiveTab('multi-location')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'multi-location' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Lokasi ({multiLocationMandors.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'map' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Peta Sebaran SPBJ</span>
            </button>
          </div>

          <button
            onClick={() => setShowInputForm(!showInputForm)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm shadow-amber-400/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{showInputForm ? 'Tutup Form' : 'Input Mandor Baru'}</span>
          </button>
        </div>
      </div>

      {/* Form Input Mandor (Collapsible) */}
      {showInputForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-400/40 dark:border-amber-500/30 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Formulir Pendaftaran Mandor & Upload Foto KTP
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">PT Sapta Manunggal Karya ME</span>
          </div>

          <form onSubmit={handleSubmitMandor} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Nama Mandor */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Mandor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Bapak Karmin Suhartono"
                  value={mandorName}
                  onChange={(e) => setMandorName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* No Kontak / WA */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="misal: +62 812-9900-1122"
                  value={mandorPhone}
                  onChange={(e) => setMandorPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Foto KTP Upload / URL */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
              <label className="block font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <IdCard className="w-4 h-4 text-amber-500" />
                <span>Foto KTP Mandor (Link URL / Bukti KTP)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (atau biarkan default)"
                  value={ktpPhotoUrl}
                  onChange={(e) => setKtpPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
                {ktpPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewKtpUrl(ktpPhotoUrl)}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                Masukkan tautan foto KTP mandor yang valid atau gunakan gambar contoh otomatis sistem.
              </p>
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
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  >
                    {spbjList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detail Lokasi Pekerjaan Utama */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lokasi Pekerjaan Utama (Site 1) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Terminal 3 Substation B-02"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* MULTI-LOCATIONS ASSIGNMENT (Fitur 1 Mandor Multi-Lokasi) */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Tambahan Lokasi / Site Lain (Opsional untuk Multi-Lokasi)</span>
                </label>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  Fitur Multi-Site
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="misal: Gardu Hub Bintaro Sektor 7 (Site 2)..."
                  value={tempLocationName}
                  onChange={(e) => setTempLocationName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddLocationItem}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Tambah Lokasi
                </button>
              </div>

              {locationsList.length > 0 && (
                <div className="space-y-1 pt-1">
                  {locationsList.map((loc, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>Site Tambahan #{idx + 1}: {loc.locationName}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocationItem(idx)}
                        className="text-rose-500 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Manpower Management Section */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Daftar Anggota Tim / Manpower (Nama & KTP)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5 relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Nama Manpower"
                    value={tempManpowerName}
                    onChange={(e) => setTempManpowerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-5 relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Nomor KTP"
                    value={tempManpowerKtp}
                    onChange={(e) => setTempManpowerKtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddManpower}
                    className="w-full h-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {manpowerList.length > 0 && (
                <div className="mt-3 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl">
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
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Tim / Sub-Kontraktor
                </label>
                <input
                  type="text"
                  placeholder="misal: Tim Subkon High Voltage SMK"
                  value={subcontractorTeam}
                  onChange={(e) => setSubcontractorTeam(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Spesialisasi Mandor
                </label>
                <input
                  type="text"
                  placeholder="misal: Trafo 20kV & Cable Tray"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Penugasan
              </label>
              <textarea
                rows={2}
                placeholder="misal: Penanggung jawab terminasi busduct dan pengawasan JSA K3..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-sm"
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
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="md:col-span-5">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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

      {/* TAB CONTENT 1: TABEL MONITORING MANDOR PEKERJAAN (Sesuai Foto Attachment User) */}
      {activeTab === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 bg-slate-900 text-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono font-bold text-sm">
              <HardHat className="w-4 h-4 text-amber-500" />
              <span>TABEL MONITORING MANDOR PEKERJAAN</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/20">
                1 Mandor Multi-Lokasi & Manpower
              </span>
              <span>Total: {filteredMandors.length} Mandor</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-300 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 border-r border-slate-800 text-center w-12 font-bold text-amber-400">NO</th>
                  <th className="px-4 py-3 border-r border-slate-800 font-bold text-amber-400">Mandor</th>
                  <th className="px-4 py-3 border-r border-slate-800 font-bold text-amber-400">Lokasi</th>
                  <th className="px-4 py-3 border-r border-slate-800 font-bold text-amber-400">Manpower</th>
                  <th className="px-4 py-3 border-r border-slate-800 font-bold text-amber-400">Lokasi</th>
                  <th className="px-4 py-3 border-r border-slate-800 font-bold text-amber-400">Manpower</th>
                  <th className="px-4 py-3 border-r border-slate-800 text-center font-bold text-amber-400">Foto KTP</th>
                  <th className="px-4 py-3 border-r border-slate-800 text-center font-bold text-amber-400">Status</th>
                  <th className="px-4 py-3 text-right font-bold text-amber-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredMandors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-slate-500 font-mono">
                      Tidak ada data mandor pekerjaan yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredMandors.map((m, idx) => {
                    const loc1 = m.locations && m.locations.length > 0 ? m.locations[0].locationName : m.workLocation;
                    const loc2 = m.locations && m.locations.length > 1 ? m.locations[1].locationName : '-';
                    const mpCount1 = m.workerCount > 0 ? `${m.workerCount} Teknisi` : '0 Orang';
                    const mpCount2 = m.locations && m.locations.length > 1 ? 'Tim Subkon' : '-';

                    return (
                      <tr key={m.id} className="hover:bg-amber-500/5 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-amber-500 text-sm">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{m.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{m.phone}</div>
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{m.subcontractorTeam}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800 font-medium">
                          <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{loc1}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[180px]">{m.projectName}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold font-mono border border-amber-500/30">
                            <Users className="w-3.5 h-3.5 text-amber-500" />
                            {mpCount1}
                          </span>
                          {m.manpowerList && m.manpowerList.length > 0 && (
                            <div className="text-[10px] text-slate-500 mt-1 truncate max-w-[150px]" title={m.manpowerList.map(p => p.name).join(', ')}>
                              {m.manpowerList.map(p => p.name).join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800 font-medium">
                          {loc2 !== '-' ? (
                            <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>{loc2}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          {loc2 !== '-' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold font-mono border border-blue-500/30">
                              <Users className="w-3.5 h-3.5 text-blue-500" />
                              {mpCount2}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800 text-center">
                          <button
                            onClick={() => setPreviewKtpUrl(m.ktpPhotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-500/30 transition-colors"
                            title="Lihat Foto KTP Mandor"
                          >
                            <IdCard className="w-3.5 h-3.5" />
                            <span>Lihat KTP</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setEditingMandor(m);
                              setEditLocationInput(m.workLocation);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                          >
                            + Lokasi
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: GRID VIEW SEMUA MANDOR */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMandors.map((mandor) => (
            <div
              key={mandor.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base shrink-0 border border-amber-400/30">
                      <HardHat className="w-6 h-6" />
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

                  {/* KTP Preview Button */}
                  <button
                    onClick={() => setPreviewKtpUrl(mandor.ktpPhotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80')}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-amber-400/10 hover:text-amber-500 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold transition-colors border border-slate-200 dark:border-slate-700"
                    title="Lihat Foto KTP Mandor"
                  >
                    <IdCard className="w-3.5 h-3.5 text-amber-500" />
                    <span>KTP</span>
                  </button>
                </div>

                {/* Lokasi Pekerjaan Utama & Multi-Lokasi Badge */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Lokasi Aktif Utama:</span>
                    </span>
                    {mandor.locations && mandor.locations.length > 1 && (
                      <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                        {mandor.locations.length} Lokasi Sekaligus
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white pl-5 leading-relaxed">
                    {mandor.workLocation}
                  </p>

                  {/* Daftar Multi Lokasi Jika Ada */}
                  {mandor.locations && mandor.locations.length > 1 && (
                    <div className="pt-2 pl-5 space-y-1 border-t border-amber-500/20">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Lokasi Pengawasan Lainnya:</span>
                      {mandor.locations.slice(1).map((loc, lIdx) => (
                        <div key={lIdx} className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{loc.locationName}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Anggota / Manpower:
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
                      <IdCard className="w-3 h-3" /> Anggota Tim Terdaftar ({mandor.manpowerList.length}):
                    </span>
                    <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
                      {mandor.manpowerList.map((mp, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-900 dark:text-white">{mp.name}</span>
                          <span className="text-slate-400 font-mono">{mp.ktpNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Tambah Lokasi Kerja</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 2: MONITORING MULTI-LOKASI MANDOR */}
      {activeTab === 'multi-location' && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex items-start gap-3">
            <Layers className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Dashboard Monitoring 1 Mandor di Beberapa Lokasi Sekaligus
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Berikut adalah daftar mandor yang aktif mengawasi dan mengerjakan proyek di lebih dari satu lokasi (multi-site supervision) secara bersamaan.
              </p>
            </div>
          </div>

          {multiLocationMandors.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <HardHat className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Belum ada mandor dengan multi-lokasi aktif</h4>
              <p className="text-xs text-slate-500">Tambahkan lokasi kerja tambahan pada profil mandor untuk melihat pemantauan multi-site di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {multiLocationMandors.map((mandor) => (
                <div key={mandor.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center font-bold">
                        <HardHat className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{mandor.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{mandor.subcontractorTeam}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950">
                      {mandor.locations?.length || 0} Lokasi Kerja
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Daftar Lokasi Penugasan Aktif:
                    </span>
                    <div className="space-y-2">
                      {mandor.locations?.map((loc, lIdx) => (
                        <div key={lIdx} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {loc.locationName}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              Mulai Pengawasan: {loc.date} · Proyek: {mandor.projectName}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {loc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Kontak: <strong className="font-mono text-slate-800 dark:text-slate-200">{mandor.phone}</strong></span>
                    <button
                      onClick={() => {
                        setEditingMandor(mandor);
                        setEditLocationInput(mandor.workLocation);
                      }}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      + Tambah Lokasi Lain
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: PETA SEBARAN MANDOR & SPBJ */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Geographic Site & SPBJ Distribution Map</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Peta Sebaran Pekerjaan Mandor & Alokasi SPBJ
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Visualisasi sebaran titik lokasi kerja mandor di lapangan yang terhubung dengan kontrak Surat Perjanjian Barang dan Jasa (SPBJ) PLN.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <label className="text-xs font-bold text-slate-300">Filter SPBJ:</label>
              <select
                value={mapSpbjFilter}
                onChange={(e) => setMapSpbjFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Semua SPBJ Kontrak ({spbjList.length})</option>
                {spbjList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.spbjNumber} ({s.up3Name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Map Visual Mockup / Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl relative overflow-hidden min-h-[420px] flex flex-col">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              <div className="relative z-10 p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>GPS Tracking Active · {mandors.length} Mandor On-Site</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  Koordinat Area UP3 / PLN Distribution
                </span>
              </div>

              {/* Interactive Map */}
              <div className="flex-1 w-full h-[400px]">
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
                  <Map 
                    mapId="DEMO_MAP_ID" 
                    defaultCenter={{ lat: -5.6, lng: 132.7 }} 
                    defaultZoom={12}
                    disableDefaultUI
                    gestureHandling={'greedy'}
                  >
                    {mandors
                      .filter((m) => mapSpbjFilter === 'all' || m.projectId === mapSpbjFilter || m.projectName?.includes(mapSpbjFilter))
                      .map((m) => {
                         // Fallback logic for coordinates since mandor doesn't store them directly
                         // In a real scenario, use mandor location tags if available
                         const lat = -5.6 + (Math.random() * 0.2 - 0.1);
                         const lng = 132.7 + (Math.random() * 0.2 - 0.1);
                         return (
                          <AdvancedMarker key={m.id} position={{ lat, lng }} title={m.name}>
                            <div className="relative group">
                              <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                <HardHat className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </AdvancedMarker>
                         );
                      })}
                  </Map>
                </APIProvider>
              </div>
            </div>

            {/* Side Summary Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Statistik Sebaran SPBJ Mandor</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Total Mandor Aktif</span>
                  <strong className="text-amber-400 font-mono text-sm">{mandors.length} Orang</strong>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Total Teknis Lapangan (Manpower)</span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    {mandors.reduce((sum, m) => sum + m.workerCount, 0)} Personil
                  </strong>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Mandor Multi-Lokasi</span>
                  <strong className="text-blue-400 font-mono text-sm">{multiLocationMandors.length} Mandor</strong>
                </div>
              </div>

              <div className="bg-amber-400/10 border border-amber-400/20 p-4 rounded-xl text-xs text-amber-300 space-y-1">
                <strong>Informasi Rute & Wilayah Kerja:</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Setiap mandor terhubung langsung dengan dokumen Surat Perjanjian Barang dan Jasa (SPBJ) PLN untuk memastikan akurasi penugasan dan pertanggungjawaban operasional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: KTP Photo Preview */}
      {previewKtpUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <IdCard className="w-5 h-5 text-amber-500" />
                <span>Verifikasi Foto KTP Mandor</span>
              </h3>
              <button
                onClick={() => setPreviewKtpUrl(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-800">
              <img
                src={previewKtpUrl}
                alt="KTP Mandor"
                className="max-h-80 object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <p className="text-xs text-slate-500 text-center">
              Dokumen KTP mandor terverifikasi valid sesuai standar administrasi proyek PT Sapta Manunggal Karya.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewKtpUrl(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Location Modal */}
      {editingMandor && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tambah Lokasi Kerja untuk Mandor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mandor: <strong className="text-slate-900 dark:text-white">{editingMandor.name}</strong> ({editingMandor.subcontractorTeam})
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lokasi Pekerjaan Utama / Catatan Site
              </label>
              <input
                type="text"
                value={editLocationInput}
                onChange={(e) => setEditLocationInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tambah Lokasi Site Lainnya (Multi-Lokasi)
              </label>
              <input
                type="text"
                value={newLocInput}
                onChange={(e) => setNewLocInput(e.target.value)}
                placeholder="misal: Gardu Distribusi Cikarang Center..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
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
                className="px-5 py-2 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

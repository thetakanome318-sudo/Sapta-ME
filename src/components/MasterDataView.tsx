import React, { useState } from 'react';
import { Project } from '../types';
import { 
  Database, 
  Plus, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  Zap
} from 'lucide-react';

interface MasterDataViewProps {
  projects: Project[];
  onAddProject: (newProject: Project) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({ projects, onAddProject }) => {
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'up3' | 'vendors' | 'standards'>('projects');
  
  // New Project Form State
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projCode, setProjCode] = useState('');
  const [projName, setProjName] = useState('');
  const [projClient, setProjClient] = useState('PLN UID Maluku & Maluku Utara');
  const [projLocation, setProjLocation] = useState('');
  const [projManager, setProjManager] = useState('Ir. Hendra Wijaya, MT');
  const [projValue, setProjValue] = useState('Rp 2.000.000.000');
  const [projVoltage, setProjVoltage] = useState<Project['voltageCategory']>('Tegangan Menengah 1kV-20kV');

  // Master UP3 List
  const [up3List, setUp3List] = useState([
    { id: 'UP3-01', code: 'UP3-TUA', name: 'UP3 Tual', region: 'Maluku & Maluku Utara', contact: '0812-4455-6677' },
    { id: 'UP3-02', code: 'UP3-CKG', name: 'UP3 Cengkareng', region: 'DKI Jakarta & Banten', contact: '0813-1122-3344' },
    { id: 'UP3-03', code: 'UP3-BSH', name: 'UP3 Bandara Soekarno-Hatta', region: 'Banten', contact: '0811-9988-7766' },
    { id: 'UP3-04', code: 'UP3-CKR', name: 'UP3 Cikarang', region: 'Jawa Barat', contact: '0857-3344-5566' },
  ]);

  // Master Vendors
  const [vendorList, setVendorList] = useState([
    { id: 'VND-01', name: 'PT Sapta Manunggal Karya (Main Contractor)', scope: 'Mekanikal & Elektrikal Utama', status: 'Aktif' },
    { id: 'VND-02', name: 'PT Sinar High Voltage Indonesia', scope: 'Spesialis Cable Jointing 20kV', status: 'Mitra' },
    { id: 'VND-03', name: 'CV Mandiri Teknik Mandau', scope: 'Subkon Pemasangan Trafo & Panel', status: 'Mitra' },
  ]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projCode.trim() || !projName.trim()) return;

    const newProj: Project = {
      id: `PRJ-${Date.now().toString().slice(-4)}`,
      code: projCode.trim(),
      name: projName.trim(),
      client: projClient,
      location: projLocation.trim() || 'Lokasi Proyek PLN',
      manager: projManager,
      progress: 0,
      status: 'Aktif',
      totalWorkers: 10,
      image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      targetDate: '2026-12-31',
      voltageCategory: projVoltage,
      description: 'Proyek Kelistrikan Mekanikal Elektrikal terdaftar dalam Master Data.',
      contractValue: projValue,
    };

    onAddProject(newProj);
    setProjCode('');
    setProjName('');
    setProjLocation('');
    setShowProjectForm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-amber-500" />
            <span>Master Data & Referensi Sistem</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pengelolaan database master proyek, daftar UP3 PLN, mitra vendor subkontraktor, dan standar regulasi kelistrikan.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('projects')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'projects'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Master Proyek ({projects.length})
        </button>
        <button
          onClick={() => setActiveSubTab('up3')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'up3'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Master UP3 PLN ({up3List.length})
        </button>
        <button
          onClick={() => setActiveSubTab('vendors')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'vendors'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Master Vendor & Mitra ({vendorList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('standards')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'standards'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Standar K3 & PUIL
        </button>
      </div>

      {activeSubTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Master Proyek Kelistrikan ME
            </h3>
            <button
              onClick={() => setShowProjectForm(!showProjectForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek Master</span>
            </button>
          </div>

          {showProjectForm && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-amber-400/40 p-5 space-y-4 shadow-md">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Form Input Master Proyek Baru
              </h4>
              <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kode Proyek <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="misal: SMK-ME-2026-005"
                      value={projCode}
                      onChange={(e) => setProjCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Proyek / Pekerjaan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="misal: Pembangunan Jaringan Distribusi Lisdes..."
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Klien / Pemberi Kerja
                    </label>
                    <input
                      type="text"
                      value={projClient}
                      onChange={(e) => setProjClient(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Lokasi / Wilayah Site
                    </label>
                    <input
                      type="text"
                      placeholder="misal: Desa Tamangil UP3 Tual"
                      value={projLocation}
                      onChange={(e) => setProjLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori Tegangan
                    </label>
                    <select
                      value={projVoltage}
                      onChange={(e) => setProjVoltage(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="Tegangan Tinggi 20kV">Tegangan Tinggi 20kV</option>
                      <option value="Tegangan Menengah 1kV-20kV">Tegangan Menengah 1kV-20kV</option>
                      <option value="Tegangan Rendah 380V">Tegangan Rendah 380V</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProjectForm(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow-sm"
                  >
                    Simpan Proyek Master
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    {proj.code}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {proj.voltageCategory}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {proj.name}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p>Klien: <strong className="text-slate-700 dark:text-slate-300">{proj.client}</strong></p>
                  <p>Lokasi: <strong className="text-slate-700 dark:text-slate-300">{proj.location}</strong></p>
                  <p>PM: <strong className="text-slate-700 dark:text-slate-300">{proj.manager}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'up3' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Master Daftar UP3 PLN Terdaftar
            </h3>
            <span className="text-xs text-slate-500 font-mono">Total {up3List.length} Unit</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5">Kode UP3</th>
                  <th className="p-3.5">Nama Unit Pelayanan (UP3)</th>
                  <th className="p-3.5">Wilayah Kerja / Region</th>
                  <th className="p-3.5">Kontak / PIC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {up3List.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">{u.code}</td>
                    <td className="p-3.5 font-semibold text-amber-600 dark:text-amber-400">{u.name}</td>
                    <td className="p-3.5">{u.region}</td>
                    <td className="p-3.5 font-mono">{u.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'vendors' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Master Vendor & Mitra Subkontraktor
            </h3>
            <span className="text-xs text-slate-500 font-mono">Total {vendorList.length} Vendor</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5">Nama Perusahaan / Vendor</th>
                  <th className="p-3.5">Ruang Lingkup Pekerjaan</th>
                  <th className="p-3.5">Status Kemitraan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {vendorList.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{v.name}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{v.scope}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'standards' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Standar K3 & PUIL 2020 PT Sapta Manunggal Karya</span>
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Seluruh pekerjaan Mekanikal Elektrikal (ME) yang dilaksanakan oleh PT Sapta Manunggal Karya wajib mematuhi standar keamanan ketat berdasarkan:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-200 font-medium">
            <li>Persyaratan Umum Instalasi Listrik (PUIL) 2020 (SNI 0225:2020).</li>
            <li>Standar Prosedur LOTO (Lockout Tagout) untuk pemutusan arus menengah 20kV & rendah 380V.</li>
            <li>Pengujian Tahanan Isolasi (Megger Test 10kV) dan Tahanan Pembumian (Grounding &lt; 1 Ohm).</li>
            <li>Wajib penggunaan APD lengkap (Helm Non-Konduktif, Sepatu 10kV, VDE Gloves Class 3).</li>
          </ul>
        </div>
      )}
    </div>
  );
};

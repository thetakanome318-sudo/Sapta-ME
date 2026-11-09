import React, { useState, useRef } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  CreditCard, 
  Eye, 
  X, 
  Phone, 
  MapPin, 
  HardHat, 
  Briefcase, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Image as ImageIcon
} from 'lucide-react';
import { ManpowerRecord, SpbjContract, Mandor } from '../types';

interface ManpowerListViewProps {
  manpowerList: ManpowerRecord[];
  spbjList: SpbjContract[];
  mandors: Mandor[];
  onAddManpower: (manpower: Omit<ManpowerRecord, 'id'>) => void;
  onUpdateManpower: (manpower: ManpowerRecord) => void;
  onDeleteManpower: (id: string) => void;
}

const ROLE_OPTIONS = [
  'Lineman / Teknisi Penarikan Kabel',
  'Jointer & Terminasi Kabel 20kV',
  'Teknisi Panel & Wiring',
  'Tim Gali Lubang Tiang & Pondasi',
  'Erector Tiang & Travers',
  'Helper & Langsir Material',
  'Driver Truk Crane & Operasional',
  'Welder & Pipe Fitter',
  'Ahli K3 & Safety Man',
  'Tenaga Kasar Harian'
];

export const ManpowerListView: React.FC<ManpowerListViewProps> = ({
  manpowerList,
  spbjList,
  mandors,
  onAddManpower,
  onUpdateManpower,
  onDeleteManpower,
}) => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpbj, setSelectedSpbj] = useState('ALL');
  const [selectedMandor, setSelectedMandor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [ktpFilter, setKtpFilter] = useState<'ALL' | 'HAS_KTP' | 'NO_KTP'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ManpowerRecord | null>(null);
  const [viewingKtpPhoto, setViewingKtpPhoto] = useState<{ url: string; name: string; nik?: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Form States
  const [formName, setFormName] = useState('');
  const [formKtpNumber, setFormKtpNumber] = useState('');
  const [formKtpPhotoUrl, setFormKtpPhotoUrl] = useState('');
  const [formMandorId, setFormMandorId] = useState('');
  const [formSpbjId, setFormSpbjId] = useState('');
  const [formRole, setFormRole] = useState(ROLE_OPTIONS[0]);
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStatus, setFormStatus] = useState<ManpowerRecord['status']>('Aktif On-Site');
  const [formNotes, setFormNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered dataset
  const filteredList = manpowerList.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ktpNumber && item.ktpNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.role && item.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.phone && item.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpbj = selectedSpbj === 'ALL' || item.spbjId === selectedSpbj;
    const matchesMandor = selectedMandor === 'ALL' || item.mandorId === selectedMandor;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    
    const matchesKtp = 
      ktpFilter === 'ALL' ||
      (ktpFilter === 'HAS_KTP' && !!item.ktpPhotoUrl) ||
      (ktpFilter === 'NO_KTP' && !item.ktpPhotoUrl);

    return matchesSearch && matchesSpbj && matchesMandor && matchesStatus && matchesKtp;
  });

  // KPI Statistics
  const totalCount = manpowerList.length;
  const activeCount = manpowerList.filter(m => m.status === 'Aktif On-Site').length;
  const withKtpCount = manpowerList.filter(m => !!m.ktpPhotoUrl).length;
  const standbyCount = manpowerList.filter(m => m.status === 'Standby').length;

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormKtpNumber('');
    setFormKtpPhotoUrl('');
    setFormMandorId(mandors.length > 0 ? mandors[0].id : '');
    setFormSpbjId(spbjList.length > 0 ? spbjList[0].id : '');
    setFormRole(ROLE_OPTIONS[0]);
    setFormPhone('');
    setFormAddress('');
    setFormStatus('Aktif On-Site');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: ManpowerRecord) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormKtpNumber(item.ktpNumber || '');
    setFormKtpPhotoUrl(item.ktpPhotoUrl || '');
    setFormMandorId(item.mandorId || (mandors.length > 0 ? mandors[0].id : ''));
    setFormSpbjId(item.spbjId || (spbjList.length > 0 ? spbjList[0].id : ''));
    setFormRole(item.role);
    setFormPhone(item.phone || '');
    setFormAddress(item.address || '');
    setFormStatus(item.status);
    setFormNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  // Handle File Input for KTP Photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormKtpPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const selectedMandorObj = mandors.find(m => m.id === formMandorId);
    const selectedSpbjObj = spbjList.find(s => s.id === formSpbjId);

    const payload = {
      name: formName.trim(),
      ktpNumber: formKtpNumber.trim() || undefined,
      ktpPhotoUrl: formKtpPhotoUrl.trim() || undefined,
      mandorId: formMandorId || undefined,
      mandorName: selectedMandorObj ? selectedMandorObj.name : undefined,
      spbjId: formSpbjId || undefined,
      projectName: selectedSpbjObj ? selectedSpbjObj.projectName : undefined,
      role: formRole,
      phone: formPhone.trim() || undefined,
      address: formAddress.trim() || undefined,
      status: formStatus,
      joinDate: editingItem ? editingItem.joinDate : new Date().toISOString().split('T')[0],
      notes: formNotes.trim() || undefined,
    };

    if (editingItem) {
      onUpdateManpower({
        ...editingItem,
        ...payload,
      });
    } else {
      onAddManpower(payload);
    }

    setIsAddModalOpen(false);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Daftar Man Power & Data KTP - PT Sapta Manunggal Karya</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #1e293b; }
            h2 { margin: 0 0 4px 0; color: #0f172a; }
            h4 { margin: 0 0 16px 0; color: #64748b; font-weight: normal; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 7px 9px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
            .aktif { background: #dcfce7; color: #166534; }
            .standby { background: #fef3c7; color: #92400e; }
            .nonaktif { background: #fee2e2; color: #991b1b; }
            .meta { font-size: 11px; color: #64748b; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>PT SAPTA MANUNGGAL KARYA · DIVISI ME</h2>
          <h4>Rekapitulasi Man Power & Kelengkapan Identitas KTP Tenaga Kerja</h4>
          <p style="font-size: 11px;">Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} | Total Personil: ${filteredList.length}</p>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pekerja</th>
                <th>NIK / No KTP</th>
                <th>Status KTP</th>
                <th>Keahlian / Posisi</th>
                <th>Mandor PJ</th>
                <th>SPBJ / Lokasi</th>
                <th>No HP</th>
                <th>Status Kerja</th>
              </tr>
            </thead>
            <tbody>
              ${filteredList.map((m, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${m.name}</strong></td>
                  <td>${m.ktpNumber || '-'}</td>
                  <td>${m.ktpPhotoUrl ? '✓ Terlampir' : 'Belum Ada'}</td>
                  <td>${m.role}</td>
                  <td>${m.mandorName || '-'}</td>
                  <td>${m.projectName || m.spbjId || '-'}</td>
                  <td>${m.phone || '-'}</td>
                  <td><span class="badge ${m.status === 'Aktif On-Site' ? 'aktif' : m.status === 'Standby' ? 'standby' : 'nonaktif'}">${m.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="meta">
            Dokumen internal pengawasan ketenagakerjaan dan kepatuhan K3 PT Sapta Manunggal Karya.
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Users className="w-64 h-64 text-amber-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Monitoring Pekerjaan: Daftar Man Power & KTP</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Daftar Man Power & Identitas KTP</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Database personil tenaga kerja lapangan, input nama lengkap pekerja, upload dan verifikasi foto KTP, serta penempatan tim per SPBJ dan mandor.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Cetak Rekap PDF</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Input Man Power Baru</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-slate-400">Total Man Power</span>
            <div className="text-xl font-bold text-white mt-0.5">{totalCount} Personil</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-emerald-400">Aktif On-Site</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{activeCount} Orang</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-blue-400">KTP Terverifikasi</span>
            <div className="text-xl font-bold text-blue-400 mt-0.5">{withKtpCount} File KTP</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-amber-400">Standby / Cadangan</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{standbyCount} Orang</div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama pekerja, NIK KTP, keahlian, nomor HP, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tabel Detail
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'cards' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kartu Profil
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/60">
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Filter SPBJ Proyek</label>
            <select
              value={selectedSpbj}
              onChange={(e) => setSelectedSpbj(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
            >
              <option value="ALL">Semua SPBJ Proyek</option>
              {spbjList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Filter Mandor</label>
            <select
              value={selectedMandor}
              onChange={(e) => setSelectedMandor(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
            >
              <option value="ALL">Semua Mandor</option>
              {mandors.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Status Keberadaan</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
            >
              <option value="ALL">Semua Status</option>
              <option value="Aktif On-Site">Aktif On-Site</option>
              <option value="Standby">Standby</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Kelengkapan Foto KTP</label>
            <select
              value={ktpFilter}
              onChange={(e) => setKtpFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
            >
              <option value="ALL">Semua (Lengkap & Belum)</option>
              <option value="HAS_KTP">KTP Sudah Diupload (Ada Foto)</option>
              <option value="NO_KTP">Belum Upload KTP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {filteredList.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Tidak ada data man power ditemukan</h3>
          <p className="text-slate-400 text-xs mt-1">Silakan sesuaikan kata kunci pencarian atau tambah personil man power baru.</p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            Input Man Power Baru
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Pekerja</th>
                  <th className="py-3 px-4">No. NIK / KTP</th>
                  <th className="py-3 px-4 text-center">Foto KTP</th>
                  <th className="py-3 px-4">Posisi & Keahlian</th>
                  <th className="py-3 px-4">Mandor PJ</th>
                  <th className="py-3 px-4">Penempatan SPBJ</th>
                  <th className="py-3 px-4">Kontak</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs border border-amber-400/30">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{item.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.ktpNumber ? (
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-700">
                          {item.ktpNumber}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.ktpPhotoUrl ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setViewingKtpPhoto({ url: item.ktpPhotoUrl!, name: item.name, nik: item.ktpNumber })}
                            className="group relative w-12 h-8 rounded-md overflow-hidden border border-amber-400/50 hover:border-amber-400 transition-all cursor-pointer shadow-xs"
                            title="Klik untuk zoom pratinjau KTP"
                          >
                            <img 
                              src={item.ktpPhotoUrl} 
                              alt={`KTP ${item.name}`} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-3.5 h-3.5 text-white" />
                            </div>
                          </button>
                          <span className="text-[10px] font-bold text-emerald-400">Ada</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertCircle className="w-3 h-3" />
                          Belum Ada
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-white text-xs font-semibold">{item.role}</div>
                      {item.notes && <div className="text-[10px] text-slate-400 line-clamp-1">{item.notes}</div>}
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div className="font-semibold text-slate-200">{item.mandorName || '-'}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div className="text-[11px] text-amber-400 font-mono font-bold">{item.spbjId || '-'}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{item.projectName || '-'}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {item.phone ? (
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{item.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Aktif On-Site'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'Standby'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.ktpPhotoUrl && (
                          <button
                            onClick={() => setViewingKtpPhoto({ url: item.ktpPhotoUrl!, name: item.name, nik: item.ktpNumber })}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Pratinjau KTP"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Data Pekerja"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus data pekerja ${item.name}?`)) {
                              onDeleteManpower(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-sm border border-amber-400/30">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                      <div className="text-[10px] text-amber-400 font-medium mt-0.5">{item.role}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    item.status === 'Aktif On-Site'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : item.status === 'Standby'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* KTP Section in Card */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      NIK / KTP:
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {item.ktpNumber || 'Belum diisi'}
                    </span>
                  </div>

                  {item.ktpPhotoUrl ? (
                    <div 
                      onClick={() => setViewingKtpPhoto({ url: item.ktpPhotoUrl!, name: item.name, nik: item.ktpNumber })}
                      className="relative h-28 rounded-lg overflow-hidden border border-slate-700/80 group cursor-pointer bg-slate-900"
                    >
                      <img 
                        src={item.ktpPhotoUrl} 
                        alt={`KTP ${item.name}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity text-white text-xs font-semibold">
                        <Eye className="w-4 h-4" />
                        Pratinjau KTP Penuh
                      </div>
                    </div>
                  ) : (
                    <div className="h-20 rounded-lg border border-dashed border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center text-slate-500 text-[11px]">
                      <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                      Foto KTP belum diinput
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Mandor PJ:</span>
                    <span className="font-semibold text-slate-200">{item.mandorName || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">SPBJ:</span>
                    <span className="font-mono text-amber-400 font-bold">{item.spbjId || '-'}</span>
                  </div>
                  {item.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">HP:</span>
                      <span className="font-mono text-emerald-400">{item.phone}</span>
                    </div>
                  )}
                  {item.address && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">Alamat:</span>
                      <span className="text-right line-clamp-1">{item.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Hapus data pekerja ${item.name}?`)) {
                      onDeleteManpower(item.id);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Input / Edit Man Power Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingItem ? 'Edit Data Man Power' : 'Input Man Power Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lengkapi identitas nama pekerja dan upload file KTP
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Nama Pekerja (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Lengkap Pekerja <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Yohanes Rumalutur"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Upload Foto KTP (File KTP Di-input) */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <label className="block text-xs font-bold text-amber-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    File Foto KTP Pekerja
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">PNG / JPG / WEBP</span>
                </label>

                {formKtpPhotoUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-amber-400/50 bg-slate-900 group">
                    <img 
                      src={formKtpPhotoUrl} 
                      alt="Pratinjau KTP" 
                      className="w-full max-h-48 object-contain bg-slate-950" 
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md border border-slate-700"
                      >
                        Ganti File
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormKtpPhotoUrl('')}
                        className="p-1 bg-rose-600/90 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md"
                        title="Hapus Foto KTP"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-900/30"
                  >
                    <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-bold text-white">Klik untuk Pilih File Foto KTP</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ambil dari kamera ponsel atau pilih file gambar identitas KTP</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Input URL Alternatif jika ada link web */}
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Atau tempel link URL foto KTP..."
                    value={formKtpPhotoUrl.startsWith('data:') ? '' : formKtpPhotoUrl}
                    onChange={(e) => setFormKtpPhotoUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* No KTP / NIK */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nomor NIK / No. KTP (16 Digit)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Contoh: 8172011204940003"
                  value={formKtpNumber}
                  onChange={(e) => setFormKtpNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Posisi & Mandor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Posisi / Keahlian Pekerja
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-400"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mandor Penanggung Jawab
                  </label>
                  <select
                    value={formMandorId}
                    onChange={(e) => setFormMandorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="">Pilih Mandor...</option>
                    {mandors.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SPBJ Proyek & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    SPBJ Penempatan Proyek
                  </label>
                  <select
                    value={formSpbjId}
                    onChange={(e) => setFormSpbjId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="">Pilih SPBJ...</option>
                    {spbjList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Status Kerja
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Aktif On-Site">Aktif On-Site</option>
                    <option value="Standby">Standby</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              {/* Kontak HP & Alamat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nomor HP / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="0812-XXXX-XXXX"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Alamat Domisili / Desa Asal
                  </label>
                  <input
                    type="text"
                    placeholder="Desa / Kecamatan / Kota"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Catatan / Sertifikat K3 */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Catatan K3 / Keahlian Khusus
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Sertifikat K3 Ketinggian TKPK 1, APD lengkap, pengalaman terminasi kabel..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-400/20"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Man Power'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Full-size KTP Photo Preview */}
      {viewingKtpPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Foto Identitas KTP - {viewingKtpPhoto.name}
                  </h3>
                  {viewingKtpPhoto.nik && (
                    <p className="text-xs font-mono text-slate-400">NIK: {viewingKtpPhoto.nik}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs font-mono"
                  title="Reset Zoom"
                >
                  100%
                </button>
                <button
                  onClick={() => {
                    setViewingKtpPhoto(null);
                    setZoomLevel(1);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto flex items-center justify-center bg-slate-950/60 min-h-[300px]">
              <img
                src={viewingKtpPhoto.url}
                alt={`KTP ${viewingKtpPhoto.name}`}
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
                className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-2xl border border-slate-700"
              />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Dokumen identitas resmi terdaftar di sistem PT Sapta Manunggal Karya
              </span>
              <a
                href={viewingKtpPhoto.url}
                download={`KTP_${viewingKtpPhoto.name.replace(/\s+/g, '_')}.jpg`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Gambar KTP
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

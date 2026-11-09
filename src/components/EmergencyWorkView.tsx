import React, { useState } from 'react';
import { EmergencyWork, SpbjContract, Mandor } from '../types';
import { 
  AlertTriangle, 
  Siren, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  MapPin, 
  User, 
  Users, 
  ShieldAlert, 
  FileText,
  Wrench,
  CheckSquare
} from 'lucide-react';

interface EmergencyWorkViewProps {
  emergencyWorks: EmergencyWork[];
  spbjList: SpbjContract[];
  mandors: Mandor[];
  onAddEmergencyWork: (work: Omit<EmergencyWork, 'id'>) => void;
  onUpdateStatus: (id: string, status: EmergencyWork['status']) => void;
  workType: 'Emergency' | 'Rehap' | 'Pohon Tumbang' | 'Lain-lain';
}

export const EmergencyWorkView: React.FC<EmergencyWorkViewProps> = ({
  emergencyWorks,
  spbjList,
  mandors,
  onAddEmergencyWork,
  onUpdateStatus,
  workType,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [ticketNumber, setTicketNumber] = useState(`EMG/ME/${new Date().getFullYear()}/${new Date().getMonth() + 1}-${Math.floor(100 + Math.random() * 900)}`);
  const [locationName, setLocationName] = useState('');
  const [spbjId, setSpbjId] = useState(spbjList[0]?.id || '');
  const [severity, setSeverity] = useState<EmergencyWork['severity']>('Kritis / Blackout');
  const [description, setDescription] = useState('');
  const [mandorName, setMandorName] = useState(mandors[0]?.name || 'Bapak Karmin Suhartono');
  const [teamCount, setTeamCount] = useState<number>(4);
  const [reportedTime, setReportedTime] = useState(new Date().toLocaleString('id-ID'));
  const [targetResponseTime, setTargetResponseTime] = useState('2 Jam (SLA Emergency)');
  const [actionTaken, setActionTaken] = useState('');
  const [status, setStatus] = useState<EmergencyWork['status']>('Dalam Penanganan (On-Site)');
  const [reportedBy, setReportedBy] = useState('Call Center PLN / Supervisor Site');
  const [notes, setNotes] = useState('');

  const filteredWorks = emergencyWorks.filter((w) => {
    const matchesSearch =
      w.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.mandorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || w.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = emergencyWorks.filter((w) => w.severity === 'Kritis / Blackout').length;
  const inProgressCount = emergencyWorks.filter((w) => w.status === 'Dalam Penanganan (On-Site)').length;
  const completedCount = emergencyWorks.filter((w) => w.status === 'Selesai / Normal').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !description) return;

    onAddEmergencyWork({
      ticketNumber,
      locationName,
      spbjId: spbjId || undefined,
      severity,
      description,
      mandorName,
      teamCount,
      reportedTime,
      targetResponseTime,
      actionTaken: actionTaken || 'Tim K3 & teknisi disiagakan menuju lokasi.',
      status,
      reportedBy,
      workType,
      notes: notes || undefined,
    });

    // Reset Form
    setLocationName('');
    setDescription('');
    setActionTaken('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleSendWhatsAppDispatch = (work: EmergencyWork) => {
    const text = `🚨 *DISPATCH PEKERJAAN EMERGENCY ME* 🚨\n\n` +
      `*No Tiket:* ${work.ticketNumber}\n` +
      `*Tingkat Darurat:* ${work.severity}\n` +
      `*Lokasi Gangguan:* ${work.locationName}\n` +
      `*Uraian Masalah:* ${work.description}\n` +
      `*Mandor Penanggung Jawab:* ${work.mandorName} (${work.teamCount} Teknisi)\n` +
      `*Waktu Lapor:* ${work.reportedTime}\n` +
      `*Target SLA:* ${work.targetResponseTime}\n` +
      `*Status Saat Ini:* ${work.status}\n\n` +
      `Mohon tim lapangan segera melakukan pengamanan area K3 & penanganan teknis. Terimakasih.\n` +
      `_PT Sapta Manunggal Karya - Divisi ME_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Siren className="w-64 h-64 text-rose-500 animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
              <Siren className="w-3.5 h-3.5" />
              Tanggap Darurat & Fast Response ME
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Pekerjaan {workType}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              {workType === 'Emergency' && 'Monitoring penanganan gangguan mendesak, blackout jaringan 20kV/JTR, perbaikan trafo meledak, dan dispatch tim emergency.'}
              {workType === 'Rehap' && 'Manajemen pemeliharaan rehabilitasi jaringan, penggantian komponen usang, dan peningkatan keandalan sistem.'}
              {workType === 'Pohon Tumbang' && 'Penanganan gangguan akibat dahan/pohon tumbang, koordinasi ROW, dan pembersihan jalur jaringan.'}
              {workType === 'Lain-lain' && 'Monitoring pekerjaan khusus dan penanganan insiden lainnya di luar kategori standar.'}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-sm transition-all shadow-lg shadow-rose-600/20"
          >
            <Plus className="w-4 h-4" />
            Lapor {workType} Baru
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{emergencyWorks.length}</div>
            <div className="text-slate-400 text-xs">Total Laporan Lanjutan</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-rose-600/20 text-rose-500 rounded-lg border border-rose-500/30">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-400">{criticalCount}</div>
            <div className="text-slate-400 text-xs">Insiden Kritis / Blackout</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{inProgressCount}</div>
            <div className="text-slate-400 text-xs">Dalam Penanganan On-Site</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
            <div className="text-slate-400 text-xs">Penormalan Selesai</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari No Tiket, Lokasi, Uraian, Mandor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">Semua Tingkat Risiko</option>
              <option value="Kritis / Blackout">Kritis / Blackout</option>
              <option value="Tinggi / Trip Breaker">Tinggi / Trip Breaker</option>
              <option value="Sedang">Sedang</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">Semua Status Penanganan</option>
            <option value="Dalam Penanganan (On-Site)">Dalam Penanganan (On-Site)</option>
            <option value="Menunggu Sparepart">Menunggu Sparepart</option>
            <option value="Selesai / Normal">Selesai / Normal</option>
          </select>
        </div>
      </div>

      {/* Emergency Work Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">No. Tiket & Tingkat Risiko</th>
                <th className="px-5 py-3.5 font-semibold">Lokasi & Kerusakan ME</th>
                <th className="px-5 py-3.5 font-semibold">Mandor & Tim On-Site</th>
                <th className="px-5 py-3.5 font-semibold">Waktu Lapor & SLA</th>
                <th className="px-5 py-3.5 font-semibold">Tindakan Penanganan</th>
                <th className="px-5 py-3.5 font-semibold">Status Penormalan</th>
                <th className="px-5 py-3.5 font-semibold text-right">Aksi Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredWorks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    Tidak ada pekerjaan emergency yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredWorks.map((work) => {
                  const spbj = spbjList.find((s) => s.id === work.spbjId);
                  return (
                    <tr key={work.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-rose-400 font-mono text-xs">{work.ticketNumber}</div>
                        <div className="mt-1">
                          {work.severity === 'Kritis / Blackout' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                              <Siren className="w-3 h-3" />
                              Kritis / Blackout
                            </span>
                          )}
                          {work.severity === 'Tinggi / Trip Breaker' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              Tinggi / Trip Breaker
                            </span>
                          )}
                          {work.severity === 'Sedang' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              <ShieldAlert className="w-3 h-3" />
                              Sedang
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-xs flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          {work.locationName}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 max-w-xs line-clamp-2">
                          {work.description}
                        </div>
                        {spbj && (
                          <div className="text-[10px] font-mono text-blue-400 mt-1">
                            [{spbj.up3Name}] {spbj.projectName}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {work.mandorName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-400" />
                          {work.teamCount} Teknisi Siaga
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs text-slate-300 font-mono">{work.reportedTime}</div>
                        <div className="text-[11px] text-rose-400 font-semibold mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {work.targetResponseTime}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs text-slate-300 max-w-xs leading-relaxed">
                          {work.actionTaken}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {work.status === 'Dalam Penanganan (On-Site)' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            Dalam Penanganan
                          </span>
                        )}
                        {work.status === 'Menunggu Sparepart' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            <Wrench className="w-3 h-3" />
                            Menunggu Sparepart
                          </span>
                        )}
                        {work.status === 'Selesai / Normal' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Selesai / Normal
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right space-y-2">
                        <button
                          onClick={() => handleSendWhatsAppDispatch(work)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                          title="Kirim Pesan Dispatch WA ke Tim"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch WA</span>
                        </button>
                        <select
                          value={work.status}
                          onChange={(e) =>
                            onUpdateStatus(work.id, e.target.value as EmergencyWork['status'])
                          }
                          className="w-full bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-rose-500"
                        >
                          <option value="Dalam Penanganan (On-Site)">Dalam Penanganan</option>
                          <option value="Menunggu Sparepart">Menunggu Sparepart</option>
                          <option value="Selesai / Normal">Selesai / Normal</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Siren className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-white">Lapor Pekerjaan {workType} Baru</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">No. Tiket {workType}</label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={ticketNumber}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tingkat Risiko Gangguan *</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as EmergencyWork['severity'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-rose-500"
                  >
                    <option value="Kritis / Blackout">Kritis / Blackout</option>
                    <option value="Tinggi / Trip Breaker">Tinggi / Trip Breaker</option>
                    <option value="Sedang">Sedang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Lokasi Gangguan & Substation *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gardu Hub 20kV Tamangil Desa Hoko"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Detail Masalah / Kronologi Gangguan *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Kabel JTM 20kV putus tertimpa pohon, fuse arrester meledak..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-rose-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Mandor Penanggung Jawab *</label>
                  <select
                    value={mandorName}
                    onChange={(e) => setMandorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-rose-500"
                  >
                    {mandors.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.subcontractorTeam})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Jumlah Teknisi On-Site</label>
                  <input
                    type="number"
                    min={1}
                    value={teamCount}
                    onChange={(e) => setTeamCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Terhubung Kontrak SPBJ</label>
                  <select
                    value={spbjId}
                    onChange={(e) => setSpbjId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-rose-500"
                  >
                    <option value="">-- Tanpa SPBJ Specific --</option>
                    {spbjList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} · {s.spbjNumber} ({s.up3Name} - {s.projectName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Target SLA Response</label>
                  <input
                    type="text"
                    value={targetResponseTime}
                    onChange={(e) => setTargetResponseTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tindakan Penanganan Lapangan</label>
                <textarea
                  rows={2}
                  placeholder="Langkah perbaikan K3, material skun/heatshrink yang diganti..."
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-rose-600/20"
                >
                  Simpan & Dispatch {workType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

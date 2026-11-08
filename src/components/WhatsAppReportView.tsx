import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  Copy, 
  Check, 
  Phone, 
  User, 
  FileText, 
  HardHat, 
  Package, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { SpbjContract, TaskAssignment, Mandor, Worker, BoqItem, MaterialSummaryItem } from '../types';

interface WhatsAppReportViewProps {
  spbjList: SpbjContract[];
  tasks: TaskAssignment[];
  mandors: Mandor[];
  workers: Worker[];
  boqItems: BoqItem[];
  mduMaterials: MaterialSummaryItem[];
}

export const WhatsAppReportView: React.FC<WhatsAppReportViewProps> = ({
  spbjList,
  tasks,
  mandors,
  workers,
  boqItems,
  mduMaterials,
}) => {
  const [reportType, setReportType] = useState<'progres' | 'presensi' | 'mandor' | 'boq' | 'custom'>('progres');
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>(spbjList[0]?.id || '');
  const [targetPhone, setTargetPhone] = useState<string>('+62 812-3456-7890');
  const [targetRecipientName, setTargetRecipientName] = useState<string>('Bapak Project Manager / Supervisi PLN');
  
  // Custom message body state
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const selectedSpbj = spbjList.find((s) => s.id === selectedSpbjId) || spbjList[0];

  // Preset Contact Numbers for Quick Selection
  const presetContacts = [
    { name: 'Ir. Hendra Wijaya (PM Utama PLN/Client)', phone: '6281299887766', role: 'Project Manager' },
    { name: 'Bapak Budi Santoso (Pengawas Site ME)', phone: '6281388776655', role: 'Site Manager' },
    { name: 'Bapak Karmin Suhartono (Mandor Utama 20kV)', phone: '6281299001122', role: 'Mandor' },
    { name: 'Gudang Pusat & Logistik SMK', phone: '6285711223344', role: 'Gudang' },
  ];

  // Generator Logic for WhatsApp Text
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (reportType === 'progres') {
      const spbjTasks = tasks.filter(t => selectedSpbjId === 'all' || t.projectName === selectedSpbj?.projectName);
      const completed = spbjTasks.filter(t => t.status === 'Selesai').length;
      const inProgress = spbjTasks.filter(t => t.status === 'Dalam Proses').length;

      let msg = `*LAPORAN PROGRES HARIAN PEKERJAAN ME*\n`;
      msg += `*PT SAPTA MANUNGGAL KARYA*\n`;
      msg += `--------------------------------------------------\n`;
      msg += `📅 *Tanggal:* ${todayStr}\n`;
      msg += `📋 *Kontrak SPBJ:* ${selectedSpbj?.spbjNumber || 'Seluruh SPBJ'}\n`;
      msg += `📍 *Lokasi/UP3:* ${selectedSpbj?.up3Name || 'UP3 Tual'}\n`;
      msg += `🏗️ *Pekerjaan:* ${selectedSpbj?.projectName || 'Lisdes & ME'}\n\n`;
      msg += `📊 *RINGKASAN STATUS TUGAS LAPANGAN:*\n`;
      msg += `• Total Penugasan: *${spbjTasks.length} Tugas*\n`;
      msg += `• ✅ Selesai: *${completed} Uraian*\n`;
      msg += `• 🔄 Dalam Proses: *${inProgress} Uraian*\n`;
      msg += `• ⚠️ Antrean Inspeksi K3: *${spbjTasks.filter(t => t.status === 'Menunggu Inspeksi K3').length} Uraian*\n\n`;
      msg += `🛠️ *RINCIAN URAIAN PEKERJAAN:* \n`;

      spbjTasks.slice(0, 5).forEach((t, i) => {
        const icon = t.status === 'Selesai' ? '✅' : t.status === 'Dalam Proses' ? '🚧' : '⏳';
        msg += `${i + 1}. ${icon} *${t.taskTitle}*\n`;
        msg += `   └ Status: ${t.status} | Tenggat: ${t.dueDate}\n`;
        msg += `   └ Teknisi: ${t.assignedWorkerNames ? t.assignedWorkerNames.join(', ') : '-'}\n`;
      });

      msg += `\n--------------------------------------------------\n`;
      msg += `*Disampaikan oleh:* Sistem Informasi Monitoring ME SMK\n`;
      msg += `cc: ${targetRecipientName}`;

      setGeneratedMessage(msg);
    } else if (reportType === 'presensi') {
      const activeWorkers = workers.filter(w => w.status !== 'Belum Presensi');
      let msg = `*LAPORAN PRESENSI & APD K3 TEKNISI*\n`;
      msg += `*PT SAPTA MANUNGGAL KARYA*\n`;
      msg += `--------------------------------------------------\n`;
      msg += `📅 *Tanggal:* ${todayStr}\n`;
      msg += `👷 *Jumlah Teknisi On-Site:* ${activeWorkers.length} Personel\n`;
      msg += `🛡️ *Status K3:* 100% APD Terverifikasi Lengkap\n\n`;
      msg += `📋 *DAFTAR TEKNISI HADIR DI SITE:*\n`;

      activeWorkers.forEach((w, i) => {
        msg += `${i + 1}. *${w.name}* (${w.role})\n`;
        msg += `   └ Jam Masuk: ${w.checkInTime || '08:00 WIB'} | Status: ${w.status}\n`;
        msg += `   └ Lokasi: ${w.projectName}\n`;
      });

      msg += `\n--------------------------------------------------\n`;
      msg += `*Laporan Otomatis Lapangan PT SMK ME*`;
      setGeneratedMessage(msg);
    } else if (reportType === 'mandor') {
      let msg = `*LAPORAN ALOKASI MANDOR & TIM SUBKON*\n`;
      msg += `*PT SAPTA MANUNGGAL KARYA*\n`;
      msg += `--------------------------------------------------\n`;
      msg += `📅 *Tanggal:* ${todayStr}\n\n`;

      mandors.forEach((m, i) => {
        msg += `👷 *${i + 1}. ${m.name}*\n`;
        msg += `• Vendor/Tim: ${m.subcontractorTeam}\n`;
        msg += `• Lokasi Kerja: *${m.workLocation}*\n`;
        msg += `• Anggota Tim: *${m.workerCount} Teknisi*\n`;
        msg += `• No. HP: ${m.phone}\n`;
        if (m.locations && m.locations.length > 1) {
          msg += `• 📍 *Multi-Site (${m.locations.length} Lokasi):* ${m.locations.map(l => l.locationName).join(' | ')}\n`;
        }
        msg += `\n`;
      });

      msg += `--------------------------------------------------\n`;
      msg += `*PT Sapta Manunggal Karya ME*`;
      setGeneratedMessage(msg);
    } else if (reportType === 'boq') {
      const filteredBoq = boqItems.filter(b => selectedSpbjId === 'all' || b.spbjId === selectedSpbjId);
      const totalContract = filteredBoq.reduce((a, b) => a + b.totalPrice, 0);
      const totalRealized = filteredBoq.reduce((a, b) => a + b.realizedPrice, 0);

      let msg = `*LAPORAN RINCIAN ANGGARAN & VOLUME BOQ*\n`;
      msg += `*PT SAPTA MANUNGGAL KARYA*\n`;
      msg += `--------------------------------------------------\n`;
      msg += `📋 *Kontrak:* ${selectedSpbj?.spbjNumber || 'Seluruh SPBJ'}\n`;
      msg += `💵 *Total Nilai Kontrak:* ${formatRupiah(totalContract)}\n`;
      msg += `💰 *Total Realisasi Biaya:* ${formatRupiah(totalRealized)}\n`;
      msg += `📈 *Progres Biaya Fisik:* ${totalContract > 0 ? ((totalRealized / totalContract) * 100).toFixed(1) : 0}%\n\n`;
      msg += `📦 *ITEM PEKERJAAN UTAMA:*\n`;

      filteredBoq.slice(0, 5).forEach((b, i) => {
        msg += `${i + 1}. *${b.materialOrWork}*\n`;
        msg += `   └ Vol Kontrak: ${b.contractVolume} ${b.unit} | Realisasi: *${b.realizedVolume} ${b.unit}*\n`;
      });

      msg += `\n--------------------------------------------------\n`;
      msg += `*PT Sapta Manunggal Karya ME*`;
      setGeneratedMessage(msg);
    }
  }, [reportType, selectedSpbjId, selectedSpbj, tasks, workers, mandors, boqItems, targetRecipientName]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    let cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const encodedMsg = encodeURIComponent(generatedMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
            <span>Pelaporan Pekerjaan via WhatsApp</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Buat laporan format otomatis dan kirimkan langsung ke Project Manager, Mandor, atau Client via WhatsApp Web / Mobile.
          </p>
        </div>

        <button
          onClick={handleSendWhatsApp}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Send className="w-4 h-4" />
          <span>Kirim Sekarang via WhatsApp</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Select Template & Recipient */}
        <div className="lg:col-span-5 space-y-5">
          {/* Template Selector Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>1. Pilih Template Jenis Laporan</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setReportType('progres')}
                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  reportType === 'progres'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold">Laporan Progres Harian Proyek</span>
                  <span className="text-[10px] text-slate-500 font-normal">Ringkasan status tugas, uraian pekerjaan & SPBJ</span>
                </div>
                {reportType === 'progres' && <Check className="w-4 h-4 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setReportType('presensi')}
                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  reportType === 'presensi'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold">Laporan Presensi & APD K3 Teknisi</span>
                  <span className="text-[10px] text-slate-500 font-normal">Status kehadiran teknisi di site & verifikasi APD</span>
                </div>
                {reportType === 'presensi' && <Check className="w-4 h-4 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setReportType('mandor')}
                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  reportType === 'mandor'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold">Laporan Alokasi Mandor & Multi-Site</span>
                  <span className="text-[10px] text-slate-500 font-normal">Lokasi pengawasan mandor & tim subkontraktor</span>
                </div>
                {reportType === 'mandor' && <Check className="w-4 h-4 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setReportType('boq')}
                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  reportType === 'boq'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold">Laporan Volume & Anggaran BOQ</span>
                  <span className="text-[10px] text-slate-500 font-normal">Capaian realisasi biaya & volume kontrak pekerjaan</span>
                </div>
                {reportType === 'boq' && <Check className="w-4 h-4 shrink-0" />}
              </button>
            </div>
          </div>

          {/* SPBJ Filter Selection */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>2. Pilih Kontrak SPBJ PLN Target</span>
            </h3>
            <select
              value={selectedSpbjId}
              onChange={(e) => setSelectedSpbjId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Kontrak SPBJ</option>
              {spbjList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.spbjNumber} ({s.up3Name})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Contact Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>3. Penerima Laporan WhatsApp</span>
            </h3>

            {/* Quick Contact Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-semibold block">Kontak Cepat Terdaftar:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {presetContacts.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setTargetPhone(c.phone);
                      setTargetRecipientName(c.name);
                    }}
                    className={`p-2 rounded-lg text-[11px] text-left border flex justify-between items-center transition-colors ${
                      targetPhone === c.phone
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-[10px]">{c.phone}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Nomor WhatsApp Penerima (dengan kode negara)
                </label>
                <input
                  type="text"
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                  placeholder="misal: 6281234567890"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview & Send Actions */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pratinjau Pesan WhatsApp Format Otomatis</h3>
                  <span className="text-[10px] text-slate-400">Pesan dapat diedit secara manual sebelum dikirim</span>
                </div>
              </div>

              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                title="Salin Teks Pesan"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>

            {/* Editable Text Area simulating WhatsApp */}
            <div className="flex-1 space-y-2">
              <textarea
                rows={16}
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="w-full p-4 bg-emerald-950/20 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            {/* WhatsApp Send Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Penerima: <strong className="text-slate-700 dark:text-slate-200 font-mono">{targetPhone}</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyText}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Salin Teks</span>
                </button>

                <button
                  onClick={handleSendWhatsApp}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

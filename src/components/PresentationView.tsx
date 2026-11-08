import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  FileText, 
  TrendingUp, 
  Building2, 
  HardHat, 
  Package, 
  DollarSign, 
  ShieldCheck, 
  Award, 
  PieChart, 
  Download,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { SpbjContract, TaskAssignment, BoqItem, Mandor, MaterialSummaryItem, MaterialBongkarItem } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PresentationViewProps {
  spbjList: SpbjContract[];
  tasks: TaskAssignment[];
  boqItems: BoqItem[];
  mandors: Mandor[];
  mduMaterials: MaterialSummaryItem[];
  nonMduMaterials: MaterialSummaryItem[];
  bongkarMaterials: MaterialBongkarItem[];
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  spbjList,
  tasks,
  boqItems,
  mandors,
  mduMaterials,
  nonMduMaterials,
  bongkarMaterials,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

  // Summary Computations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Selesai').length;
  const taskProgressPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalContractVal = boqItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalRealizedVal = boqItems.reduce((acc, i) => acc + i.realizedPrice, 0);
  const boqProgressPct = totalContractVal > 0 ? (totalRealizedVal / totalContractVal) * 100 : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const slides = [
    {
      id: 1,
      title: 'Laporan Eksekutif Monitoring Proyek ME',
      category: 'Ringkasan Utama & Key Performance Indicator',
      icon: Award,
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-2 py-4">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-500 font-mono text-xs font-bold rounded-full border border-amber-400/30 inline-block uppercase">
              DIVISI ME · PT SAPTA MANUNGGAL KARYA
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              PRESENTASI PROGRES PEKERJAAN KELISTRIKAN Lapangan
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Laporan status pelaksanaan pembangunan dan pemasangan jaringan distribusi Lisdes UP3 PLN & infrastruktur ME.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg space-y-2">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">KONTRAK SPBJ</span>
              <p className="text-3xl font-extrabold text-white font-mono">{spbjList.length} SPBJ</p>
              <p className="text-xs text-slate-400">UP3 Tual & Maluku Utara</p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg space-y-2">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">PROGRES PEKERJAAN</span>
              <p className="text-3xl font-extrabold text-emerald-400 font-mono">{taskProgressPct.toFixed(1)}%</p>
              <p className="text-xs text-slate-400">{completedTasks} dari {totalTasks} Uraian Tugas Selesai</p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg space-y-2">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block">TOTAL NILAI BOQ</span>
              <p className="text-xl font-extrabold text-white font-mono truncate">{formatRupiah(totalContractVal)}</p>
              <p className="text-xs text-slate-400">Realisasi: {formatRupiah(totalRealizedVal)}</p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg space-y-2">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block">MANDOR & TEKNISI</span>
              <p className="text-3xl font-extrabold text-white font-mono">{mandors.length} Mandor</p>
              <p className="text-xs text-slate-400">Termasuk pengawasan multi-site</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Status Kontrak SPBJ & UP3 PLN',
      category: 'Perjanjian Kerja Pembangunan Jaringan Lisdes',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spbjList.map((spbj, idx) => (
              <div key={spbj.id} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 bg-amber-400/10 rounded-lg border border-amber-400/20">
                    {spbj.spbjNumber}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {spbj.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {spbj.projectName}
                </h4>
                <div className="flex justify-between items-center text-xs text-slate-300 pt-2 border-t border-slate-800 font-mono">
                  <span>Nilai Kontrak: <strong className="text-white">{spbj.contractValue}</strong></span>
                  <span className="text-amber-300">{spbj.up3Name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Realisasi Pekerjaan & Progres Fisik',
      category: 'Monitoring Status Penugasan Tim Lapangan',
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-700/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Capaian Progres Fisik Lapangan</span>
              </h3>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">{taskProgressPct.toFixed(1)}%</span>
            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPct}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Selesai 100%</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{completedTasks} Tugas</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Dalam Proses</span>
                <span className="text-lg font-bold text-blue-400 font-mono">
                  {tasks.filter(t => t.status === 'Dalam Proses').length} Tugas
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Inspeksi K3 / Menunggu</span>
                <span className="text-lg font-bold text-amber-400 font-mono">
                  {tasks.filter(t => t.status === 'Menunggu Inspeksi K3').length} Tugas
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Bill of Quantities (BOQ) & Anggaran',
      category: 'Evaluasi Biaya Kontrak & Realisasi Anggaran',
      icon: DollarSign,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Total Anggaran Kontrak BOQ</span>
              <p className="text-2xl font-extrabold text-white font-mono">{formatRupiah(totalContractVal)}</p>
              <span className="text-[11px] text-amber-400 font-mono">{boqItems.length} Uraian Pekerjaan</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Realisasi Biaya Lapangan</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">{formatRupiah(totalRealizedVal)}</p>
              <span className="text-[11px] text-slate-400">{boqProgressPct.toFixed(1)}% Terpakai</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Sisa Anggaran Kontrak</span>
              <p className="text-2xl font-extrabold text-amber-400 font-mono">{formatRupiah(totalContractVal - totalRealizedVal)}</p>
              <span className="text-[11px] text-slate-400">{(100 - boqProgressPct).toFixed(1)}% Alokasi Sisa</span>
            </div>
          </div>

          {/* Sample Table */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-700/70 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002060] text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Uraian Pekerjaan</th>
                  <th className="p-3 text-right">Vol Kontrak</th>
                  <th className="p-3 text-right">Vol Realisasi</th>
                  <th className="p-3 text-right">Total Kontrak (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {boqItems.slice(0, 4).map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 font-mono text-amber-400 font-bold">{item.itemCode}</td>
                    <td className="p-3 font-bold text-white">{item.materialOrWork}</td>
                    <td className="p-3 text-right font-mono">{item.contractVolume} {item.unit}</td>
                    <td className="p-3 text-right font-mono text-emerald-400">{item.realizedVolume} {item.unit}</td>
                    <td className="p-3 text-right font-mono font-bold">{formatRupiah(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Distribusi Material & Material Bongkaran',
      category: 'Inventaris Material MDU, NON-MDU & Material Bekas',
      icon: Package,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-xs text-slate-400 font-bold block">MATERIAL MDU</span>
              <p className="text-3xl font-extrabold text-amber-400 font-mono">{mduMaterials.length} Jenis</p>
              <span className="text-[11px] text-slate-400">Tiang Besi 12M, Konduktor A3C-S, Trafo 50kVA</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-xs text-slate-400 font-bold block">MATERIAL NON-MDU</span>
              <p className="text-3xl font-extrabold text-blue-400 font-mono">{nonMduMaterials.length} Jenis</p>
              <span className="text-[11px] text-slate-400">Konstruksi TM-1, TM-2, TR-1 S/B</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-xs text-slate-400 font-bold block">MATERIAL BONGKARAN</span>
              <p className="text-3xl font-extrabold text-rose-400 font-mono">{bongkarMaterials.length} Jenis</p>
              <span className="text-[11px] text-slate-400">Gudang Ambon & Gudang Tual</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Pengawasan Mandor & Tenaga Kerja',
      category: 'Alokasi Subkontraktor & Pengawasan Multi-Site',
      icon: HardHat,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mandors.map((m) => (
              <div key={m.id} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{m.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                    {m.status}
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-mono">{m.subcontractorTeam}</p>
                <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 space-y-1">
                  <p>Lokasi Kerja: <strong className="text-white">{m.workLocation}</strong></p>
                  <p>Jumlah Anggota: <strong className="text-amber-400">{m.workerCount} Teknisi ME</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentSlideObj = slides[currentSlide];

  // AutoPlay Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const exportPresentationPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    slides.forEach((slide, idx) => {
      if (idx > 0) doc.addPage();

      // Slide Header
      doc.setFillColor(0, 32, 96);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 14, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`PT SAPTA MANUNGGAL KARYA — PRESENTASI (SLIDE ${idx + 1}/${slides.length})`, 14, 9.5);

      doc.setTextColor(0, 32, 96);
      doc.setFontSize(16);
      doc.text(slide.title.toUpperCase(), 14, 25);

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(slide.category, 14, 31);
    });

    doc.save(`Presentasi_Eksekutif_SMK_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className={`space-y-6 pb-12 transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Presentation className="w-6 h-6 text-amber-500" />
            <span>Mode Presentasi Deck Eksekutif</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tampilan slide presentasi interaktif laporan proyek kelistrikan untuk jajaran manajemen & client PLN.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${isAutoPlay ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoPlay ? 'Jeda Slide' : 'Auto Play'}</span>
          </button>

          <button
            onClick={exportPresentationPdf}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Slide</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MAIN SLIDE STAGE */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
        {/* Subtle Background Blueprint Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" width="100%" height="100%">
            <defs>
              <pattern id="slideGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#slideGrid)" />
          </svg>
        </div>

        {/* Slide Header Info */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              {React.createElement(currentSlideObj.icon, { className: 'w-5 h-5' })}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                SLIDE {currentSlide + 1} DARI {slides.length} · {currentSlideObj.category}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {currentSlideObj.title}
              </h3>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Presentasi Laporan Real-Time</span>
          </div>
        </div>

        {/* Slide Body Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          {currentSlideObj.content}
        </div>

        {/* Slide Navigation Controls Bar */}
        <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-amber-400 w-8' : 'bg-slate-700 hover:bg-slate-600'}`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-md shadow-amber-400/10"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            className={`p-3 rounded-2xl border text-left transition-all ${idx === currentSlide ? 'bg-amber-400/10 border-amber-400 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'}`}
          >
            <span className="text-[10px] font-mono font-bold text-amber-500 block">SLIDE {idx + 1}</span>
            <span className="text-xs font-bold truncate block mt-0.5">{s.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

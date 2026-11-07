import React, { useState } from 'react';
import { Project, Worker } from '../types';
import { generateSiteReportApi, askAiAssistantApi } from '../services/api';
import { 
  Sparkles, 
  FileText, 
  Send, 
  Printer, 
  Copy, 
  Check, 
  Loader2, 
  Bot, 
  User, 
  Zap, 
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface AiAssistantViewProps {
  projects: Project[];
  workers: Worker[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ projects, workers }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'chat'>('report');

  // Report Form State
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskSummaryInput, setTaskSummaryInput] = useState(
    'Pengujian Tahanan Isolasi Megger Trafo 2500kVA 20kV selesai 100%. Pemasangan cable ladder 600mm di Line 3 progres 80%. Terminasi busduct 4000A genset unit 1 terlaksana.'
  );
  const [safetyIncidentsInput, setSafetyIncidentsInput] = useState('Nihil (0 Insiden / Incident Free 100%)');
  const [equipmentNotesInput, setEquipmentNotesInput] = useState('Fluke 1587 & FLIR E8-XT terkalibrasi dan siap operasi.');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Halo! Saya Asisten AI Teknik ME PT Sapta Manunggal Karya. Saya siap membantu Anda mengenai K3 Kelistrikan PUIL 2020, Prosedur LOTO, Pengujian Megger, Pemasangan Busduct & Trafo 20kV, serta troubleshooting lapangan.',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectWorkers = workers.filter((w) => w.projectId === selectedProjectId);
  const activeCount = projectWorkers.filter((w) => w.status !== 'Belum Presensi').length;

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setReportLoading(true);
    setReportError(null);

    try {
      const reportText = await generateSiteReportApi({
        projectName: selectedProject.name,
        projectLocation: selectedProject.location,
        date: reportDate,
        workersCount: activeCount || 10,
        tasksSummary: taskSummaryInput,
        safetyIncidents: safetyIncidentsInput,
        equipmentNotes: equipmentNotesInput,
      });

      setGeneratedReport(reportText);
    } catch (err: any) {
      setReportError(err.message || 'Gagal menghasilkan laporan AI');
    } finally {
      setReportLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    const newHistory: Message[] = [...chatMessages, { role: 'user', text: userMsg }];
    setChatMessages(newHistory);
    setChatLoading(true);

    try {
      const reply = await askAiAssistantApi(userMsg, newHistory);
      setChatMessages([...newHistory, { role: 'model', text: reply }]);
    } catch (err: any) {
      setChatMessages([
        ...newHistory,
        { role: 'model', text: 'Maaf, terjadi masalah koneksi ke server asisten AI.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const quickQuestions = [
    'Berapa batas minimum tahanan isolasi trafo 20kV menurut PUIL 2020?',
    'Bagaimana urutan prosedur LOTO (Lockout Tagout) pada Panel MDP 4000A?',
    'Berapa standar nilai tahanan pembumian (grounding) untuk substation?',
    'Langkah trouble-shooting jika breaker ACB tripped pada beban puncak?',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>Asisten AI & Generator Laporan Proyek</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Integrasi kecerdasan buatan Gemini 3.8 Flash untuk penyusunan laporan harian dan bantuan teknis PUIL 2020.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'report'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Laporan Harian AI
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Tanya AI Teknik & K3
          </button>
        </div>
      </div>

      {activeTab === 'report' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Input Data Laporan Harian</span>
            </h3>

            <form onSubmit={handleGenerateReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Proyek
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Laporan
                  </label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah SDM Hadir
                  </label>
                  <input
                    type="number"
                    value={activeCount || 10}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ringkasan Pekerjaan Selesai Hari Ini
                </label>
                <textarea
                  rows={4}
                  value={taskSummaryInput}
                  onChange={(e) => setTaskSummaryInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan K3 & Insiden
                </label>
                <input
                  type="text"
                  value={safetyIncidentsInput}
                  onChange={(e) => setSafetyIncidentsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status Peralatan & Testing Tools
                </label>
                <input
                  type="text"
                  value={equipmentNotesInput}
                  onChange={(e) => setEquipmentNotesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={reportLoading}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {reportLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Menyusun Laporan Resmi (Gemini AI)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Buat Laporan Eksekutif AI</span>
                  </>
                )}
              </button>
            </form>

            {reportError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-lg">
                {reportError}
              </div>
            )}
          </div>

          {/* Right Preview Output (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pratinjau Laporan Resmi Proyek
              </h3>
              {generatedReport && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tercopy' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak PDF</span>
                  </button>
                </div>
              )}
            </div>

            {generatedReport ? (
              <div className="prose dark:prose-invert prose-slate max-w-none text-xs leading-relaxed p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono whitespace-pre-wrap overflow-x-auto">
                {generatedReport}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Isi formulir di sebelah kiri dan klik <strong>Buat Laporan Eksekutif AI</strong> untuk menghasilkan dokumen resmi proyek PT Sapta Manunggal Karya.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Chat View */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Asisten Konsultasi Teknik ME & PUIL 2020
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Online · Menguasai SNI Kelistrikan, LOTO, Megger Test, & Transformer 20kV
                </span>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    AI
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-xl max-w-[80%] text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 rounded-br-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-500 p-2 font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Asisten AI sedang mengetik jawaban teknis...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              Pertanyaan Populer Lapangan:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setChatInput(q)}
                  className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-left transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Tanyakan masalah teknis kelistrikan, standar PUIL, atau K3..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Kirim</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

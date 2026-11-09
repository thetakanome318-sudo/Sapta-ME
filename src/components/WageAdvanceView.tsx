import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Download,
  Calendar,
  User,
  ArrowUpRight,
  Trash2
} from 'lucide-react';
import { WageAdvance, SpbjContract } from '../types';
import { subscribeWageAdvances, upsertWageAdvance, deleteWageAdvance } from '../services/firestoreSync';

interface WageAdvanceViewProps {
  spbjList: SpbjContract[];
}

export const WageAdvanceView: React.FC<WageAdvanceViewProps> = ({ spbjList }) => {
  const [advances, setWageAdvances] = useState<WageAdvance[]>([]);
  const [selectedSpbj, setSelectedSpbj] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const unsub = subscribeWageAdvances((data) => setWageAdvances(data));
    return () => unsub();
  }, []);

  const filteredAdvances = advances.filter(a => 
    (selectedSpbj === 'all' || a.spbjId === selectedSpbj) &&
    (a.mandorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     a.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalAmount = filteredAdvances.reduce((sum, a) => sum + a.amount, 0);
  const pendingAmount = filteredAdvances.filter(a => a.status === 'Pending').reduce((sum, a) => sum + a.amount, 0);
  const paidAmount = filteredAdvances.filter(a => a.status === 'Paid').reduce((sum, a) => sum + a.amount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleDownloadNota = (adv: WageAdvance) => {
    const content = `
NOTA PANJAR UPAH MANDOR
------------------------
ID Panjar   : ${adv.id}
Tanggal     : ${adv.date}
Mandor      : ${adv.mandorName}
Proyek      : ${adv.projectName}
Jumlah      : ${formatCurrency(adv.amount)}
Keterangan  : ${adv.description}
Status      : ${adv.status}

Dicetak pada: ${new Date().toLocaleString()}
PT SAPTA MANUNGGAL KARYA
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nota_Panjar_${adv.mandorName}_${adv.date}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-500" />
            <span>Panjar Upah (Wage Advance)</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 text-[11px]">
            Manajemen panjar upah untuk mandor dan tim lapangan per SPBJ.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Input Panjar Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Panjar</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{formatCurrency(totalAmount)}</h3>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                <span>Dari {filteredAdvances.length} Transaksi</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Wallet className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.05]">
             <Wallet className="w-24 h-24" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paid (Sudah Bayar)</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{formatCurrency(paidAmount)}</h3>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Telah Diselesaikan</span>
              </div>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Approval</p>
              <h3 className="text-lg font-black text-orange-500 mt-1">{formatCurrency(pendingAmount)}</h3>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-500 font-bold">
                <Clock className="w-3 h-3" />
                <span>Menunggu Konfirmasi</span>
              </div>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari mandor atau proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={selectedSpbj}
            onChange={(e) => setSelectedSpbj(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs p-2 outline-none focus:ring-1 focus:ring-blue-500 min-w-[200px]"
          >
            <option value="all">Semua SPBJ</option>
            {spbjList.map(s => (
              <option key={s.id} value={s.id}>{s.spbjNumber} - {s.projectName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
              <tr>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Mandor</th>
                <th className="p-4">Deskripsi Panjar</th>
                <th className="p-4">Proyek / SPBJ</th>
                <th className="p-4">Jumlah (RP)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAdvances.map((adv) => (
                <tr key={adv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 whitespace-nowrap font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {adv.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase">
                       <User className="w-3 h-3 text-blue-500" />
                       {adv.mandorName}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={adv.description}>
                      {adv.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white uppercase">{adv.projectName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{adv.spbjId}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap font-black text-slate-900 dark:text-white">
                    {formatCurrency(adv.amount)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      adv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                      adv.status === 'Approved' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                      adv.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                    }`}>
                      {adv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleDownloadNota(adv)}
                        className="text-blue-500 font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Nota
                      </button>
                      <button 
                        onClick={() => { if(confirm('Hapus panjar ini?')) deleteWageAdvance(adv.id); }}
                        className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAdvances.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 italic">
                    <div className="flex flex-col items-center gap-2">
                       <Clock className="w-8 h-8 opacity-20" />
                       <span>Belum ada data panjar upah untuk kriteria ini.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Input Panjar Upah Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const spbjId = formData.get('spbjId') as string;
              const spbj = spbjList.find(s => s.id === spbjId);
              
              const newAdv: WageAdvance = {
                id: `ADV-${Date.now()}`,
                spbjId,
                projectName: spbj?.projectName || 'Unknown',
                mandorName: formData.get('mandorName') as string,
                description: formData.get('description') as string,
                amount: Number(formData.get('amount')),
                date: formData.get('date') as string,
                submittedBy: 'Admin Utama',
                status: 'Pending'
              };
              
              upsertWageAdvance(newAdv);
              setShowAddModal(false);
            }}>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pilih SPBJ</label>
                <select name="spbjId" required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500">
                  {spbjList.map(s => <option key={s.id} value={s.id}>{s.projectName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Mandor</label>
                <input name="mandorName" type="text" required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jumlah Panjar (Rp)</label>
                <input name="amount" type="number" required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tanggal</label>
                <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deskripsi / Peruntukan</label>
                <textarea name="description" required rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200">Batal</button>
                <button type="submit" className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Simpan Panjar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

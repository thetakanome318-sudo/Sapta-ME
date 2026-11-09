import React, { useState } from 'react';
import { Building2, Package, Search, Plus, History, MapPin, Box, CheckCircle2, AlertTriangle, ArrowDownRight, ArrowUpRight, Truck, FileText } from 'lucide-react';
import { SpbjContract } from '../types';

interface WarehouseStock {
  id: string;
  name: string;
  category: 'MDU' | 'NON MDU' | 'Equipment';
  quantity: number;
  unit: string;
  location: string;
  status: 'In Stock' | 'Low Stock';
  spbjId?: string;
}

interface MaterialTransaction {
  id: string;
  type: 'Masuk' | 'Keluar' | 'Transit';
  itemName: string;
  quantity: number;
  unit: string;
  spbjId: string;
  date: string;
  sourceOrDestination: string;
  status: 'Selesai' | 'Dalam Perjalanan' | 'Menunggu Verifikasi';
}

const INITIAL_STOCK: WarehouseStock[] = [
  { id: 'WH-TUAL-001', name: 'Tiang Besi 12m', category: 'MDU', quantity: 24, unit: 'Batang', location: 'Open Yard Tual', status: 'In Stock', spbjId: 'SPBJ-001' },
  { id: 'WH-TUAL-002', name: 'Trafo 50kVA', category: 'MDU', quantity: 2, unit: 'Unit', location: 'Section B-Tual', status: 'Low Stock', spbjId: 'SPBJ-002' },
  { id: 'WH-TUAL-003', name: 'Baut Galvanis M16', category: 'NON MDU', quantity: 500, unit: 'Pcs', location: 'Rack A1', status: 'In Stock', spbjId: 'SPBJ-001' },
  { id: 'WH-TUAL-004', name: 'Safety Harness Full Body', category: 'Equipment', quantity: 8, unit: 'Sets', location: 'Safety Rack', status: 'In Stock', spbjId: 'SPBJ-003' },
];

const INITIAL_TRANSACTIONS: MaterialTransaction[] = [
  { id: 'TRX-001', type: 'Masuk', itemName: 'Tiang Besi 12m', quantity: 15, unit: 'Batang', spbjId: 'SPBJ-001', date: '2026-11-05', sourceOrDestination: 'Vendor Utama PLN Surabaya', status: 'Selesai' },
  { id: 'TRX-002', type: 'Keluar', itemName: 'Trafo 50kVA', quantity: 1, unit: 'Unit', spbjId: 'SPBJ-002', date: '2026-11-06', sourceOrDestination: 'Site Proyek UP3 Tual (Mandor Karmin)', status: 'Selesai' },
  { id: 'TRX-003', type: 'Transit', itemName: 'Konduktor A3C-S 70mm²', quantity: 500, unit: 'Mtr', spbjId: 'SPBJ-001', date: '2026-11-07', sourceOrDestination: 'Pelabuhan Ambon -> Transit Tual', status: 'Dalam Perjalanan' },
];

interface WarehouseTualViewProps {
  spbjList?: SpbjContract[];
}

export const WarehouseTualView: React.FC<WarehouseTualViewProps> = ({ spbjList = [] }) => {
  const [activeTab, setActiveTab] = useState<'inventaris' | 'masuk' | 'keluar' | 'transit'>('inventaris');
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [stocks, setStocks] = useState<WarehouseStock[]>(INITIAL_STOCK);
  const [transactions, setTransactions] = useState<MaterialTransaction[]>(INITIAL_TRANSACTIONS);

  // Modal Input Transaction
  const [showModal, setShowModal] = useState(false);
  const [trxType, setTrxType] = useState<'Masuk' | 'Keluar' | 'Transit'>('Masuk');
  const [trxItemName, setTrxItemName] = useState('');
  const [trxQty, setTrxQty] = useState(1);
  const [trxUnit, setTrxUnit] = useState('Batang');
  const [trxSpbjId, setTrxSpbjId] = useState(spbjList[0]?.id || 'SPBJ-001');
  const [trxDest, setTrxDest] = useState('');

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxItemName.trim() || trxQty <= 0) return;

    const newTrx: MaterialTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      type: trxType,
      itemName: trxItemName.trim(),
      quantity: Number(trxQty),
      unit: trxUnit,
      spbjId: trxSpbjId,
      date: new Date().toISOString().slice(0, 10),
      sourceOrDestination: trxDest.trim() || 'Site / Vendor PLN',
      status: trxType === 'Transit' ? 'Dalam Perjalanan' : 'Selesai',
    };

    setTransactions([newTrx, ...transactions]);
    setShowModal(false);
    setTrxItemName('');
    setTrxQty(1);
    setTrxDest('');
  };

  const filteredStocks = stocks.filter(s => selectedSpbjId === 'all' || s.spbjId === selectedSpbjId);
  const filteredTrx = transactions.filter(t => {
    const matchesSpbj = selectedSpbjId === 'all' || t.spbjId === selectedSpbjId;
    const matchesType = 
      activeTab === 'inventaris' || 
      (activeTab === 'masuk' && t.type === 'Masuk') ||
      (activeTab === 'keluar' && t.type === 'Keluar') ||
      (activeTab === 'transit' && t.type === 'Transit');
    const matchesSearch = t.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || t.sourceOrDestination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpbj && matchesType && matchesSearch;
  });

  const incomingCount = transactions.filter(t => t.type === 'Masuk').length;
  const outgoingCount = transactions.filter(t => t.type === 'Keluar').length;
  const transitCount = transactions.filter(t => t.type === 'Transit' && t.status === 'Dalam Perjalanan').length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-500" />
            <span>Manajemen Gudang Tual & Monitoring SPBJ</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring material masuk, keluar, dan transit terintegrasi sesuai kontrak SPBJ PLN.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <FileText className="w-4 h-4 text-amber-500 ml-1" />
            <select
              value={selectedSpbjId}
              onChange={(e) => setSelectedSpbjId(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none pr-2"
            >
              <option value="all">Semua Kontrak SPBJ ({spbjList.length})</option>
              {spbjList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.spbjNumber} ({s.up3Name})
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Transaksi Material</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Material Masuk (Incoming)</span>
          <div className="text-2xl font-bold text-emerald-500 font-mono flex items-center gap-2">
            <span>{incomingCount} Item</span>
            <ArrowDownRight className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Terverifikasi Masuk Gudang</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Material Keluar (Outgoing)</span>
          <div className="text-2xl font-bold text-blue-500 font-mono flex items-center gap-2">
            <span>{outgoingCount} Item</span>
            <ArrowUpRight className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Alokasi ke Site / Proyek</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Material Transit (On-Route)</span>
          <div className="text-2xl font-bold text-amber-500 font-mono flex items-center gap-2">
            <span>{transitCount} Item</span>
            <Truck className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[10px] text-amber-500 font-bold">Dalam Perjalanan Expedisi</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Total SKU Gudang</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">62 SKU</div>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Stok Sinkron SPBJ
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('inventaris')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'inventaris' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Inventaris Stok Gudang
        </button>
        <button
          onClick={() => setActiveTab('masuk')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'masuk' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
        >
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Material Masuk ({transactions.filter(t => t.type === 'Masuk').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('keluar')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'keluar' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Material Keluar ({transactions.filter(t => t.type === 'Keluar').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('transit')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'transit' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Material Transit ({transactions.filter(t => t.type === 'Transit').length})</span>
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
            {activeTab === 'inventaris' ? 'Daftar Inventaris Stok Gudang Tual' : `Monitoring Material ${activeTab} Sesuai SPBJ`}
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Cari material atau asal/tujuan..." 
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'inventaris' ? (
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">ID SKU</th>
                  <th className="p-4">Nama Barang</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">SPBJ Alokasi</th>
                  <th className="p-4 text-center">Stok</th>
                  <th className="p-4">Satuan</th>
                  <th className="p-4">Lokasi Rak</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredStocks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-400">{item.id}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium">{item.category}</span></td>
                    <td className="p-4 font-mono font-bold text-amber-500">{item.spbjId || 'SPBJ-001'}</td>
                    <td className="p-4 text-center font-mono font-bold">{item.quantity}</td>
                    <td className="p-4">{item.unit}</td>
                    <td className="p-4"><MapPin className="w-3 h-3 text-amber-500 inline mr-1" />{item.location}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border ${
                        item.status === 'In Stock' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">ID Transaksi</th>
                  <th className="p-4">Tipe</th>
                  <th className="p-4">Nama Material</th>
                  <th className="p-4">Kontrak SPBJ</th>
                  <th className="p-4 text-center">Jumlah</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Asal / Tujuan</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredTrx.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-400">{t.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        t.type === 'Masuk' ? 'bg-emerald-500/10 text-emerald-500' : t.type === 'Keluar' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{t.itemName}</td>
                    <td className="p-4 font-mono font-bold text-amber-500">{t.spbjId}</td>
                    <td className="p-4 text-center font-mono font-bold">{t.quantity} {t.unit}</td>
                    <td className="p-4 font-mono text-slate-500">{t.date}</td>
                    <td className="p-4 font-medium">{t.sourceOrDestination}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Add Transaction */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Catat Transaksi Material Gudang Sesuai SPBJ
            </h3>

            <form onSubmit={handleAddTransaction} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipe Transaksi</label>
                <select
                  value={trxType}
                  onChange={(e) => setTrxType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                >
                  <option value="Masuk">Material Masuk (Incoming)</option>
                  <option value="Keluar">Material Keluar (Outgoing)</option>
                  <option value="Transit">Material Transit (On-Route)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih SPBJ Kontrak</label>
                <select
                  value={trxSpbjId}
                  onChange={(e) => setTrxSpbjId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                >
                  {spbjList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {s.spbjNumber} ({s.up3Name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Material</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Konduktor A3C 70mm² / Tiang Besi"
                  value={trxItemName}
                  onChange={(e) => setTrxItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Jumlah</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={trxQty}
                    onChange={(e) => setTrxQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    value={trxUnit}
                    onChange={(e) => setTrxUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Asal / Tujuan (Vendor / Site)</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Vendor PLN / Site Proyek UP3 Tual"
                  value={trxDest}
                  onChange={(e) => setTrxDest(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

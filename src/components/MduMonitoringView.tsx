import React, { useState } from 'react';
import { Package, Download, FileSpreadsheet, Plus, TrendingUp, Edit3, Trash2, Check, X, FileText } from 'lucide-react';
import { MaterialSummaryItem, SpbjContract } from '../types';
import { exportMaterialPDF } from '../utils/pdfExport';

interface MduMonitoringViewProps {
  materials: MaterialSummaryItem[];
  onUpdateMaterials: (materials: MaterialSummaryItem[]) => void;
  spbjList: SpbjContract[];
}

export const MduMonitoringView: React.FC<MduMonitoringViewProps> = ({
  materials,
  onUpdateMaterials,
  spbjList,
}) => {
  const [selectedSpbjId, setSelectedSpbjId] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formMaterial, setFormMaterial] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formCategory, setFormCategory] = useState('MDU JTM');
  const [formSpbjId, setFormSpbjId] = useState(spbjList[0]?.id || '');

  const categories = ['MDU JTM', 'MDU JTR', 'MDU GARDU'];

  const filteredMaterials = selectedSpbjId === 'all' 
    ? materials 
    : materials.filter(m => m.spbjId === selectedSpbjId);

  const handleAddItem = () => {
    if (!formMaterial || !formQuantity || !formUnit) return;
    
    const categoryItems = materials.filter(m => m.category === formCategory);
    const nextNo = categoryItems.length + 1;

    const newItem: MaterialSummaryItem = {
      id: `MDU-${Date.now()}`,
      no: nextNo,
      category: formCategory,
      material: formMaterial,
      unit: formUnit,
      quantity: formQuantity,
      spbjId: formSpbjId
    };

    onUpdateMaterials([...materials, newItem]);
    resetForm();
  };

  const handleUpdateItem = (id: string) => {
    onUpdateMaterials(materials.map(m => 
      m.id === id 
        ? { ...m, material: formMaterial, unit: formUnit, quantity: formQuantity, category: formCategory, spbjId: formSpbjId } 
        : m
    ));
    setEditingId(null);
    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Hapus item ini?')) {
      onUpdateMaterials(materials.filter(m => m.id !== id));
    }
  };

  const startEditing = (item: MaterialSummaryItem) => {
    setEditingId(item.id);
    setFormMaterial(item.material);
    setFormUnit(item.unit);
    setFormQuantity(item.quantity);
    setFormCategory(item.category);
    setFormSpbjId(item.spbjId);
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormMaterial('');
    setFormUnit('');
    setFormQuantity('');
    setIsAdding(false);
  };

  const downloadReport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      exportMaterialPDF('RINGKASAN MONITORING MATERIAL MDU', materials, spbjList, selectedSpbjId);
    } else {
      alert(`Downloading EXCEL Report for SPBJ: ${selectedSpbjId === 'all' ? 'Semua Proyek' : spbjList.find(s => s.id === selectedSpbjId)?.spbjNumber}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-500" />
            <span>Manajemen & Input Material MDU</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Input data material utama, edit nilai/jumlah, dan koneksikan dengan kontrak SPBJ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => downloadReport('pdf')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button 
            onClick={() => downloadReport('excel')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FileText className="w-4 h-4 text-slate-400" />
          <select 
            value={selectedSpbjId}
            onChange={(e) => setSelectedSpbjId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-64"
          >
            <option value="all">Semua Kontrak SPBJ</option>
            {spbjList.map(s => (
              <option key={s.id} value={s.id}>{s.spbjNumber} - {s.projectName.substring(0, 30)}...</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item MDU</span>
        </button>
      </div>

      {/* Add/Edit Form Overlay/Section */}
      {(isAdding || editingId) && (
        <div className="bg-amber-50 dark:bg-slate-800/50 p-6 rounded-xl border border-amber-200 dark:border-amber-900/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
            {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Edit Item MDU' : 'Tambah Item MDU Baru'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Material</label>
              <input 
                type="text" 
                value={formMaterial} 
                onChange={(e) => setFormMaterial(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                placeholder="Nama Barang..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Satuan</label>
              <input 
                type="text" 
                value={formUnit} 
                onChange={(e) => setFormUnit(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                placeholder="btg, mtr, bh..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jumlah</label>
              <input 
                type="text" 
                value={formQuantity} 
                onChange={(e) => setFormQuantity(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                placeholder="1.234"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
              <select 
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih SPBJ</label>
              <select 
                value={formSpbjId}
                onChange={(e) => setFormSpbjId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
              >
                {spbjList.map(s => <option key={s.id} value={s.id}>{s.spbjNumber}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Batal
            </button>
            <button 
              onClick={() => editingId ? handleUpdateItem(editingId) : handleAddItem()}
              className="px-6 py-2 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold rounded-lg flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan' : 'Simpan Item'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold uppercase tracking-wider text-[11px] border-b-2 border-slate-900 dark:border-slate-700">
                <th className="p-4 border-r border-slate-200 dark:border-slate-800 w-16 text-center">NO</th>
                <th className="p-4 border-r border-slate-200 dark:border-slate-800 text-center">MATERIAL</th>
                <th className="p-4 border-r border-slate-200 dark:border-slate-800 w-24 text-center">SAT</th>
                <th className="p-4 border-r border-slate-200 dark:border-slate-800 w-32 text-center">JUMLAH</th>
                <th className="p-4 w-28 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {categories.map((category, catIdx) => {
                const categoryItems = filteredMaterials.filter(m => m.category === category);
                if (categoryItems.length === 0 && selectedSpbjId !== 'all') return null;

                return (
                  <React.Fragment key={catIdx}>
                    <tr className="bg-[#D9D9D9] dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-y-2 border-slate-400 dark:border-slate-700">
                      <td colSpan={5} className="py-2.5 px-4 uppercase tracking-normal text-[12px]">
                        {category}
                      </td>
                    </tr>
                    
                    {categoryItems.map((item, idx) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                          idx % 2 === 1 ? 'bg-slate-50/30 dark:bg-slate-900/10' : 'bg-white dark:bg-slate-900'
                        }`}
                      >
                        <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold pl-4 text-sm">
                          {item.material}
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                            SPBJ: {spbjList.find(s => s.id === item.spbjId)?.spbjNumber || 'N/A'}
                          </div>
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-sm">
                          {item.unit}
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold text-center bg-white dark:bg-slate-900 relative text-sm">
                          <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 clip-path-triangle transform rotate-180 opacity-60"></div>
                          <span>{item.quantity}</span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => startEditing(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                              title="Edit Item"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded transition-colors"
                              title="Hapus Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS For triangle marker */}
      <style>{`
        .clip-path-triangle {
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }
      `}</style>
    </div>
  );
};

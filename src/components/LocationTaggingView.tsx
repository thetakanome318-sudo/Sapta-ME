import React, { useState } from 'react';
import { MapPin, Search, Filter, Layers, Navigation, Info, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';

interface TaggedLocation {
  id: string;
  name: string;
  type: 'Substation' | 'Pole' | 'Transformer' | 'Meter';
  coordinates: string;
  status: 'Verified' | 'Pending' | 'Needs Review';
  lastChecked: string;
  projectId: string;
}

const INITIAL_LOCATIONS: TaggedLocation[] = [
  { id: 'LOC-001', name: 'Substation T3 - Primary Feed', type: 'Substation', coordinates: '-5.6234, 132.7456', status: 'Verified', lastChecked: '2026-11-05', projectId: 'PRJ-001' },
  { id: 'LOC-002', name: 'Pole HV-12 - Desa Tamangil', type: 'Pole', coordinates: '-5.6288, 132.7499', status: 'Verified', lastChecked: '2026-11-04', projectId: 'PRJ-001' },
  { id: 'LOC-003', name: 'Transformer TR-04 - Area B', type: 'Transformer', coordinates: '-5.6312, 132.7512', status: 'Pending', lastChecked: '2026-11-06', projectId: 'PRJ-002' },
  { id: 'LOC-004', name: 'Meter Group - Housing Block C', type: 'Meter', coordinates: '-5.6355, 132.7588', status: 'Needs Review', lastChecked: '2026-10-30', projectId: 'PRJ-003' },
];

export const LocationTaggingView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations] = useState<TaggedLocation[]>(INITIAL_LOCATIONS);

  const getStatusColor = (status: TaggedLocation['status']) => {
    switch (status) {
      case 'Verified': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Needs Review': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-500" />
            <span>Tagging Lokasi Proyek & Aset</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen penandaan koordinat GPS untuk aset kelistrikan, tiang, trafo, dan titik substation di lapangan.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4" />
          <span>Tag Lokasi Baru</span>
        </button>
      </div>

      {/* Map View Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-[450px] relative">
        {/* Placeholder for Interactive Map */}
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center text-center p-8">
          <div className="w-full h-full relative">
            {/* Mock Map Background Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20" width="100%" height="100%">
              <defs>
                <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#map-grid)" />
            </svg>

            {/* Mock Map Shapes */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-slate-200 dark:bg-slate-800/50 rounded-lg transform -rotate-12 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Substation A</span>
            </div>
            <div className="absolute bottom-1/4 right-1/3 w-48 h-24 bg-slate-200 dark:bg-slate-800/50 rounded-full transform rotate-6 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Area Distribusi</span>
            </div>

            {/* Map Markers */}
            {locations.map((loc, i) => (
              <div 
                key={loc.id}
                className="absolute transition-transform hover:scale-110 cursor-pointer group"
                style={{ 
                  top: `${20 + (i * 20)}%`, 
                  left: `${30 + (i * 15)}%` 
                }}
              >
                <MapPin className={`w-6 h-6 ${
                  loc.status === 'Verified' ? 'text-emerald-500' : 
                  loc.status === 'Pending' ? 'text-amber-500' : 'text-rose-500'
                }`} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                  <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap border border-slate-700">
                    {loc.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
              <Navigation className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg max-w-xs text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Detail Koordinat Terpilih</span>
            </h4>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Lokasi:</span>
                <span className="font-mono font-bold">LOC-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lat/Long:</span>
                <span className="font-mono font-bold">-5.6234, 132.7456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Akurasi GPS:</span>
                <span className="text-emerald-500 font-bold">&lt; 3.0m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location List Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daftar Titik Penandaan (Tagging)</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Cari lokasi..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">ID / Nama Lokasi</th>
                <th className="p-4">Tipe Aset</th>
                <th className="p-4">Koordinat GPS</th>
                <th className="p-4">Terakhir Dicek</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{loc.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">{loc.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium">{loc.type}</span>
                  </td>
                  <td className="p-4 font-mono font-medium">{loc.coordinates}</td>
                  <td className="p-4">{loc.lastChecked}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${getStatusColor(loc.status)}`}>
                      {loc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-500 hover:underline font-bold">Lihat Peta</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

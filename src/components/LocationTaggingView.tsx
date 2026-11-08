import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Upload, 
  Download, 
  Layers, 
  Maximize, 
  ChevronDown, 
  Zap, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Crosshair,
  Filter,
  X,
  FileCode,
  FileArchive,
  Plus
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { DOMParser } from '@xmldom/xmldom';
import JSZip from 'jszip';
import { LocationTag, SpbjContract } from '../types';
import { subscribeLocationTags, subscribeSpbjContracts, upsertLocationTag } from '../services/firestoreSync';

const MAP_ID = 'DEMO_MAP_ID';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const LocationTaggingView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationTag[]>([]);
  const [spbjList, setSpbjList] = useState<SpbjContract[]>([]);
  const [selectedSpbj, setSelectedSpbj] = useState<string>('all');
  const [mapTypeId, setMapTypeId] = useState('satellite');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubTags = subscribeLocationTags((data) => setLocations(data));
    const unsubSpbj = subscribeSpbjContracts((data) => setSpbjList(data));
    return () => { unsubTags(); unsubSpbj(); };
  }, []);

  const filteredLocations = locations.filter(loc => 
    (selectedSpbj === 'all' || loc.spbjId === selectedSpbj) &&
    (loc.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!statusFilter || loc.status === statusFilter)
  );

  const categories = ['Semua', 'SUTM', 'Gardu', 'Percabangan', 'ROW', 'Inspeksi'];
  const mapFilters = [
    { label: 'Penyulang', color: 'bg-blue-500' },
    { label: 'Pohon', color: 'bg-green-500' },
    { label: 'Konstruksi', color: 'bg-purple-500' },
    { label: 'Gangguan', color: 'bg-red-500' },
    { label: 'Pemeliharaan', color: 'bg-orange-500' },
  ];

  const parseKML = (text: string, spbjId: string) => {
    const parser = new DOMParser();
    const kml = parser.parseFromString(text, 'text/xml');
    const placemarks = kml.getElementsByTagName('Placemark');
    
    for (let i = 0; i < placemarks.length; i++) {
      const p = placemarks[i];
      const name = p.getElementsByTagName('name')[0]?.textContent || `Point ${i+1}`;
      const coordsText = p.getElementsByTagName('coordinates')[0]?.textContent?.trim();
      
      if (coordsText) {
        const [lng, lat] = coordsText.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          const newTag: LocationTag = {
            id: `LOC-${Date.now()}-${i}`,
            spbjId: spbjId === 'all' ? (spbjList[0]?.id || 'unknown') : spbjId,
            name,
            type: 'Other',
            lat,
            lng,
            status: 'Pending',
            lastChecked: new Date().toISOString().split('T')[0]
          };
          upsertLocationTag(newTag);
        }
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      if (file.name.endsWith('.kml')) {
        const text = await file.text();
        parseKML(text, selectedSpbj);
      } else if (file.name.endsWith('.kmz')) {
        const zip = await JSZip.loadAsync(file);
        const kmlFile = Object.values(zip.files).find(f => f.name.endsWith('.kml'));
        if (kmlFile) {
          const text = await kmlFile.async('string');
          parseKML(text, selectedSpbj);
        }
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const exportToKML = () => {
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    ${filteredLocations.map(loc => `
    <Placemark>
      <name>${loc.name}</name>
      <Point><coordinates>${loc.lng},${loc.lat},0</coordinates></Point>
    </Placemark>`).join('')}
  </Document>
</kml>`;
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lokasi_aset_${selectedSpbj || 'semua'}.kml`;
    a.click();
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('map-container');
    if (elem?.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="flex h-[calc(100vh-120px)] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative" id="map-container">
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".kml,.kmz" 
          onChange={handleFileUpload} 
        />

        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                <MapPin className="w-4 h-4 text-blue-500" />
                Peta Sebaran Jaringan
              </h3>
              <span className="text-[10px] text-blue-500 font-bold">{spbjList.length} Feeder</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center justify-center gap-1 py-1.5 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-3 h-3" /> {isImporting ? '...' : 'Impor'}
              </button>
              <button onClick={exportToKML} className="flex items-center justify-center gap-1 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                <FileCode className="w-3 h-3 text-green-500" /> .KML
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-1 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                <FileArchive className="w-3 h-3 text-orange-500" /> .KMZ
              </button>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Filter className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <select 
                  value={selectedSpbj} 
                  onChange={e => setSelectedSpbj(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-medium appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">Filter ULP: Semua Unit</option>
                  {spbjList.map(s => <option key={s.id} value={s.id}>{s.spbjNumber} - {s.projectName}</option>)}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari file feeder import..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[9px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peta Feeder ({spbjList.length} File)</span>
                <button className="text-[9px] font-bold text-blue-500 hover:underline">Sembunyikan Semua</button>
              </div>

              <div className="space-y-2">
                {spbjList.map(s => (
                  <div key={s.id} className="p-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-7 h-4 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate uppercase">{s.projectName}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 font-medium">29.1 KMS</span>
                          <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">{s.up3Name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400" title="Edit"><Edit2 className="w-3 h-3" /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400" title="Focus"><Crosshair className="w-3 h-3" /></button>
                        <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500" title="Delete"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <Map 
            mapId={MAP_ID} 
            defaultCenter={{ lat: -5.6, lng: 132.7 }} 
            defaultZoom={12}
            mapTypeId={mapTypeId}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            disableDefaultUI
            gestureHandling={'greedy'}
          >
            {filteredLocations.map(loc => (
              <AdvancedMarker key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name}>
                <div className="relative group">
                  {/* Marker styling matching screenshot red/white style */}
                  <div className="w-4 h-4 bg-white rounded-full border-2 border-red-500 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </div>
                </div>
              </AdvancedMarker>
            ))}
            
            {/* Top Center Legend/Filters */}
            <MapControl position={ControlPosition.TOP_CENTER}>
              <div className="mt-4 flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/50 shadow-2xl">
                <div className="px-3 py-1 border-r border-slate-700/50 text-[10px] font-bold text-white flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-blue-500" /> Klik Tiang di Peta:
                </div>
                {mapFilters.map(filter => (
                  <button 
                    key={filter.label}
                    onClick={() => setStatusFilter(statusFilter === filter.label ? null : filter.label)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2 transition-all ${
                      statusFilter === filter.label 
                      ? `${filter.color} text-white` 
                      : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${filter.color}`} />
                    {filter.label}
                  </button>
                ))}
                <button 
                  onClick={() => setStatusFilter(null)}
                  className="px-3 py-1 text-slate-400 hover:text-white text-[10px] font-bold border-l border-slate-700/50"
                >
                  Reset
                </button>
              </div>
            </MapControl>

            {/* Top Right View Controls */}
            <MapControl position={ControlPosition.TOP_RIGHT}>
              <div className="m-4 flex items-center gap-1 p-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
                <button 
                  onClick={() => setMapTypeId('satellite')} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    mapTypeId === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" /> Satelit
                </button>
                <button 
                  onClick={() => setMapTypeId('roadmap')} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    mapTypeId === 'roadmap' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Search className="w-3 h-3" /> Street Map
                </button>
                <div className="w-px h-4 bg-slate-700/50 mx-1" />
                <button 
                  onClick={handleFullscreen}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  title="Fullscreen"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
            </MapControl>
          </Map>

          {/* Bottom Left Summary overlay */}
          <div className="absolute bottom-6 left-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl z-20 max-w-xs pointer-events-none border-l-4 border-l-blue-500">
            <h5 className="text-[11px] font-bold text-white mb-1 uppercase tracking-wider">Statistik Sebaran</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Total Aset</p>
                <p className="text-lg font-black text-white leading-tight">{locations.length}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Terverifikasi</p>
                <p className="text-lg font-black text-green-500 leading-tight">{locations.filter(l => l.status === 'Verified').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legacy Table View (Optional) */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            Daftar Titik Penandaan (Tagging)
          </h4>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari lokasi..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-[11px] focus:ring-1 focus:ring-blue-500 outline-none w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
              <tr>
                <th className="p-4">Nama Lokasi</th>
                <th className="p-4">Tipe Aset</th>
                <th className="p-4">Koordinat GPS</th>
                <th className="p-4">Terakhir Dicek</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLocations.map(loc => (
                <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{loc.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">{loc.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {loc.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-500 dark:text-slate-400">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{loc.lastChecked}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      loc.status === 'Verified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {loc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-500 font-bold hover:underline">Lihat Peta</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </APIProvider>
  );
};

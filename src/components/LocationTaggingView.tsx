import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Plus,
  CheckCircle2
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, MapControl, ControlPosition, useMap } from '@vis.gl/react-google-maps';
import { DOMParser } from '@xmldom/xmldom';
import JSZip from 'jszip';
import { LocationTag, SpbjContract } from '../types';
import { subscribeLocationTags, subscribeSpbjContracts, upsertLocationTag } from '../services/firestoreSync';

const MAP_ID = 'DEMO_MAP_ID';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Sub-component to handle map instance logic
const MapContent: React.FC<{ 
  locations: LocationTag[], 
  mapTypeId: string,
  visibleFeederIds: Set<string>,
  fitBoundsTrigger?: { id: string, bounds: any | null }
}> = ({ locations, mapTypeId, visibleFeederIds, fitBoundsTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (map && fitBoundsTrigger?.bounds) {
      map.fitBounds(fitBoundsTrigger.bounds);
    }
  }, [map, fitBoundsTrigger]);

  return (
    <Map 
      mapId={MAP_ID} 
      defaultCenter={{ lat: -5.6, lng: 132.7 }} 
      defaultZoom={12}
      mapTypeId={mapTypeId}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      disableDefaultUI
      gestureHandling={'greedy'}
    >
      {locations.filter(loc => visibleFeederIds.has(loc.spbjId)).map(loc => (
        <AdvancedMarker key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name}>
          <div className="relative group">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-red-500 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform cursor-pointer">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {loc.name}
            </div>
          </div>
        </AdvancedMarker>
      ))}
    </Map>
  );
};

const categories = ['Semua', 'SUTM', 'Gardu', 'Percabangan', 'ROW', 'Inspeksi'];

export const LocationTaggingView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationTag[]>([]);
  const [spbjList, setSpbjList] = useState<SpbjContract[]>([]);
  const [selectedSpbj, setSelectedSpbj] = useState<string>('all');
  const [mapTypeId, setMapTypeId] = useState('satellite');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isImporting, setIsImporting] = useState(false);
  const [visibleFeederIds, setVisibleFeederIds] = useState<Set<string>>(new Set());
  const [importStatus, setImportStatus] = useState<{ count: number, visible: boolean }>({ count: 0, visible: false });
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState<{ id: string, bounds: any | null } | undefined>();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<any | null>(null);

  useEffect(() => {
    const unsubTags = subscribeLocationTags((data) => setLocations(data));
    const unsubSpbj = subscribeSpbjContracts((data) => {
      setSpbjList(data);
      // Default all feeders to visible on first load
      setVisibleFeederIds(new Set(data.map(s => s.id)));
    });
    return () => { unsubTags(); unsubSpbj(); };
  }, []);

  const toggleFeederVisibility = (id: string) => {
    const newSet = new Set(visibleFeederIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setVisibleFeederIds(newSet);
  };

  const focusFeeder = (id: string) => {
    const feederLocations = locations.filter(l => l.spbjId === id);
    if (feederLocations.length === 0) return;

    const lats = feederLocations.map(l => l.lat);
    const lngs = feederLocations.map(l => l.lng);
    
    const bounds: any = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs)
    };

    setFitBoundsTrigger({ id, bounds });
    if (!visibleFeederIds.has(id)) {
      toggleFeederVisibility(id);
    }
  };

  const parseKML = (text: string, spbjId: string) => {
    const parser = new DOMParser();
    const kml = parser.parseFromString(text, 'text/xml');
    const placemarks = kml.getElementsByTagName('Placemark');
    const newPoints: { lat: number, lng: number }[] = [];
    let count = 0;
    
    for (let i = 0; i < placemarks.length; i++) {
      const p = placemarks[i];
      const name = p.getElementsByTagName('name')[0]?.textContent || `Point ${i+1}`;
      const coordsText = p.getElementsByTagName('coordinates')[0]?.textContent?.trim();
      
      if (coordsText) {
        const parts = coordsText.split(',');
        const lng = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);
        
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
          newPoints.push({ lat, lng });
          count++;
        }
      }
    }

    if (newPoints.length > 0) {
      const lats = newPoints.map(p => p.lat);
      const lngs = newPoints.map(p => p.lng);
      setFitBoundsTrigger({
        id: 'import-' + Date.now(),
        bounds: {
          north: Math.max(...lats),
          south: Math.min(...lats),
          east: Math.max(...lngs),
          west: Math.min(...lngs)
        }
      });
    }

    setImportStatus({ count, visible: true });
    setTimeout(() => setImportStatus({ count: 0, visible: false }), 5000);
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
    ${locations.filter(l => visibleFeederIds.has(l.spbjId)).map(loc => `
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
    a.download = `lokasi_aset_terpilih.kml`;
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

        {/* Import Feedback Overlay */}
        {importStatus.visible && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full shadow-2xl font-bold text-xs border-2 border-white/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>Berhasil mengimpor {importStatus.count} titik tagging!</span>
            </div>
          </div>
        )}

        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                <MapPin className="w-4 h-4 text-blue-500" />
                Peta Sebaran Jaringan
              </h3>
              <span className="text-[10px] text-blue-500 font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">{spbjList.length} Feeder</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center justify-center gap-1 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 active:scale-95"
              >
                <Plus className="w-3 h-3" /> {isImporting ? '...' : 'Impor'}
              </button>
              <button onClick={exportToKML} className="flex items-center justify-center gap-1 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all active:scale-95">
                <FileCode className="w-3 h-3 text-emerald-500" /> .KML
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-1 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-all active:scale-95">
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="all">Target SPBJ Import</option>
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-500 outline-none"
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

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Peta Feeder ({spbjList.length} File)</span>
                <button 
                  onClick={() => setVisibleFeederIds(visibleFeederIds.size === spbjList.length ? new Set() : new Set(spbjList.map(s => s.id)))}
                  className="text-[9px] font-bold text-blue-500 hover:underline active:scale-95"
                >
                  {visibleFeederIds.size === spbjList.length ? 'Sembunyikan Semua' : 'Tampilkan Semua'}
                </button>
              </div>

              <div className="space-y-2">
                {spbjList.filter(s => s.projectName.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                  <div key={s.id} className={`p-3 rounded-xl border transition-all group cursor-pointer ${
                    visibleFeederIds.has(s.id) 
                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-sm' 
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="relative inline-flex items-center" onClick={(e) => { e.stopPropagation(); toggleFeederVisibility(s.id); }}>
                        <input type="checkbox" className="sr-only peer" checked={visibleFeederIds.has(s.id)} readOnly />
                        <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Zap className={`w-4 h-4 ${visibleFeederIds.has(s.id) ? 'text-blue-500' : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => toggleFeederVisibility(s.id)}>
                        <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate uppercase leading-tight">{s.projectName}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-slate-400 font-medium">29.1 KMS</span>
                          <span className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">{s.up3Name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); focusFeeder(s.id); }}
                          className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-500 transition-colors active:scale-90" 
                          title="Focus View"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>
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
          <MapContent 
            locations={locations} 
            mapTypeId={mapTypeId} 
            visibleFeederIds={visibleFeederIds} 
            fitBoundsTrigger={fitBoundsTrigger}
          />

          {/* Top Right View Controls */}
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1 p-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
              <button 
                onClick={() => setMapTypeId('satellite')} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  mapTypeId === 'satellite' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" /> Satelit
              </button>
              <button 
                onClick={() => setMapTypeId('roadmap')} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  mapTypeId === 'roadmap' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
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
          </div>

          {/* Bottom Left Summary overlay */}
          <div className="absolute bottom-8 left-8 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl z-20 max-w-[200px] pointer-events-none border-l-4 border-l-blue-500 transform hover:scale-105 transition-transform">
            <h5 className="text-[10px] font-black text-white/50 mb-3 uppercase tracking-[0.2em]">Statistik Sebaran</h5>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Total Aset</p>
                <p className="text-2xl font-black text-white leading-none tracking-tighter">
                  {locations.filter(l => visibleFeederIds.has(l.spbjId)).length}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Terverifikasi</p>
                <p className="text-2xl font-black text-emerald-500 leading-none tracking-tighter">
                  {locations.filter(l => visibleFeederIds.has(l.spbjId) && l.status === 'Verified').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};


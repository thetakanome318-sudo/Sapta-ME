/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Ruler, 
  Trash2, 
  Save, 
  Navigation, 
  Layers, 
  Maximize,
  X,
  Plus,
  MousePointer2,
  List
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPoint } from '../types';
import { subscribeMapPoints, upsertMapPoint, deleteMapPoint } from '../services/firestoreSync';

const MAP_ID = 'DEMO_MAP_ID';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const MapMakerView: React.FC = () => {
  const [points, setMapPoints] = useState<MapPoint[]>([]);
  const [mapTypeId, setMapTypeId] = useState('satellite');
  const [mode, setMode] = useState<'tag' | 'measure' | 'view'>('tag');
  const [measurePath, setMeasurePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [showList, setShowList] = useState(false);

  const geometryLib = useMapsLibrary('geometry');

  useEffect(() => {
    const unsub = subscribeMapPoints((data) => {
      setMapPoints(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (geometryLib && measurePath.length > 1) {
      let dist = 0;
      for (let i = 0; i < measurePath.length - 1; i++) {
        dist += geometryLib.spherical.computeDistanceBetween(measurePath[i], measurePath[i+1]);
      }
      setTotalDistance(dist);
    } else {
      setTotalDistance(0);
    }
  }, [measurePath, geometryLib]);

  const handleMapClick = (e: any) => {
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;

    if (mode === 'tag') {
      const name = prompt('Masukkan nama titik lokasi:');
      if (name) {
        const newPoint: MapPoint = {
          id: `WP-${Date.now()}`,
          name,
          lat,
          lng,
          timestamp: new Date().toISOString(),
          type: 'Waypoint'
        };
        upsertMapPoint(newPoint);
      }
    } else if (mode === 'measure') {
      setMeasurePath([...measurePath, { lat, lng }]);
    }
  };

  const clearMeasure = () => {
    setMeasurePath([]);
    setTotalDistance(0);
  };

  const removePoint = (id: string) => {
    if (confirm('Hapus titik ini?')) {
      deleteMapPoint(id);
    }
  };

  return (
    <APIProvider apiKey={API_KEY} libraries={['geometry']}>
      <div className="flex h-[calc(100vh-120px)] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
        
        {/* Map Header / Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row gap-3 pointer-events-none">
          <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl pointer-events-auto">
            <button 
              onClick={() => setMode('tag')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'tag' ? 'bg-amber-400 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" /> Tagging
            </button>
            <button 
              onClick={() => { setMode('measure'); if(mode !== 'measure') clearMeasure(); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'measure' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ruler className="w-4 h-4" /> Ukur Jarak
            </button>
            <button 
              onClick={() => setMode('view')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'view' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MousePointer2 className="w-4 h-4" /> Jelajah
            </button>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl pointer-events-auto sm:ml-auto">
            <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-1">
              <button 
                onClick={() => setMapTypeId('satellite')}
                className={`p-2 rounded-lg transition-all ${mapTypeId === 'satellite' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white'}`}
                title="Satelit"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setMapTypeId('roadmap')}
                className={`p-2 rounded-lg transition-all ${mapTypeId === 'roadmap' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white'}`}
                title="Street"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setShowList(!showList)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                showList ? 'bg-amber-400 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" /> 
              <span className="hidden sm:inline">Daftar Titik ({points.length})</span>
            </button>
          </div>
        </div>

        {/* Distance Overlay */}
        {mode === 'measure' && measurePath.length > 0 && (
          <div className="absolute top-20 left-4 z-10 p-4 bg-blue-600 text-white rounded-2xl shadow-2xl border border-blue-400 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pengukuran Jarak</span>
              </div>
              <button onClick={clearMeasure} className="p-1 hover:bg-blue-500 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black tracking-tighter">
                {totalDistance > 1000 ? (totalDistance / 1000).toFixed(2) : totalDistance.toFixed(0)}
                <span className="text-sm font-bold ml-1">{totalDistance > 1000 ? 'KM' : 'M'}</span>
              </p>
              <p className="text-[10px] opacity-80 font-medium">{measurePath.length} Titik pengukuran terhubung</p>
            </div>
          </div>
        )}

        {/* Offline Cache Indicator */}
        <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-700 text-emerald-400 text-[10px] font-bold shadow-2xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>PWA OFFLINE CAPABLE</span>
          </div>
        </div>

        {/* Sidebar List */}
        {showList && (
          <div className="absolute inset-y-0 right-0 w-80 z-20 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2 text-white">
                <Navigation className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-tight">Saved Waypoints</h3>
              </div>
              <button onClick={() => setShowList(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {points.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30 grayscale">
                  <MapPin className="w-12 h-12" />
                  <p className="text-xs font-bold uppercase">Belum ada titik tersimpan</p>
                </div>
              ) : (
                points.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 group hover:border-amber-400/50 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-xs font-bold truncate mb-1">{p.name}</h4>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono">
                          <span>{p.lat.toFixed(6)}</span>
                          <span>,</span>
                          <span>{p.lng.toFixed(6)}</span>
                        </div>
                        <p className="text-[8px] text-slate-500 mt-2">{new Date(p.timestamp).toLocaleString()}</p>
                      </div>
                      <button onClick={() => removePoint(p.id)} className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Map Instance */}
        <div className="flex-1 w-full h-full bg-slate-950">
          <Map 
            mapId={MAP_ID}
            defaultCenter={{ lat: -5.6, lng: 132.7 }}
            defaultZoom={12}
            mapTypeId={mapTypeId}
            onClick={handleMapClick}
            disableDefaultUI
            gestureHandling={'greedy'}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {/* Waypoints */}
            {points.map(p => (
              <AdvancedMarker key={p.id} position={{ lat: p.lat, lng: p.lng }} title={p.name}>
                <div className="relative group">
                  <div className="w-5 h-5 bg-white rounded-full border-2 border-amber-500 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform cursor-pointer">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded shadow-2xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {p.name}
                  </div>
                </div>
              </AdvancedMarker>
            ))}

            {/* Measurement Points */}
            {measurePath.map((pos, idx) => (
              <AdvancedMarker key={`measure-${idx}`} position={pos}>
                <div className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
              </AdvancedMarker>
            ))}

            {/* Polyline for measurement */}
            {measurePath.length > 1 && (
              <Polyline path={measurePath} color="#3b82f6" />
            )}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
};

// Helper component for Polyline since react-google-maps doesn't have a built-in one yet
const Polyline: React.FC<{ path: google.maps.LatLngLiteral[], color: string }> = ({ path, color }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    polylineRef.current = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 3,
      map
    });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, path, color]);

  return null;
};

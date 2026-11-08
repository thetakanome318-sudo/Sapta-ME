import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Plus, Upload, Download, Layers } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { LocationTag, SpbjContract } from '../types';
import { subscribeLocationTags, subscribeSpbjContracts } from '../services/firestoreSync';

const MAP_ID = 'DEMO_MAP_ID';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const LocationTaggingView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationTag[]>([]);
  const [spbjList, setSpbjList] = useState<SpbjContract[]>([]);
  const [selectedSpbj, setSelectedSpbj] = useState<string>('all');
  const [mapTypeId, setMapTypeId] = useState('roadmap');

  useEffect(() => {
    const unsubTags = subscribeLocationTags((data) => setLocations(data));
    const unsubSpbj = subscribeSpbjContracts((data) => setSpbjList(data));
    return () => { unsubTags(); unsubSpbj(); };
  }, []);

  const filteredLocations = locations.filter(loc => 
    (selectedSpbj === 'all' || loc.spbjId === selectedSpbj) &&
    (loc.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              <span>Tagging Lokasi Proyek & Aset</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={exportToKML} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg"><Download className="w-4 h-4" /> Export KML</button>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"><Upload className="w-4 h-4" /> Import KML/KMZ</button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <span className="text-xs font-bold">Filter per SPBJ:</span>
          <select value={selectedSpbj} onChange={e => setSelectedSpbj(e.target.value)} className="text-xs p-2 border rounded-lg">
            <option value="all">Semua SPBJ</option>
            {spbjList.map(s => <option key={s.id} value={s.id}>{s.spbjNumber} - {s.projectName}</option>)}
          </select>
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Cari lokasi..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 p-2 border rounded-lg text-xs" />
          </div>
        </div>

        <div className="h-[500px] w-full rounded-xl border overflow-hidden relative">
          <Map 
            mapId={MAP_ID} 
            defaultCenter={{ lat: -5.6, lng: 132.7 }} 
            defaultZoom={12}
            mapTypeId={mapTypeId}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {filteredLocations.map(loc => (
              <AdvancedMarker key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name}>
                <Pin background={loc.status === 'Verified' ? '#22c55e' : '#f59e0b'} glyphColor={'white'} />
              </AdvancedMarker>
            ))}
            
            <MapControl position={ControlPosition.TOP_RIGHT}>
              <div className="m-4 bg-white p-2 rounded shadow flex gap-2">
                <button onClick={() => setMapTypeId('roadmap')} className={`p-2 text-xs rounded ${mapTypeId === 'roadmap' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>Road</button>
                <button onClick={() => setMapTypeId('satellite')} className={`p-2 text-xs rounded ${mapTypeId === 'satellite' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>Satellite</button>
              </div>
            </MapControl>
          </Map>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr>
                <th className="p-4">Nama Lokasi</th>
                <th className="p-4">Tipe</th>
                <th className="p-4">Koordinat</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLocations.map(loc => (
                <tr key={loc.id}>
                  <td className="p-4 font-bold">{loc.name}</td>
                  <td className="p-4">{loc.type}</td>
                  <td className="p-4 font-mono">{loc.lat}, {loc.lng}</td>
                  <td className="p-4">{loc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </APIProvider>
  );
};

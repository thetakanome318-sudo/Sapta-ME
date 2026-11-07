import React from 'react';
import { Worker } from '../types';
import { 
  X, 
  Phone, 
  MapPin, 
  FileCheck2, 
  ShieldCheck, 
  HardHat, 
  Calendar, 
  Award,
  AlertTriangle
} from 'lucide-react';

interface WorkerDetailModalProps {
  worker: Worker | null;
  onClose: () => void;
}

export const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({ worker, onClose }) => {
  if (!worker) return null;

  const isPresent = worker.status !== 'Belum Presensi';
  const certExpYear = new Date(worker.k3CertExpiry).getFullYear();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={worker.photoUrl}
              alt={worker.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 shrink-0"
            />
            <div>
              <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 block">
                NIP: {worker.nip}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {worker.name}
              </h3>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 block">
                {worker.role}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Status Pills & Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Status Presensi Hari Ini</span>
            <span className="font-bold text-slate-900 dark:text-white block">
              {worker.status} {worker.checkInTime ? `(${worker.checkInTime})` : ''}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">APD K3 Terverifikasi</span>
            <span className={worker.ppeVerified ? 'font-bold text-emerald-600 dark:text-emerald-400 block' : 'font-bold text-rose-500 block'}>
              {worker.ppeVerified ? '✓ Lengkap & Layak' : 'Belum Verifikasi'}
            </span>
          </div>
        </div>

        {/* Sertifikasi Details */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-amber-500" />
            <span>Sertifikasi K3 & SKK Kemnaker RI</span>
          </h4>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-slate-900 dark:text-slate-100 space-y-2">
            <p className="font-semibold text-xs leading-relaxed">{worker.certification}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              <span>Masa Berlaku Sertifikat:</span>
              <strong className="text-slate-900 dark:text-white">{worker.k3CertExpiry}</strong>
            </div>
          </div>
        </div>

        {/* Skills Competency Tags */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-500" />
            <span>Matriks Keahlian & Spesialisasi</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {worker.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Nomor Kontak Teknisi:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">{worker.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Kontak Darurat Keluarga:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{worker.emergencyContact}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Lokasi Penugasan:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400 truncate max-w-[200px]">
              {worker.projectName}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-xl hover:opacity-90 transition-opacity"
          >
            Tutup Pratinjau Teknisi
          </button>
        </div>
      </div>
    </div>
  );
};

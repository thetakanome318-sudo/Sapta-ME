export type WorkerRole = 
  | 'Ahli K3 Elektrikal' 
  | 'Teknisi Utama ME' 
  | 'Teknisi Panel & Wiring' 
  | 'Teknisi High Voltage 20kV'
  | 'Drafter & Estimator ME' 
  | 'Welder & Pipe Fitter' 
  | 'Helper Elektrikal';

export type AttendanceStatus = 'Hadir' | 'Shift Pagi' | 'Shift Malam' | 'Overtime' | 'Izin' | 'Sakit' | 'Belum Presensi';

export interface Worker {
  id: string;
  nip: string;
  name: string;
  role: WorkerRole;
  certification: string; // e.g. "K3 Listrik Kemnaker Class A", "SKK ME Ahli Madya"
  status: AttendanceStatus;
  projectId: string;
  projectName: string;
  photoUrl: string;
  phone: string;
  emergencyContact: string;
  k3CertExpiry: string;
  checkInTime?: string;
  ppeVerified: boolean;
  latitude: number;
  longitude: number;
  skills: string[];
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  manager: string;
  progress: number; // 0-100
  status: 'Aktif' | 'Tahap Pengujian' | 'Selesai';
  totalWorkers: number;
  image: string;
  targetDate: string;
  voltageCategory: 'Tegangan Tinggi 20kV' | 'Tegangan Menengah 1kV-20kV' | 'Tegangan Rendah 380V';
  description: string;
  contractValue: string;
}

export interface TaskAssignment {
  id: string;
  projectId: string;
  projectName: string;
  taskTitle: string;
  assignedWorkerIds: string[];
  assignedWorkerNames: string[];
  priority: 'Kritis' | 'Tinggi' | 'Sedang' | 'Normal';
  status: 'Belum Mulai' | 'Dalam Proses' | 'Selesai' | 'Menunggu Inspeksi K3';
  voltageLevel: string;
  jsaStatus: 'Disetujui K3' | 'Perlu Analisis JSA' | 'Ditolak';
  dueDate: string;
  locationDetails: string;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  category: 'Pengukur Tahanan Isolasi (Megger)' | 'Kamera Termograf FLIR' | 'Tester Grounding (Tahanan Tanah)' | 'Alat Crimping Hidrolik' | 'APD Khusus Tegangan Tinggi';
  status: 'Siap Pakai' | 'Sedang Digunakan' | 'Jadwal Kalibrasi' | 'Perbaikan';
  lastCalibrated: string;
  nextCalibration: string;
  currentProjectId?: string;
  assignedWorkerName?: string;
  serialNumber: string;
}

export interface JsaResult {
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
  summary: string;
  potentialHazards: string[];
  requiredPpe: string[];
  safetySteps: string[];
  puilReference: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  role: WorkerRole;
  projectId: string;
  projectName: string;
  checkInTime: string;
  checkOutTime?: string;
  shiftType: 'Shift Pagi (08.00 - 17.00)' | 'Shift Malam (20.00 - 05.00)' | 'Lembur / Overtime';
  ppeChecked: {
    helmet: boolean;
    vdeGloves: boolean;
    safetyShoes10kV: boolean;
    harness: boolean;
    eyeProtection: boolean;
  };
  gpsCoords: string;
  status: AttendanceStatus;
  note?: string;
}

export interface Manpower {
  name: string;
  ktpNumber: string;
}

export interface Mandor {
  id: string;
  name: string;
  phone: string;
  projectId: string;
  projectName: string;
  workLocation: string; // Lokasi pekerjaan spesifik
  subcontractorTeam: string; // Tim / Vendor
  workerCount: number; // Jumlah teknisi/anggota
  status: 'Aktif On-Site' | 'Off / Standby' | 'Pindah Lokasi';
  specialization: string;
  notes?: string;
  manpowerList?: Manpower[];
}

export interface SpbjContract {
  id: string;
  spbjNumber: string; // NO SPBJ
  up3Name: string; // UP3 PLN / Pengelola Unit
  contractEndDate: string; // Tanggal Akhir Kontrak
  startDate?: string;
  projectName: string;
  contractValue: string;
  vendorCompany: string;
  status: 'Aktif' | 'Mendekati Expired' | 'Expired / Addendum';
  scopeOfWork: string;
  notes?: string;
}
export interface MaterialSummaryItem {
  id: string;
  no: number;
  category: string; // e.g. "MDU JTM", "NON MDU JTR"
  material: string;
  unit: string;
  quantity: string;
  spbjId: string; // Connection to SPBJ
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'Admin' | 'Project Manager' | 'Teknisi' | 'Gudang';
}

export interface BoqItem {
  id: string;
  itemCode: string;
  spbjId: string;
  category: string; // e.g. "Pekerjaan JTM", "Pekerjaan JTR", "Pekerjaan Gardu Distribusi", "Pekerjaan Sipil"
  materialOrWork: string; // Uraian Pekerjaan / Material
  unit: string; // btg, mtr, set, unit, ls, bh
  contractVolume: number;
  realizedVolume: number;
  unitPrice: number; // Harga Satuan (Rp)
  totalPrice: number; // Total Nilai Kontrak (Rp)
  realizedPrice: number; // Total Nilai Realisasi (Rp)
}


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

export interface MandorLocation {
  id: string;
  locationName: string;
  projectName?: string;
  status: 'Aktif' | 'Selesai';
  date: string;
}

export interface Mandor {
  id: string;
  name: string;
  phone: string;
  projectId: string;
  projectName: string;
  workLocation: string; // Lokasi pekerjaan spesifik utama
  subcontractorTeam: string; // Tim / Vendor
  workerCount: number; // Jumlah teknisi/anggota
  status: 'Aktif On-Site' | 'Off / Standby' | 'Pindah Lokasi';
  specialization: string;
  notes?: string;
  manpowerList?: Manpower[];
  ktpPhotoUrl?: string; // Foto KTP Mandor
  locations?: MandorLocation[]; // Multi-lokasi pekerjaan mandor
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

export interface MaterialBongkarItem {
  id: string;
  itemCode: string;
  spbjId: string;
  category: string; // e.g. "Bongkaran JTM", "Bongkaran JTR", "Bongkaran Trafo / Gardu"
  materialName: string;
  unit: string;
  volumeBongkar: number;
  condition: 'Baik / Layak Pakai' | 'Rusak / Scrap' | 'Perlu Perbaikan';
  warehouseLocation: string; // e.g. "Gudang Ambon", "Gudang Tual", "Site Proyek"
  dateBongkar: string;
  notes?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: string;
  phone?: string;
  email?: string;
  department?: string;
  status?: 'Aktif' | 'Non-Aktif';
  allowedMenus?: string[];
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

export interface VehicleCompany {
  id: string;
  plateNumber: string;
  vehicleName: string;
  type: string; // e.g. "Pick-up 4x4", "Truk Crane 6T", "Mobil Operasional Site"
  driverName: string;
  status: 'Aktif Operasional' | 'Servis / Bengkel' | 'Standby / Pool';
  lastServiceDate: string;
  nextTaxDate: string;
  spbjId?: string;
  notes?: string;
}

export interface VehicleLease {
  id: string;
  contractNumber: string;
  vendorName: string;
  plateNumber: string;
  vehicleType: string;
  monthlyRate: number; // Biaya Sewa Per Bulan (Rp)
  startDate: string;
  endDate: string;
  status: 'Aktif' | 'Mendekati Expired' | 'Selesai Kontrak';
  assignedSite: string;
  spbjId: string;
  notes?: string;
}

export interface EmergencyWork {
  id: string;
  ticketNumber: string;
  locationName: string;
  spbjId?: string;
  severity: 'Kritis / Blackout' | 'Tinggi / Trip Breaker' | 'Sedang';
  description: string;
  mandorName: string;
  teamCount: number;
  reportedTime: string;
  targetResponseTime: string;
  actionTaken: string;
  status: 'Dalam Penanganan (On-Site)' | 'Menunggu Sparepart' | 'Selesai / Normal';
  reportedBy: string;
  workType: 'Emergency' | 'Rehap' | 'Pohon Tumbang' | 'Lain-lain';
  notes?: string;
}

export interface BopItem {
  id: string;
  voucherNumber: string;
  category: 'Konsumsi & Makan Tim' | 'BBM & Tol Kendaraan' | 'Sewa Mess & Akomodasi' | 'Perizinan & Koordinasi Lokal' | 'ATK & Operasional Gudang' | 'Kas Kecil / Lainnya';
  spbjId: string;
  projectName: string;
  description: string;
  amount: number; // Biaya (Rp)
  date: string;
  submittedBy: string;
  approvedBy: string;
  status: 'Disetujui' | 'Menunggu Persetujuan' | 'Ditolak';
  receiptPhotoUrl?: string;
  notes?: string;
}

export interface PlanItem {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  description: string;
  status: 'Rencana' | 'Selesai';
}

export interface LocationTag {
  id: string;
  spbjId: string;
  name: string;
  type: 'Substation' | 'Pole' | 'Transformer' | 'Other';
  lat: number;
  lng: number;
  status: 'Verified' | 'Pending';
  lastChecked: string;
}

export interface WageAdvance {
  id: string;
  spbjId: string;
  projectName: string;
  mandorName: string;
  description: string;
  amount: number;
  date: string;
  submittedBy: string;
  approvedBy?: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  receiptPhotoUrl?: string;
  notes?: string;
}




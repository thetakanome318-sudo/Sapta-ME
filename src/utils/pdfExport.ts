import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AttendanceRecord, TaskAssignment, MaterialSummaryItem, SpbjContract, Project, Worker, BoqItem } from '../types';

// Helper for PT Sapta Manunggal Karya Header
const addHeader = (doc: jsPDF, title: string, subtitle?: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Accent Bar
  doc.setFillColor(0, 32, 96); // #002060 Navy Blue
  doc.rect(0, 0, pageWidth, 12, 'F');

  // Company Name & Subtitle
  doc.setTextColor(0, 32, 96);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PT SAPTA MANUNGGAL KARYA', 14, 22);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Divisi Mekanikal & Elektrikal | Laporan Resmi Sistem Monitoring Lapangan', 14, 27);

  // Document Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, 36);

  if (subtitle) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 14, 41);
  }

  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, subtitle ? 44 : 39, pageWidth - 14, subtitle ? 44 : 39);

  return subtitle ? 48 : 43;
};

// Footer Page Numbering
const addFooter = (doc: jsPDF) => {
  const pageCount = (doc as any).internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    
    // Left: Generated timestamp
    const dateStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    doc.text(`Dicetak pada: ${dateStr} WIB | PT Sapta Manunggal Karya`, 14, pageHeight - 8);
    
    // Right: Page N of M
    doc.text(`Halaman ${i} dari ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
  }
};

/**
 * EXPORT ATTENDANCE LOGS TO FORMATTED PDF
 */
export const exportAttendancePDF = (
  records: AttendanceRecord[],
  workers: Worker[],
  filterProjectName?: string
) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  
  const startY = addHeader(
    doc,
    'LAPORAN PRESENSI & K3 TEKNISI LAPANGAN',
    filterProjectName ? `Filter Proyek: ${filterProjectName}` : 'Seluruh Proyek & Lokasi Penugasan Lapangan'
  );

  // Summary Metrics Bar
  const totalRecords = records.length;
  const hadirCount = records.filter(r => r.status === 'Hadir' || r.status.includes('Shift') || r.status === 'Overtime').length;
  const ppeVerifiedCount = records.filter(r => r.ppeChecked?.helmet && r.ppeChecked?.vdeGloves).length;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(241, 245, 249);
  doc.rect(14, startY, 269, 10, 'F');
  doc.setTextColor(30, 41, 59);
  doc.text(`Total Presensi: ${totalRecords} Record   |   Hadir On-Site: ${hadirCount} Teknisi   |   APD K3 Lengkap: ${ppeVerifiedCount} Personel`, 18, startY + 6.5);

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.workerName,
    r.role,
    r.projectName.length > 30 ? `${r.projectName.substring(0, 30)}...` : r.projectName,
    r.checkInTime || '-',
    r.shiftType.split('(')[0].trim(),
    r.status,
    (r.ppeChecked?.helmet && r.ppeChecked?.vdeGloves) ? 'LENGKAP (100%)' : 'PARSIAL',
    r.gpsCoords ? r.gpsCoords.substring(0, 25) : 'GPS Valid'
  ]);

  autoTable(doc, {
    startY: startY + 13,
    head: [['NO', 'NAMA TEKNISI', 'JABATAN / ROLE', 'PROYEK PENUGASAN', 'JAM MASUK', 'SHIFT', 'STATUS', 'VERIFIKASI APD', 'KOORDINAT GPS']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 32, 96],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { fontStyle: 'bold', cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 55 },
      4: { halign: 'center', cellWidth: 22 },
      5: { halign: 'center', cellWidth: 25 },
      6: { halign: 'center', cellWidth: 22 },
      7: { halign: 'center', cellWidth: 28 },
      8: { cellWidth: 32 },
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save(`Laporan_Presensi_Teknisi_SMK_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * EXPORT DAILY PROGRESS & TASK MONITORING TO FORMATTED PDF
 */
export const exportProgressReportPDF = (
  tasks: TaskAssignment[],
  projects: Project[],
  selectedProjectName?: string
) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const startY = addHeader(
    doc,
    'LAPORAN PROGRES HARIAN & MONITORING PEKERJAAN',
    selectedProjectName ? `Filter Proyek: ${selectedProjectName}` : 'Seluruh Penugasan Tim Mekanikal Elektrikal'
  );

  const completed = tasks.filter(t => t.status === 'Selesai').length;
  const inProgress = tasks.filter(t => t.status === 'Dalam Proses').length;
  const waitingK3 = tasks.filter(t => t.status === 'Menunggu Inspeksi K3').length;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(241, 245, 249);
  doc.rect(14, startY, 269, 10, 'F');
  doc.setTextColor(30, 41, 59);
  doc.text(`Total Tugas: ${tasks.length}   |   Selesai: ${completed}   |   Dalam Proses: ${inProgress}   |   Antrean Inspeksi K3: ${waitingK3}`, 18, startY + 6.5);

  const tableData = tasks.map((t, idx) => [
    idx + 1,
    t.taskTitle,
    t.projectName.length > 30 ? `${t.projectName.substring(0, 30)}...` : t.projectName,
    t.assignedWorkerNames ? t.assignedWorkerNames.join(', ') : '-',
    t.voltageLevel,
    t.priority,
    t.status,
    t.dueDate,
    t.locationDetails || '-'
  ]);

  autoTable(doc, {
    startY: startY + 13,
    head: [['NO', 'ITEM URAIAN PEKERJAAN', 'PROYEK INDUK', 'TEKNISI PELAKSANA', 'TEGANGAN', 'PRIORITAS', 'STATUS PROGRES', 'TENGGAT', 'LOKASI / SITE']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 32, 96],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { fontStyle: 'bold', cellWidth: 60 },
      2: { cellWidth: 45 },
      3: { cellWidth: 35 },
      4: { halign: 'center', cellWidth: 25 },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 25 },
      7: { halign: 'center', cellWidth: 20 },
      8: { cellWidth: 29 },
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save(`Laporan_Progres_Harian_SMK_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * EXPORT MDU / NON-MDU MATERIAL SUMMARY TO FORMATTED PDF
 */
export const exportMaterialPDF = (
  title: string,
  materials: MaterialSummaryItem[],
  spbjList: SpbjContract[],
  selectedSpbjId: string
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const selectedSpbj = spbjList.find(s => s.id === selectedSpbjId);

  const startY = addHeader(
    doc,
    title,
    selectedSpbj ? `Kontrak SPBJ: ${selectedSpbj.spbjNumber} (${selectedSpbj.up3Name})` : 'Seluruh SPBJ & Lokasi Proyek'
  );

  const categories = Array.from(new Set(materials.map(m => m.category)));

  let currentY = startY + 2;

  categories.forEach((category) => {
    const catItems = materials.filter(m => m.category === category && (selectedSpbjId === 'all' || m.spbjId === selectedSpbjId));
    if (catItems.length === 0) return;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(189, 215, 238); // #BDD7EE
    doc.rect(14, currentY, 182, 7, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(category.toUpperCase(), 18, currentY + 5);

    currentY += 8;

    const rows = catItems.map((item, idx) => [
      idx + 1,
      item.material,
      item.unit,
      item.quantity
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['NO', 'MATERIAL', 'SAT', 'JUMLAH']],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 32, 96],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { fontStyle: 'bold', cellWidth: 115 },
        2: { halign: 'center', cellWidth: 22 },
        3: { halign: 'center', fontStyle: 'bold', cellWidth: 30 },
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;
  });

  addFooter(doc);
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * EXPORT BILL OF QUANTITIES (BOQ) TO FORMATTED PDF
 */
export const exportBoqPDF = (
  boqItems: BoqItem[],
  spbjList: SpbjContract[],
  selectedSpbjId: string
) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const selectedSpbj = spbjList.find(s => s.id === selectedSpbjId);

  const startY = addHeader(
    doc,
    'BILL OF QUANTITIES (BOQ) & RINCIAN ANGGARAN PEKERJAAN ME',
    selectedSpbj ? `Kontrak SPBJ: ${selectedSpbj.spbjNumber} (${selectedSpbj.up3Name})` : 'Seluruh SPBJ & Kontrak Pekerjaan'
  );

  const filteredItems = selectedSpbjId === 'all' 
    ? boqItems 
    : boqItems.filter(i => i.spbjId === selectedSpbjId);

  const totalContract = filteredItems.reduce((acc, i) => acc + (i.totalPrice || 0), 0);
  const totalRealized = filteredItems.reduce((acc, i) => acc + (i.realizedPrice || 0), 0);
  const overallProgress = totalContract > 0 ? (totalRealized / totalContract) * 100 : 0;

  const formatRupiah = (val: number) => `Rp ${Math.round(val).toLocaleString('id-ID')}`;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(241, 245, 249);
  doc.rect(14, startY, 269, 10, 'F');
  doc.setTextColor(30, 41, 59);

  doc.text(
    `Total Nilai Kontrak: ${formatRupiah(totalContract)}   |   Total Realisasi: ${formatRupiah(totalRealized)}   |   Progres Biaya Fisik: ${overallProgress.toFixed(1)}%`,
    18,
    startY + 6.5
  );

  const tableData = filteredItems.map((item, idx) => {
    const prog = item.contractVolume > 0 ? ((item.realizedVolume / item.contractVolume) * 100).toFixed(1) : '0';
    return [
      idx + 1,
      item.itemCode,
      item.category,
      item.materialOrWork,
      item.unit,
      item.contractVolume.toLocaleString('id-ID'),
      item.realizedVolume.toLocaleString('id-ID'),
      `${prog}%`,
      formatRupiah(item.unitPrice),
      formatRupiah(item.totalPrice),
      formatRupiah(item.realizedPrice),
    ];
  });

  autoTable(doc, {
    startY: startY + 13,
    head: [['NO', 'KODE', 'KATEGORI', 'URAIAN PEKERJAAN / MATERIAL', 'SAT', 'VOL KONTRAK', 'VOL REALISASI', 'PROGRES', 'HARGA SATUAN', 'TOTAL KONTRAK', 'TOTAL REALISASI']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 32, 96],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 20 },
      2: { cellWidth: 32 },
      3: { fontStyle: 'bold', cellWidth: 55 },
      4: { halign: 'center', cellWidth: 12 },
      5: { halign: 'right', cellWidth: 18 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'center', cellWidth: 16 },
      8: { halign: 'right', cellWidth: 28 },
      9: { halign: 'right', fontStyle: 'bold', cellWidth: 30 },
      10: { halign: 'right', fontStyle: 'bold', cellWidth: 30 },
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save(`Laporan_BOQ_SMK_${new Date().toISOString().slice(0, 10)}.pdf`);
};


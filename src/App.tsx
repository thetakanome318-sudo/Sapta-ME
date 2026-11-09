import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PROJECTS, 
  INITIAL_WORKERS, 
  INITIAL_TASKS, 
  INITIAL_EQUIPMENT, 
  INITIAL_ATTENDANCE,
  INITIAL_MANDORS,
  INITIAL_SPBJ_CONTRACTS,
  INITIAL_MDU_MATERIALS,
  INITIAL_NON_MDU_MATERIALS,
  INITIAL_USERS,
  INITIAL_BOQ_ITEMS,
  INITIAL_MATERIAL_BONGKAR,
  INITIAL_VEHICLE_COMPANY,
  INITIAL_VEHICLE_LEASE,
  INITIAL_EMERGENCY_WORKS,
  INITIAL_BOP_ITEMS,
  INITIAL_LOGISTICS_LABOR_COSTS,
  INITIAL_MANPOWER_RECORDS
} from './data/mockData';
import { Project, Worker, TaskAssignment, Equipment, AttendanceRecord, Mandor, SpbjContract, MaterialSummaryItem, UserAccount, BoqItem, MaterialBongkarItem, VehicleCompany, VehicleLease, EmergencyWork, BopItem, LogisticsLaborCost, ManpowerRecord } from './types';
import { testFirestoreConnection } from './firebase';
import {
  subscribeSpbjContracts,
  upsertSpbjContract,
  subscribeBoqItems,
  upsertBoqItem,
  deleteBoqItem,
  subscribeMandors,
  upsertMandor,
  subscribeCompanyVehicles,
  upsertCompanyVehicle,
  subscribeLeaseVehicles,
  upsertLeaseVehicle,
  subscribeEmergencyWorks,
  upsertEmergencyWork,
  subscribeBopItems,
  upsertBopItem,
  subscribeMaterialBongkar,
  upsertMaterialBongkar,
  deleteMaterialBongkar,
  subscribeUsers,
  upsertUser,
  deleteUser,
  subscribeWageAdvances,
  subscribeLogisticsLaborCosts,
  upsertLogisticsLaborCost,
  deleteLogisticsLaborCost,
  subscribeManpowerRecords,
  upsertManpowerRecord,
  deleteManpowerRecord
} from './services/firestoreSync';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AttendanceView } from './components/AttendanceView';
import { TaskJsaView } from './components/TaskJsaView';
import { EquipmentView } from './components/EquipmentView';
import { MandorView } from './components/MandorView';
import { SpbjView } from './components/SpbjView';
import { BoqView } from './components/BoqView';
import { PresentationView } from './components/PresentationView';
import { WhatsAppReportView } from './components/WhatsAppReportView';
import { MasterDataView } from './components/MasterDataView';
import { WorkMonitoringView } from './components/WorkMonitoringView';
import { EmergencyWorkView } from './components/EmergencyWorkView';
import { WorkRealizationView } from './components/WorkRealizationView';
import { LocationTaggingView } from './components/LocationTaggingView';
import { WorkTimelineView } from './components/WorkTimelineView';
import { EquipmentMonitoringView } from './components/EquipmentMonitoringView';
import { PpeMonitoringView } from './components/PpeMonitoringView';
import { MduMonitoringView } from './components/MduMonitoringView';
import { NonMduMonitoringView } from './components/NonMduMonitoringView';
import { MaterialBongkarView } from './components/MaterialBongkarView';
import { VehicleCompanyView } from './components/VehicleCompanyView';
import { VehicleLeaseView } from './components/VehicleLeaseView';
import { LogisticsLaborCostView } from './components/LogisticsLaborCostView';
import { BopView } from './components/BopView';
import { WarehouseView } from './components/WarehouseView';
import { WarehouseAmbonView } from './components/WarehouseAmbonView';
import { WarehouseTualView } from './components/WarehouseTualView';
import { WorkerDetailModal } from './components/WorkerDetailModal';
import { CheckInModal } from './components/CheckInModal';
import { ManpowerListView } from './components/ManpowerListView';
import { SpbjSummaryView } from './components/SpbjSummaryView';

import { LoginView } from './components/LoginView';
import { WageAdvanceView } from './components/WageAdvanceView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('spbj');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // User Authentication & Management State
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Core Datasets
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [tasks, setTasks] = useState<TaskAssignment[]>(INITIAL_TASKS);
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [attendanceLog, setAttendanceLog] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [mandors, setMandors] = useState<Mandor[]>(INITIAL_MANDORS);
  const [spbjContracts, setSpbjContracts] = useState<SpbjContract[]>(INITIAL_SPBJ_CONTRACTS);
  const [mduMaterials, setMduMaterials] = useState<MaterialSummaryItem[]>(INITIAL_MDU_MATERIALS);
  const [nonMduMaterials, setNonMduMaterials] = useState<MaterialSummaryItem[]>(INITIAL_NON_MDU_MATERIALS);
  const [boqItems, setBoqItems] = useState<BoqItem[]>(INITIAL_BOQ_ITEMS);
  const [materialBongkarItems, setMaterialBongkarItems] = useState<MaterialBongkarItem[]>(INITIAL_MATERIAL_BONGKAR);
  const [companyVehicles, setCompanyVehicles] = useState<VehicleCompany[]>(INITIAL_VEHICLE_COMPANY);
  const [leaseVehicles, setLeaseVehicles] = useState<VehicleLease[]>(INITIAL_VEHICLE_LEASE);
  const [emergencyWorks, setEmergencyWorks] = useState<EmergencyWork[]>(INITIAL_EMERGENCY_WORKS);
  const [bopItems, setBopItems] = useState<BopItem[]>(INITIAL_BOP_ITEMS);
  const [logisticsLaborCosts, setLogisticsLaborCosts] = useState<LogisticsLaborCost[]>(INITIAL_LOGISTICS_LABOR_COSTS);
  const [manpowerRecords, setManpowerRecords] = useState<ManpowerRecord[]>(INITIAL_MANPOWER_RECORDS);
  const [selectedSummarySpbjId, setSelectedSummarySpbjId] = useState<string>('');

  // Modals State
  const [selectedWorkerForModal, setSelectedWorkerForModal] = useState<Worker | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);

  // Dark Mode Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Real-time Firestore Cloud Sync across all devices (Desktop, Mobile, etc.)
  useEffect(() => {
    // 1. Initial connection verification
    testFirestoreConnection();

    // 2. Real-time subscriptions
    const unsubSpbj = subscribeSpbjContracts((data) => {
      if (data && data.length > 0) setSpbjContracts(data);
    });

    const unsubBoq = subscribeBoqItems((data) => {
      if (data && data.length > 0) setBoqItems(data);
    });

    const unsubMandor = subscribeMandors((data) => {
      if (data && data.length > 0) setMandors(data);
    });

    const unsubCompanyVehicles = subscribeCompanyVehicles((data) => {
      if (data && data.length > 0) setCompanyVehicles(data);
    });

    const unsubLeaseVehicles = subscribeLeaseVehicles((data) => {
      if (data && data.length > 0) setLeaseVehicles(data);
    });

    const unsubEmergency = subscribeEmergencyWorks((data) => {
      if (data && data.length > 0) setEmergencyWorks(data);
    });

    const unsubBop = subscribeBopItems((data) => {
      if (data && data.length > 0) setBopItems(data);
    });

    const unsubBongkar = subscribeMaterialBongkar((data) => {
      if (data && data.length > 0) setMaterialBongkarItems(data);
    });

    const unsubUsers = subscribeUsers((data) => {
      if (data && data.length > 0) setUsers(data);
    });

    const unsubWageAdvances = subscribeWageAdvances((data) => {
      // Potentially used for global totals if needed
    });

    const unsubCosts = subscribeLogisticsLaborCosts((data) => {
      if (data && data.length > 0) setLogisticsLaborCosts(data);
    });

    const unsubManpower = subscribeManpowerRecords((data) => {
      if (data && data.length > 0) setManpowerRecords(data);
    });

    return () => {
      unsubSpbj();
      unsubBoq();
      unsubMandor();
      unsubCompanyVehicles();
      unsubLeaseVehicles();
      unsubEmergency();
      unsubBop();
      unsubBongkar();
      unsubUsers();
      unsubWageAdvances();
      unsubCosts();
      unsubManpower();
    };
  }, []);

  // User Actions (Cloud Synchronized)
  const handleAddUser = (newUser: UserAccount) => {
    setUsers([newUser, ...users]);
    upsertUser(newUser);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    upsertUser(updatedUser);
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    deleteUser(id);
  };

  // Enforce user menu permissions on activeTab
  useEffect(() => {
    if (currentUser && currentUser.role !== 'Admin' && currentUser.allowedMenus && currentUser.allowedMenus.length > 0) {
      const allowed = currentUser.allowedMenus;
      const bopFamily = ['bop', 'bop-management', 'logistics-labor', 'bop-angkutan', 'bop-buruh', 'wage-advance', 'bop-operasional', 'bop-sewa-mobil', 'vehicle-lease'];
      const isAllowed = allowed.some((menuId) => 
        menuId === activeTab || 
        (bopFamily.includes(menuId) && bopFamily.includes(activeTab)) ||
        (menuId === 'monitoring-pekerjaan' && activeTab.startsWith('monitoring-')) ||
        (menuId === 'monitoring-kendaraan' && (activeTab === 'vehicle-company' || activeTab === 'vehicle-lease')) ||
        (menuId === 'warehouse' && (activeTab === 'warehouse-ambon' || activeTab === 'warehouse-tual')) ||
        (menuId === 'emergency-management' && ['emergency-work', 'rehap-work', 'pohon-tumbang', 'other-work'].includes(activeTab))
      );
      if (!isAllowed) {
        // If allowed has any BOP permission and current activeTab is a BOP tab, don't kick out
        if (bopFamily.includes(activeTab) && allowed.some(m => bopFamily.includes(m))) {
          return;
        }
        setActiveTab(allowed[0]);
      }
    }
  }, [currentUser, activeTab]);

  // Logistics & Labor Cost Actions (Cloud Synchronized)
  const handleAddLogisticsLaborCost = (newCost: Omit<LogisticsLaborCost, 'id'>) => {
    const item: LogisticsLaborCost = {
      ...newCost,
      id: `EXP-${String(logisticsLaborCosts.length + 1).padStart(3, '0')}`,
    };
    setLogisticsLaborCosts([item, ...logisticsLaborCosts]);
    upsertLogisticsLaborCost(item);
  };

  const handleUpdateLogisticsLaborCostStatus = (id: string, status: LogisticsLaborCost['status']) => {
    const target = logisticsLaborCosts.find((c) => c.id === id);
    if (target) {
      const updated = { ...target, status };
      setLogisticsLaborCosts(logisticsLaborCosts.map((c) => (c.id === id ? updated : c)));
      upsertLogisticsLaborCost(updated);
    }
  };

  const handleDeleteLogisticsLaborCost = (id: string) => {
    setLogisticsLaborCosts(logisticsLaborCosts.filter((c) => c.id !== id));
    deleteLogisticsLaborCost(id);
  };

  // Manpower Actions (Cloud Synchronized)
  const handleAddManpower = (newRecord: Omit<ManpowerRecord, 'id'>) => {
    const item: ManpowerRecord = {
      ...newRecord,
      id: `MP-${String(manpowerRecords.length + 1).padStart(3, '0')}`,
    };
    setManpowerRecords([item, ...manpowerRecords]);
    upsertManpowerRecord(item);
  };

  const handleUpdateManpower = (updated: ManpowerRecord) => {
    setManpowerRecords(manpowerRecords.map((m) => (m.id === updated.id ? updated : m)));
    upsertManpowerRecord(updated);
  };

  const handleDeleteManpower = (id: string) => {
    setManpowerRecords(manpowerRecords.filter((m) => m.id !== id));
    deleteManpowerRecord(id);
  };

  // BOQ Actions (Cloud Synchronized)
  const handleAddBoqItem = (newItem: BoqItem) => {
    setBoqItems([newItem, ...boqItems]);
    upsertBoqItem(newItem);
  };

  const handleUpdateBoqItem = (updatedItem: BoqItem) => {
    setBoqItems(boqItems.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
    upsertBoqItem(updatedItem);
  };

  const handleDeleteBoqItem = (id: string) => {
    setBoqItems(boqItems.filter((i) => i.id !== id));
    deleteBoqItem(id);
  };

  // Material Bongkar Actions (Cloud Synchronized)
  const handleAddMaterialBongkar = (newItem: MaterialBongkarItem) => {
    setMaterialBongkarItems([newItem, ...materialBongkarItems]);
    upsertMaterialBongkar(newItem);
  };

  const handleDeleteMaterialBongkar = (id: string) => {
    setMaterialBongkarItems(materialBongkarItems.filter((i) => i.id !== id));
    deleteMaterialBongkar(id);
  };

  // Vehicle Actions (Cloud Synchronized)
  const handleAddCompanyVehicle = (newVehicle: Omit<VehicleCompany, 'id'>) => {
    const item: VehicleCompany = {
      ...newVehicle,
      id: `VHC-${String(companyVehicles.length + 1).padStart(3, '0')}`,
    };
    setCompanyVehicles([item, ...companyVehicles]);
    upsertCompanyVehicle(item);
  };

  const handleUpdateCompanyVehicleStatus = (id: string, status: VehicleCompany['status']) => {
    const target = companyVehicles.find((v) => v.id === id);
    if (target) {
      const updated = { ...target, status };
      setCompanyVehicles(companyVehicles.map((v) => (v.id === id ? updated : v)));
      upsertCompanyVehicle(updated);
    }
  };

  const handleAddLeaseVehicle = (newLease: Omit<VehicleLease, 'id'>) => {
    const item: VehicleLease = {
      ...newLease,
      id: `LS-${String(leaseVehicles.length + 1).padStart(3, '0')}`,
    };
    setLeaseVehicles([item, ...leaseVehicles]);
    upsertLeaseVehicle(item);
  };

  const handleUpdateLeaseVehicleStatus = (id: string, status: VehicleLease['status']) => {
    const target = leaseVehicles.find((l) => l.id === id);
    if (target) {
      const updated = { ...target, status };
      setLeaseVehicles(leaseVehicles.map((l) => (l.id === id ? updated : l)));
      upsertLeaseVehicle(updated);
    }
  };

  // Emergency Work Actions (Cloud Synchronized)
  const handleAddEmergencyWork = (newWork: Omit<EmergencyWork, 'id'>) => {
    const item: EmergencyWork = {
      ...newWork,
      id: `EMG-${String(emergencyWorks.length + 1).padStart(3, '0')}`,
    };
    setEmergencyWorks([item, ...emergencyWorks]);
    upsertEmergencyWork(item);
  };

  const handleUpdateEmergencyWorkStatus = (id: string, status: EmergencyWork['status']) => {
    const target = emergencyWorks.find((e) => e.id === id);
    if (target) {
      const updated = { ...target, status };
      setEmergencyWorks(emergencyWorks.map((e) => (e.id === id ? updated : e)));
      upsertEmergencyWork(updated);
    }
  };

  // BOP Actions (Cloud Synchronized)
  const handleAddBopItem = (newItem: Omit<BopItem, 'id'>) => {
    const item: BopItem = {
      ...newItem,
      id: `BOP-${String(bopItems.length + 1).padStart(3, '0')}`,
    };
    setBopItems([item, ...bopItems]);
    upsertBopItem(item);
  };

  const handleUpdateBopStatus = (id: string, status: BopItem['status']) => {
    const target = bopItems.find((b) => b.id === id);
    if (target) {
      const updated = { ...target, status };
      setBopItems(bopItems.map((b) => (b.id === id ? updated : b)));
      upsertBopItem(updated);
    }
  };

  // Actions
  const handleSelectProject = (projectId: string) => {
    setActiveTab('monitoring-pekerjaan');
  };

  const handleAddProject = (newProj: Project) => {
    setProjects([newProj, ...projects]);
  };

  const handleAddSpbj = (newSpbj: SpbjContract) => {
    setSpbjContracts([newSpbj, ...spbjContracts]);
    upsertSpbjContract(newSpbj);
  };

  const handleUpdateSpbjEndDate = (
    spbjId: string,
    newEndDate: string,
    newStatus?: SpbjContract['status']
  ) => {
    const target = spbjContracts.find((s) => s.id === spbjId);
    if (target) {
      const updated: SpbjContract = {
        ...target,
        contractEndDate: newEndDate,
        status: newStatus || target.status,
      };
      setSpbjContracts(spbjContracts.map((s) => (s.id === spbjId ? updated : s)));
      upsertSpbjContract(updated);
    }
  };

  const handleAddMandor = (newMandor: Mandor) => {
    setMandors([newMandor, ...mandors]);
    upsertMandor(newMandor);
  };

  const handleUpdateMandorLocation = (mandorId: string, newLocation: string) => {
    const target = mandors.find((m) => m.id === mandorId);
    if (target) {
      const updated: Mandor = { ...target, workLocation: newLocation };
      setMandors(mandors.map((m) => (m.id === mandorId ? updated : m)));
      upsertMandor(updated);
    }
  };

  const handleAddTask = (newTask: TaskAssignment) => {
    setTasks([newTask, ...tasks]);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskAssignment['status']) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const handleUpdateEquipmentStatus = (
    id: string,
    status: Equipment['status'],
    assignedWorkerName?: string
  ) => {
    setEquipment(
      equipment.map((e) =>
        e.id === id ? { ...e, status, assignedWorkerName: assignedWorkerName || undefined } : e
      )
    );
  };

  const handleSubmitCheckIn = (newRecord: AttendanceRecord) => {
    setAttendanceLog([newRecord, ...attendanceLog]);
    setWorkers(
      workers.map((w) =>
        w.id === newRecord.workerId
          ? {
              ...w,
              status: newRecord.status,
              checkInTime: newRecord.checkInTime,
              ppeVerified: true,
            }
          : w
      )
    );
  };

  // Material Actions
  const handleUpdateMduMaterials = (updated: MaterialSummaryItem[]) => setMduMaterials(updated);
  const handleUpdateNonMduMaterials = (updated: MaterialSummaryItem[]) => setNonMduMaterials(updated);

  const totalWorkersOnSite = workers.filter((w) => w.status !== 'Belum Presensi').length;
  
  if (!currentUser) {
    return <LoginView users={users} onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans flex relative">
      {/* Background Wallpaper Watermark (Pekerjaan Jaringan Listrik & Trafo) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/assets/aistudio/PZsH67UeSd8OhBsKh3il_1675658409_b5435da7.jpeg"
          alt=""
          className="w-full h-full object-cover object-top opacity-[0.035] dark:opacity-[0.045] filter grayscale"
        />
      </div>

      {/* Left Sidebar Menu */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        totalWorkersOnSite={totalWorkersOnSite}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <Header
          activeTab={activeTab}
          totalWorkersOnSite={totalWorkersOnSite}
          setSidebarOpen={setSidebarOpen}
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />

        <main className="flex-1 w-full px-4 sm:px-6 pt-6 pb-16">
          {activeTab === 'attendance' && (
            <AttendanceView
              workers={workers}
              attendanceLog={attendanceLog}
              projects={projects}
              onOpenCheckIn={() => setShowCheckInModal(true)}
              onOpenWorkerModal={(w) => setSelectedWorkerForModal(w)}
            />
          )}

          {(activeTab === 'spbj' || activeTab === 'spbj-list') && (
            <SpbjView
              spbjList={spbjContracts}
              projects={projects}
              onAddSpbj={handleAddSpbj}
              onUpdateSpbjEndDate={handleUpdateSpbjEndDate}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenSummary={(spbjId) => {
                setSelectedSummarySpbjId(spbjId);
                setActiveTab('spbj-summary');
              }}
            />
          )}

          {activeTab === 'spbj-summary' && (
            <SpbjSummaryView
              spbjList={spbjContracts}
              initialSpbjId={selectedSummarySpbjId}
              boqItems={boqItems}
              mandors={mandors}
              manpowerList={manpowerRecords}
              logisticsLaborCosts={logisticsLaborCosts}
              bopItems={bopItems}
              leaseVehicles={leaseVehicles}
              emergencyWorks={emergencyWorks}
              materialBongkarItems={materialBongkarItems}
              mduMaterials={mduMaterials}
              nonMduMaterials={nonMduMaterials}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'boq' && (
            <BoqView
              boqItems={boqItems}
              spbjList={spbjContracts}
              onAddBoqItem={handleAddBoqItem}
              onUpdateBoqItem={handleUpdateBoqItem}
              onDeleteBoqItem={handleDeleteBoqItem}
            />
          )}

          {activeTab === 'presentation' && (
            <PresentationView
              spbjList={spbjContracts}
              tasks={tasks}
              boqItems={boqItems}
              mandors={mandors}
              mduMaterials={mduMaterials}
              nonMduMaterials={nonMduMaterials}
              bongkarMaterials={materialBongkarItems}
            />
          )}

          {activeTab === 'whatsapp-report' && (
            <WhatsAppReportView
              spbjList={spbjContracts}
              tasks={tasks}
              mandors={mandors}
              workers={workers}
              boqItems={boqItems}
              mduMaterials={mduMaterials}
            />
          )}

          {activeTab === 'mandor' && (
            <MandorView
              mandors={mandors}
              projects={projects}
              spbjList={spbjContracts}
              onAddMandor={handleAddMandor}
              onUpdateMandorLocation={handleUpdateMandorLocation}
            />
          )}

          {activeTab === 'monitoring-pekerjaan' && (
            <WorkMonitoringView
              tasks={tasks}
              projects={projects}
              workers={workers}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {activeTab === 'emergency-work' && (
            <EmergencyWorkView
              emergencyWorks={emergencyWorks.filter(w => w.workType === 'Emergency' || !w.workType)}
              spbjList={spbjContracts}
              mandors={mandors}
              onAddEmergencyWork={handleAddEmergencyWork}
              onUpdateStatus={handleUpdateEmergencyWorkStatus}
              workType="Emergency"
            />
          )}

          {activeTab === 'rehap-work' && (
            <EmergencyWorkView
              emergencyWorks={emergencyWorks.filter(w => w.workType === 'Rehap')}
              spbjList={spbjContracts}
              mandors={mandors}
              onAddEmergencyWork={handleAddEmergencyWork}
              onUpdateStatus={handleUpdateEmergencyWorkStatus}
              workType="Rehap"
            />
          )}

          {activeTab === 'pohon-tumbang' && (
            <EmergencyWorkView
              emergencyWorks={emergencyWorks.filter(w => w.workType === 'Pohon Tumbang')}
              spbjList={spbjContracts}
              mandors={mandors}
              onAddEmergencyWork={handleAddEmergencyWork}
              onUpdateStatus={handleUpdateEmergencyWorkStatus}
              workType="Pohon Tumbang"
            />
          )}

          {activeTab === 'other-work' && (
            <EmergencyWorkView
              emergencyWorks={emergencyWorks.filter(w => w.workType === 'Lain-lain')}
              spbjList={spbjContracts}
              mandors={mandors}
              onAddEmergencyWork={handleAddEmergencyWork}
              onUpdateStatus={handleUpdateEmergencyWorkStatus}
              workType="Lain-lain"
            />
          )}

          {activeTab === 'monitoring-manpower' && (
            <ManpowerListView
              manpowerList={manpowerRecords}
              spbjList={spbjContracts}
              mandors={mandors}
              onAddManpower={handleAddManpower}
              onUpdateManpower={handleUpdateManpower}
              onDeleteManpower={handleDeleteManpower}
            />
          )}

          {activeTab === 'monitoring-realisasi' && (
            <WorkRealizationView spbjList={spbjContracts} />
          )}

          {activeTab === 'monitoring-tagging' && (
            <LocationTaggingView />
          )}

          {activeTab === 'monitoring-timeline' && (
            <WorkTimelineView spbjList={spbjContracts} />
          )}

          {activeTab === 'monitoring-alat' && (
            <EquipmentMonitoringView spbjList={spbjContracts} workers={workers} />
          )}

          {activeTab === 'monitoring-apd' && (
            <PpeMonitoringView spbjList={spbjContracts} workers={workers} />
          )}

          {activeTab === 'monitoring-mdu' && (
            <MduMonitoringView 
              materials={mduMaterials} 
              onUpdateMaterials={handleUpdateMduMaterials}
              spbjList={spbjContracts}
            />
          )}

          {activeTab === 'monitoring-nonmdu' && (
            <NonMduMonitoringView 
              materials={nonMduMaterials} 
              onUpdateMaterials={handleUpdateNonMduMaterials}
              spbjList={spbjContracts}
            />
          )}

          {activeTab === 'monitoring-bongkar' && (
            <MaterialBongkarView
              items={materialBongkarItems}
              spbjList={spbjContracts}
              onAddItem={handleAddMaterialBongkar}
              onDeleteItem={handleDeleteMaterialBongkar}
            />
          )}

          {activeTab === 'vehicle-company' && (
            <VehicleCompanyView
              vehicles={companyVehicles}
              spbjContracts={spbjContracts}
              onAddVehicle={handleAddCompanyVehicle}
              onUpdateVehicleStatus={handleUpdateCompanyVehicleStatus}
            />
          )}

          {(activeTab === 'vehicle-lease' || activeTab === 'bop-sewa-mobil') && (
            <VehicleLeaseView
              leases={leaseVehicles}
              spbjContracts={spbjContracts}
              onAddLease={handleAddLeaseVehicle}
              onUpdateLeaseStatus={handleUpdateLeaseVehicleStatus}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isBopContext={activeTab === 'bop-sewa-mobil'}
            />
          )}

          {activeTab === 'bop-angkutan' && (
            <LogisticsLaborCostView
              mode="angkutan"
              spbjList={spbjContracts}
              costs={logisticsLaborCosts}
              onAddCost={handleAddLogisticsLaborCost}
              onUpdateStatus={handleUpdateLogisticsLaborCostStatus}
              onDeleteCost={handleDeleteLogisticsLaborCost}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'bop-buruh' && (
            <LogisticsLaborCostView
              mode="buruh"
              spbjList={spbjContracts}
              costs={logisticsLaborCosts}
              onAddCost={handleAddLogisticsLaborCost}
              onUpdateStatus={handleUpdateLogisticsLaborCostStatus}
              onDeleteCost={handleDeleteLogisticsLaborCost}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'wage-advance' && (
            <WageAdvanceView 
              spbjList={spbjContracts} 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {(activeTab === 'bop-operasional' || activeTab === 'bop' || activeTab === 'bop-management') && (
            <BopView
              bopItems={bopItems}
              spbjList={spbjContracts}
              onAddBopItem={handleAddBopItem}
              onUpdateBopStatus={handleUpdateBopStatus}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'logistics-labor' && (
            <LogisticsLaborCostView
              mode="all"
              spbjList={spbjContracts}
              costs={logisticsLaborCosts}
              onAddCost={handleAddLogisticsLaborCost}
              onUpdateStatus={handleUpdateLogisticsLaborCostStatus}
              onDeleteCost={handleDeleteLogisticsLaborCost}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'warehouse' && (
            <WarehouseView />
          )}

          {activeTab === 'warehouse-ambon' && (
            <WarehouseAmbonView />
          )}

          {activeTab === 'warehouse-tual' && (
            <WarehouseTualView />
          )}

          {activeTab === 'master-data' && (
            <MasterDataView
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              projects={projects}
              onAddProject={handleAddProject}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskJsaView
              tasks={tasks}
              projects={projects}
              workers={workers}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentView
              equipment={equipment}
              workers={workers}
              projects={projects}
              onUpdateEquipmentStatus={handleUpdateEquipmentStatus}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <WorkerDetailModal
        worker={selectedWorkerForModal}
        onClose={() => setSelectedWorkerForModal(null)}
      />

      {showCheckInModal && (
        <CheckInModal
          workers={workers}
          projects={projects}
          onClose={() => setShowCheckInModal(false)}
          onSubmitCheckIn={handleSubmitCheckIn}
        />
      )}
    </div>
  );
}

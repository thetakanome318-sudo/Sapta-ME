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
  INITIAL_BOQ_ITEMS
} from './data/mockData';
import { Project, Worker, TaskAssignment, Equipment, AttendanceRecord, Mandor, SpbjContract, MaterialSummaryItem, UserAccount, BoqItem } from './types';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AttendanceView } from './components/AttendanceView';
import { TaskJsaView } from './components/TaskJsaView';
import { EquipmentView } from './components/EquipmentView';
import { AiAssistantView } from './components/AiAssistantView';
import { MandorView } from './components/MandorView';
import { SpbjView } from './components/SpbjView';
import { BoqView } from './components/BoqView';
import { MasterDataView } from './components/MasterDataView';
import { WorkMonitoringView } from './components/WorkMonitoringView';
import { WorkRealizationView } from './components/WorkRealizationView';
import { LocationTaggingView } from './components/LocationTaggingView';
import { WorkTimelineView } from './components/WorkTimelineView';
import { EquipmentMonitoringView } from './components/EquipmentMonitoringView';
import { PpeMonitoringView } from './components/PpeMonitoringView';
import { MduMonitoringView } from './components/MduMonitoringView';
import { NonMduMonitoringView } from './components/NonMduMonitoringView';
import { LogisticsLaborCostView } from './components/LogisticsLaborCostView';
import { WarehouseView } from './components/WarehouseView';
import { WarehouseAmbonView } from './components/WarehouseAmbonView';
import { WarehouseTualView } from './components/WarehouseTualView';
import { WorkerDetailModal } from './components/WorkerDetailModal';
import { CheckInModal } from './components/CheckInModal';

import { LoginView } from './components/LoginView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // User Authentication & Management State
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_USERS[0]);

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

  // User Actions
  const handleAddUser = (newUser: UserAccount) => {
    setUsers([newUser, ...users]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // BOQ Actions
  const handleAddBoqItem = (newItem: BoqItem) => {
    setBoqItems([newItem, ...boqItems]);
  };

  const handleUpdateBoqItem = (updatedItem: BoqItem) => {
    setBoqItems(boqItems.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
  };

  const handleDeleteBoqItem = (id: string) => {
    setBoqItems(boqItems.filter((i) => i.id !== id));
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
  };

  const handleUpdateSpbjEndDate = (
    spbjId: string,
    newEndDate: string,
    newStatus?: SpbjContract['status']
  ) => {
    setSpbjContracts(
      spbjContracts.map((s) =>
        s.id === spbjId
          ? {
              ...s,
              contractEndDate: newEndDate,
              status: newStatus || s.status,
            }
          : s
      )
    );
  };

  const handleAddMandor = (newMandor: Mandor) => {
    setMandors([newMandor, ...mandors]);
  };

  const handleUpdateMandorLocation = (mandorId: string, newLocation: string) => {
    setMandors(
      mandors.map((m) => (m.id === mandorId ? { ...m, workLocation: newLocation } : m))
    );
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans flex">
      {/* Left Sidebar Menu */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        totalWorkersOnSite={totalWorkersOnSite}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
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
          {activeTab === 'dashboard' && (
            <DashboardView
              projects={projects}
              workers={workers}
              tasks={tasks}
              equipment={equipment}
              spbjList={spbjContracts}
              onSelectProject={handleSelectProject}
              onNavigateTab={setActiveTab}
              onOpenWorkerModal={(w) => setSelectedWorkerForModal(w)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              workers={workers}
              attendanceLog={attendanceLog}
              projects={projects}
              onOpenCheckIn={() => setShowCheckInModal(true)}
              onOpenWorkerModal={(w) => setSelectedWorkerForModal(w)}
            />
          )}

          {activeTab === 'spbj' && (
            <SpbjView
              spbjList={spbjContracts}
              projects={projects}
              onAddSpbj={handleAddSpbj}
              onUpdateSpbjEndDate={handleUpdateSpbjEndDate}
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

          {activeTab === 'monitoring-realisasi' && (
            <WorkRealizationView />
          )}

          {activeTab === 'monitoring-tagging' && (
            <LocationTaggingView />
          )}

          {activeTab === 'monitoring-timeline' && (
            <WorkTimelineView />
          )}

          {activeTab === 'monitoring-alat' && (
            <EquipmentMonitoringView />
          )}

          {activeTab === 'monitoring-apd' && (
            <PpeMonitoringView />
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

          {activeTab === 'logistics-labor' && (
            <LogisticsLaborCostView />
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

          {activeTab === 'ai-assistant' && (
            <AiAssistantView projects={projects} workers={workers} />
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

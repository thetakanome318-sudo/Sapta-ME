import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  SpbjContract, 
  BoqItem, 
  Mandor, 
  VehicleCompany, 
  VehicleLease, 
  EmergencyWork, 
  BopItem, 
  MaterialBongkarItem, 
  UserAccount,
  PlanItem,
  LocationTag 
} from '../types';
import { 
  INITIAL_SPBJ_CONTRACTS, 
  INITIAL_BOQ_ITEMS, 
  INITIAL_MANDORS, 
  INITIAL_VEHICLE_COMPANY, 
  INITIAL_VEHICLE_LEASE, 
  INITIAL_EMERGENCY_WORKS, 
  INITIAL_BOP_ITEMS, 
  INITIAL_MATERIAL_BONGKAR, 
  INITIAL_USERS 
} from '../data/mockData';

// Helper to sanitize Firestore document data (remove undefined)
function cleanData<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        result[key] = value.map(v => (typeof v === 'object' && v !== null ? cleanData(v) : v));
      } else if (typeof value === 'object' && value !== null) {
        result[key] = cleanData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// 1. SPBJ Contracts
export function subscribeSpbjContracts(callback: (data: SpbjContract[]) => void) {
  const path = 'spbjContracts';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        // Auto seed initial data if remote is empty
        try {
          const batch = writeBatch(db);
          INITIAL_SPBJ_CONTRACTS.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed SPBJ failed:', err);
        }
      } else {
        const items: SpbjContract[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as SpbjContract));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertSpbjContract(item: SpbjContract) {
  const path = 'spbjContracts';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

// 2. BOQ Items
export function subscribeBoqItems(callback: (data: BoqItem[]) => void) {
  const path = 'boqItems';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_BOQ_ITEMS.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed BOQ failed:', err);
        }
      } else {
        const items: BoqItem[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as BoqItem));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertBoqItem(item: BoqItem) {
  const path = 'boqItems';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

export async function deleteBoqItem(id: string) {
  const path = 'boqItems';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

// 3. Mandors
export function subscribeMandors(callback: (data: Mandor[]) => void) {
  const path = 'mandors';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_MANDORS.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed Mandor failed:', err);
        }
      } else {
        const items: Mandor[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as Mandor));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertMandor(item: Mandor) {
  const path = 'mandors';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

// 4. Company Vehicles
export function subscribeCompanyVehicles(callback: (data: VehicleCompany[]) => void) {
  const path = 'companyVehicles';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_VEHICLE_COMPANY.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed Company Vehicles failed:', err);
        }
      } else {
        const items: VehicleCompany[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as VehicleCompany));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertCompanyVehicle(item: VehicleCompany) {
  const path = 'companyVehicles';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

// 5. Leased Vehicles
export function subscribeLeaseVehicles(callback: (data: VehicleLease[]) => void) {
  const path = 'leaseVehicles';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_VEHICLE_LEASE.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed Lease Vehicles failed:', err);
        }
      } else {
        const items: VehicleLease[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as VehicleLease));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertLeaseVehicle(item: VehicleLease) {
  const path = 'leaseVehicles';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

// 6. Emergency Works
export function subscribeEmergencyWorks(callback: (data: EmergencyWork[]) => void) {
  const path = 'emergencyWorks';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_EMERGENCY_WORKS.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed Emergency Works failed:', err);
        }
      } else {
        const items: EmergencyWork[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as EmergencyWork));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertEmergencyWork(item: EmergencyWork) {
  const path = 'emergencyWorks';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

// 7. BOP Items
export function subscribeBopItems(callback: (data: BopItem[]) => void) {
  const path = 'bopItems';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_BOP_ITEMS.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed BOP failed:', err);
        }
      } else {
        const items: BopItem[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as BopItem));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertBopItem(item: BopItem) {
  const path = 'bopItems';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

// 8. Material Bongkar Items
export function subscribeMaterialBongkar(callback: (data: MaterialBongkarItem[]) => void) {
  const path = 'materialBongkar';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_MATERIAL_BONGKAR.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed Material Bongkar failed:', err);
        }
      } else {
        const items: MaterialBongkarItem[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as MaterialBongkarItem));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertMaterialBongkar(item: MaterialBongkarItem) {
  const path = 'materialBongkar';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

export async function deleteMaterialBongkar(id: string) {
  const path = 'materialBongkar';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

// 9. Users
export function subscribeUsers(callback: (data: UserAccount[]) => void) {
  const path = 'users';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_USERS.forEach((item) => {
            batch.set(doc(db, path, item.id), cleanData(item));
          });
          await batch.commit();
        } catch (err) {
          console.error('Seed Users failed:', err);
        }
      } else {
        const items: UserAccount[] = [];
        snapshot.forEach((docSnap) => items.push(docSnap.data() as UserAccount));
        callback(items);
      }
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertUser(item: UserAccount) {
  const path = 'users';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

export async function deleteUser(id: string) {
  const path = 'users';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

// 10. Plan Items
export function subscribePlanItems(callback: (data: PlanItem[]) => void) {
  const path = 'planItems';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: PlanItem[] = [];
      snapshot.forEach((docSnap) => items.push(docSnap.data() as PlanItem));
      callback(items);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertPlanItem(item: PlanItem) {
  const path = 'planItems';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

export async function deletePlanItem(id: string) {
  const path = 'planItems';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

// 11. Location Tags
export function subscribeLocationTags(callback: (data: LocationTag[]) => void) {
  const path = 'locationTags';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: LocationTag[] = [];
      snapshot.forEach((docSnap) => items.push(docSnap.data() as LocationTag));
      callback(items);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function upsertLocationTag(item: LocationTag) {
  const path = 'locationTags';
  try {
    await setDoc(doc(db, path, item.id), cleanData(item));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

export async function deleteLocationTag(id: string) {
  const path = 'locationTags';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

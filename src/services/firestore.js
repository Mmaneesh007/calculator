// src/services/firestore.js
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

const DASHBOARDS_COLLECTION = 'dashboards';

export const saveDashboard = async (userId, config) => {
  try {
    const dashboardData = {
      userId,
      name: config.name || 'Untitled Dashboard',
      data: config.data,
      columns: config.columns,
      activeTab: config.activeTab,
      filters: config.filters || {},
      daxHistory: config.daxHistory || [],
      xAxisCol: config.xAxisCol || '',
      yAxisCol: config.yAxisCol || '',
      chartType: config.chartType || 'bar',
      reportConfig: config.reportConfig || null,
      updatedAt: serverTimestamp(),
    };

    if (config.id) {
      const docRef = doc(db, DASHBOARDS_COLLECTION, config.id);
      await updateDoc(docRef, dashboardData);
      return config.id;
    } else {
      dashboardData.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, DASHBOARDS_COLLECTION), dashboardData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving dashboard:", error);
    throw error;
  }
};

export const getUserDashboards = async (userId) => {
  try {
    const q = query(
      collection(db, DASHBOARDS_COLLECTION), 
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    throw error;
  }
};

export const deleteDashboard = async (dashboardId) => {
  try {
    await deleteDoc(doc(db, DASHBOARDS_COLLECTION, dashboardId));
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    throw error;
  }
};

export const getDashboardById = async (dashboardId) => {
  try {
    const docRef = doc(db, DASHBOARDS_COLLECTION, dashboardId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting dashboard:", error);
    throw error;
  }
};

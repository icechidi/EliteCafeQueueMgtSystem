import { db } from './config';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { logError, logSuccess } from './logger';

export const testFirebaseConnection = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, limit(1));
    const snapshot = await getDocs(q);
    
    logSuccess('Firebase connection test successful', {
      connected: true,
      ordersExist: !snapshot.empty
    });
    
    return true;
  } catch (error) {
    logError(error, 'testFirebaseConnection');
    return false;
  }
}; 
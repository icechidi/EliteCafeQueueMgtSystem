import { db } from './config';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, limit(1));
    const snapshot = await getDocs(q);
    console.log('Firebase connection test:', {
      connected: true,
      hasOrders: !snapshot.empty,
      orderCount: snapshot.size
    });
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
}; 
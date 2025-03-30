import { db } from './config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { logSuccess, logError } from './logger';

export const verifyOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    
    // Check pending orders
    const pendingQuery = query(ordersRef, where('status', '==', 'pending'));
    const pendingSnapshot = await getDocs(pendingQuery);
    
    // Check preparing orders
    const preparingQuery = query(ordersRef, where('status', '==', 'preparing'));
    const preparingSnapshot = await getDocs(preparingQuery);
    
    // Check ready orders
    const readyQuery = query(ordersRef, where('status', '==', 'ready'));
    const readySnapshot = await getDocs(readyQuery);

    const verification = {
      pending: pendingSnapshot.size,
      preparing: preparingSnapshot.size,
      ready: readySnapshot.size,
      total: pendingSnapshot.size + preparingSnapshot.size + readySnapshot.size
    };

    logSuccess('Order verification complete', verification);
    return verification;
  } catch (error) {
    logError(error, 'verifyOrders');
    return null;
  }
}; 
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGCxK9NhVLTFqL_HEFPFTc0HHHNZWjqzk",
  authDomain: "icechidi-d00ab.firebaseapp.com",
  projectId: "icechidi-d00ab",
  storageBucket: "icechidi-d00ab.appspot.com",
  messagingSenderId: "547891234567",
  appId: "1:547891234567:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

//import { db } from './config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { Order } from '../types/menu';

const ordersRef = collection(db, 'orders');

export const orderService = {
  // Subscribe to orders by status
  subscribeToOrders(status: 'pending' | 'preparing' | 'ready', callback: (orders: Order[]) => void) {
    try {
      const q = query(
        ordersRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(q, {
        next: (snapshot) => {
          const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              items: data.items.map((item: any) => ({
                name: item.name,
                description: item.description || '',
                price: Number(item.price),
                quantity: Number(item.quantity),
                category: item.category || 'MAIN',
                image: item.image || '/placeholder.svg'
              })),
              totalAmount: Number(data.totalAmount),
              status: data.status,
              queueNumber: Number(data.queueNumber),
              orderDate: data.orderDate,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
              updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
            } as Order;
          });

          callback(orders);
        },
        error: (error) => {
          console.error('Error listening to orders:', error);
        }
      });
    } catch (error) {
      console.error('Error setting up orders subscription:', error);
      throw error;
    }
  },

  // Move order to next status
  async moveOrderToNextStatus(orderId: string, currentStatus: 'pending' | 'preparing' | 'ready') {
    try {
      const nextStatus = currentStatus === 'pending' ? 'preparing' : 'ready';
      const orderRef = doc(db, 'orders', orderId);
      
      await updateDoc(orderRef, {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });

      return { success: true, newStatus: nextStatus };
    } catch (error) {
      console.error('Error moving order to next status:', error);
      throw error;
    }
  },

  // Update order status directly
  async updateOrderStatus(orderId: string, newStatus: 'pending' | 'preparing' | 'ready') {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}; 
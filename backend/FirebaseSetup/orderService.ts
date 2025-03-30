import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  doc,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export const ordersCollection = collection(db, 'orders');

export const orderService = {
  // Create new order
  async createOrder(orderData: any) {
    try {
      const docRef = await addDoc(ordersCollection, {
        ...orderData,
        timestamp: Timestamp.now(),
        createdAt: Timestamp.now()
      });
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get all orders
  async getAllOrders() {
    try {
      const q = query(ordersCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  // Get orders by status
  async getOrdersByStatus(status: string) {
    try {
      const q = query(
        ordersCollection, 
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting orders by status:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
      return { id: orderId, status };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}; 
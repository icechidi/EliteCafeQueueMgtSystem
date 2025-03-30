import { db } from './config';
import { 
  collection, 
  addDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { logError, logSuccess } from './logger';

const ordersRef = collection(db, 'orders');

export interface OrderItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}

export interface OrderData {
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready';
  queueNumber: number;
  orderDate: string;
}

export const createOrder = async (orderData: OrderData) => {
  try {
    const orderWithMetadata = {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      orderStatus: 'new'
    };

    const docRef = await addDoc(ordersRef, orderWithMetadata);
    
    logSuccess('Order created successfully', { 
      orderId: docRef.id, 
      queueNumber: orderData.queueNumber 
    });

    return { 
      success: true, 
      orderId: docRef.id, 
      queueNumber: orderData.queueNumber 
    };
  } catch (error) {
    logError(error, 'createOrder');
    throw new Error('Failed to create order in Firebase');
  }
}; 
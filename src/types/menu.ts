export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'COFFEE' | 'PASTRY' | 'MAIN' | 'DESSERT' | 'SALAD';
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready';
  queueNumber: number;
  totalAmount: number;
  timestamp: any; // Firebase Timestamp
  createdAt: any; // Firebase Timestamp
  updatedAt?: any; // Firebase Timestamp
}

export interface OrderItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}
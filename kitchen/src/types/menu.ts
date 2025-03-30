export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface OrderItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready';
  queueNumber: number;
  orderDate: string;
  createdAt: Date;
  updatedAt: Date;
} 
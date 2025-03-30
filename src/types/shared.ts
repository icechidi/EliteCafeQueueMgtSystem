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
  id: number;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready';
  queueNumber: number;
  totalAmount: number;
  timestamp: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready'; 
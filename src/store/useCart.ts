import { create } from 'zustand';
import { toast } from 'sonner';
import type { CartItem, MenuItem } from '../types/menu';

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  submitOrder: () => Promise<void>;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  addItem: (item: MenuItem) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          total: state.total + item.price,
        };
      }
      return {
        items: [...state.items, { ...item, quantity: 1 }],
        total: state.total + item.price,
      };
    });
    toast.success(`Added ${item.name} to cart`);
  },

  removeItem: (itemId: number) => {
    set((state) => {
      const item = state.items.find((i) => i.id === itemId);
      if (!item) return state;
      return {
        items: state.items.filter((i) => i.id !== itemId),
        total: state.total - (item.price * item.quantity),
      };
    });
  },

  updateQuantity: (itemId: number, quantity: number) => {
    set((state) => {
      const item = state.items.find((i) => i.id === itemId);
      if (!item) return state;
      const oldTotal = item.price * item.quantity;
      const newTotal = item.price * quantity;
      return {
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        ),
        total: state.total - oldTotal + newTotal,
      };
    });
  },

  clearCart: () => set({ items: [], total: 0 }),

  submitOrder: async () => {
    const { items, total } = get();
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: total,
          status: 'pending',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const order = await response.json();
      toast.success(`Order #${order.queueNumber} submitted successfully!`);
      get().clearCart();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order');
    }
  }
}));
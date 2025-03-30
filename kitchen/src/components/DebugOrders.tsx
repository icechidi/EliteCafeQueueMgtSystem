import React from 'react';
import { Order } from '../types/menu';

interface DebugOrdersProps {
  orders: Order[];
  activeTab: string;
}

export const DebugOrders: React.FC<DebugOrdersProps> = ({ orders, activeTab }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md">
      <h3>Debug Info</h3>
      <p>Active Tab: {activeTab}</p>
      <p>Orders Count: {orders.length}</p>
      <pre className="text-xs mt-2">
        {JSON.stringify(orders, null, 2)}
      </pre>
    </div>
  );
}; 
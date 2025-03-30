import React, { useState, useEffect } from 'react';
import { Order } from '../types/menu';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Bell, Clock } from 'lucide-react';
import { orderService } from '../firebase/orderService';

const Kitchen = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready'>('pending');

  // Subscribe to all order statuses
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    const setupSubscriptions = async () => {
      try {
        // Subscribe to pending orders
        const pendingUnsubscribe = orderService.subscribeToOrders('pending', (orders) => {
          setPendingOrders(orders);
          // Show notification for new pending orders
          if (orders.length > pendingOrders.length) {
            toast.success('New order received!', {
              description: `Order #${orders[0].queueNumber} has been added to pending`
            });
          }
        });
        unsubscribers.push(pendingUnsubscribe);

        // Subscribe to preparing orders
        const preparingUnsubscribe = orderService.subscribeToOrders('preparing', (orders) => {
          setPreparingOrders(orders);
        });
        unsubscribers.push(preparingUnsubscribe);

        // Subscribe to ready orders
        const readyUnsubscribe = orderService.subscribeToOrders('ready', (orders) => {
          setReadyOrders(orders);
        });
        unsubscribers.push(readyUnsubscribe);

      } catch (error) {
        console.error('Error setting up subscriptions:', error);
        setError('Failed to load orders');
      }
    };

    setupSubscriptions();

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [pendingOrders.length]); // Add dependency to track new orders

  const getTimeDifference = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Handle moving order to next status
  const moveOrderToNextStatus = async (orderId: string, currentStatus: 'pending' | 'preparing' | 'ready') => {
    try {
      await orderService.moveOrderToNextStatus(orderId, currentStatus);
      const nextStatus = currentStatus === 'pending' ? 'preparing' : 'ready';
      toast.success(`Order moved to ${nextStatus}`);
    } catch (error) {
      console.error('Error moving order:', error);
      toast.error('Failed to move order');
    }
  };

  const renderOrders = (orders: Order[]) => {
    return orders.map((order) => (
      <Card key={order.id} className="p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1">Order #{order.queueNumber}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{new Date(order.orderDate).toLocaleString()}</span>
                <span>•</span>
                <span>{getTimeDifference(order.createdAt)}</span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {item.quantity}
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₺{(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">₺{item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₺{order.totalAmount.toFixed(2)}</span>
            </div>

            {order.status === 'pending' && (
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => moveOrderToNextStatus(order.id, 'pending')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Start Preparing
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => moveOrderToNextStatus(order.id, 'preparing')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Ready
              </Button>
            )}
          </div>
        </div>
      </Card>
    ));
  };

  const getCurrentOrders = () => {
    switch (activeTab) {
      case 'pending':
        return pendingOrders;
      case 'preparing':
        return preparingOrders;
      case 'ready':
        return readyOrders;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kitchen Orders</h1>
            <p className="text-gray-500">Manage and track all incoming orders</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={activeTab === 'pending' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pending')}
              className={activeTab === 'pending' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Pending Orders
              {pendingOrders.length > 0 && (
                <span className="ml-2 bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {pendingOrders.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'preparing' ? 'default' : 'outline'}
              onClick={() => setActiveTab('preparing')}
              className={activeTab === 'preparing' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Preparing
              {preparingOrders.length > 0 && (
                <span className="ml-2 bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {preparingOrders.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'ready' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ready')}
              className={activeTab === 'ready' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Ready
              {readyOrders.length > 0 && (
                <span className="ml-2 bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {readyOrders.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 mb-4 text-center p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {renderOrders(getCurrentOrders())}
        </div>

        {getCurrentOrders().length === 0 && (
          <div className="text-center bg-white rounded-xl shadow-md p-12 mt-8">
            <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-2xl font-semibold text-gray-600">No {activeTab} orders</p>
            <p className="text-gray-500 mt-2">New orders will appear here automatically</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kitchen; 
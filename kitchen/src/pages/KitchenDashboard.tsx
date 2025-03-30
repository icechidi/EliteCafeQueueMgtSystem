import React, { useState, useEffect } from 'react';
import { Order } from '../types/menu';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  Bell, 
  Clock, 
  BarChart3, 
  DollarSign, 
  ShoppingBag,
  Users 
} from 'lucide-react';
import { orderService } from '../firebase/orderService';

const KitchenDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready'>('pending');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingCount: 0,
    preparingCount: 0,
    readyCount: 0
  });

  // Subscribe to all order statuses
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    const setupSubscriptions = async () => {
      try {
        // Subscribe to pending orders
        const pendingUnsubscribe = orderService.subscribeToOrders('pending', (orders) => {
          setPendingOrders(orders);
          updateStats('pending', orders);
        });
        unsubscribers.push(pendingUnsubscribe);

        // Subscribe to preparing orders
        const preparingUnsubscribe = orderService.subscribeToOrders('preparing', (orders) => {
          setPreparingOrders(orders);
          updateStats('preparing', orders);
        });
        unsubscribers.push(preparingUnsubscribe);

        // Subscribe to ready orders
        const readyUnsubscribe = orderService.subscribeToOrders('ready', (orders) => {
          setReadyOrders(orders);
          updateStats('ready', orders);
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
  }, []);

  const updateStats = (status: string, orders: Order[]) => {
    setStats(prevStats => {
      const allOrders = [...pendingOrders, ...preparingOrders, ...readyOrders, ...orders];
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      return {
        totalOrders: allOrders.length,
        totalRevenue,
        averageOrderValue: totalRevenue / (allOrders.length || 1),
        pendingCount: status === 'pending' ? orders.length : prevStats.pendingCount,
        preparingCount: status === 'preparing' ? orders.length : prevStats.preparingCount,
        readyCount: status === 'ready' ? orders.length : prevStats.readyCount
      };
    });
  };

  // Dashboard Stats Cards
  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );

  // Rest of your existing functions...
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Kitchen Dashboard</h1>
          <p className="text-gray-500">Manage orders and track kitchen performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Revenue"
            value={`₺${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatCard
            title="Average Order Value"
            value={`₺${stats.averageOrderValue.toFixed(2)}`}
            icon={BarChart3}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Orders"
            value={stats.pendingCount + stats.preparingCount}
            icon={Users}
            color="bg-orange-500"
          />
        </div>

        {/* Order Status Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex gap-4 border-b pb-4">
            <Button
              variant={activeTab === 'pending' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pending')}
              className={activeTab === 'pending' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Pending ({stats.pendingCount})
            </Button>
            <Button
              variant={activeTab === 'preparing' ? 'default' : 'outline'}
              onClick={() => setActiveTab('preparing')}
              className={activeTab === 'preparing' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Preparing ({stats.preparingCount})
            </Button>
            <Button
              variant={activeTab === 'ready' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ready')}
              className={activeTab === 'ready' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Ready ({stats.readyCount})
            </Button>
          </div>

          {/* Orders List */}
          <div className="mt-6 space-y-6">
            {activeTab === 'pending' && pendingOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={() => moveOrderToNextStatus(order.id, 'pending')}
                buttonText="Start Preparing"
                buttonIcon={Bell}
              />
            ))}
            {activeTab === 'preparing' && preparingOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onStatusChange={() => moveOrderToNextStatus(order.id, 'preparing')}
                buttonText="Mark as Ready"
                buttonIcon={CheckCircle}
              />
            ))}
            {activeTab === 'ready' && readyOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                showActionButton={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order, onStatusChange, buttonText, buttonIcon: Icon, showActionButton = true }: any) => (
  <Card className="p-6 hover:shadow-md transition-shadow">
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">Order #{order.queueNumber}</h3>
          <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        {order.items.map((item: any, index: number) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                {item.quantity}
              </span>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
            <p className="font-medium">₺{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-xl font-bold">₺{order.totalAmount.toFixed(2)}</span>
        </div>

        {showActionButton && (
          <Button 
            className="w-full"
            onClick={onStatusChange}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export default KitchenDashboard; 
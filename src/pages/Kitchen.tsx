import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Order } from '../types/menu';

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      queueNumber: 42,
      status: 'pending',
      items: [
        {
          id: 1,
          name: "Classic Burger",
          description: "Juicy beef patty with fresh lettuce and tomatoes",
          price: 5.99,
          category: "Main Course",
          image: "/placeholder.svg",
          quantity: 2
        }
      ],
      totalAmount: 11.98,
      timestamp: new Date().toISOString()
    },
    {
      id: 12,
      queueNumber: 49,
      status: 'pending',
      items: [
        {
          id: 12,
          name: "Pepsi",
          description: "Soft drink, soda",
          price: 20.99,
          category: "DRINKS",
          image: "/pepsi.jpg"
        }
      ],
      totalAmount: 11.98,
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      queueNumber: 44,
      status: 'pending',
      items: [
        {
          id: 2,
          name: "Classic Burger",
          description: "Juicy beef patty with fresh lettuce and tomatoes",
          price: 5.99,
          category: "Main Course",
          image: "/placeholder.svg",
          quantity: 2
        }
      ],
      totalAmount: 11.98,
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      queueNumber: 45,
      status: 'pending',
      items: [
        {
          id: 3,
          name: "Classic Burger",
          description: "Juicy beef patty with fresh lettuce and tomatoes",
          price: 5.99,
          category: "Main Course",
          image: "/placeholder.svg",
          quantity: 2
        }
      ],
      totalAmount: 11.98,
      timestamp: new Date().toISOString()
    },
    {
      id: 4,
      queueNumber: 48,
      status: 'pending',
      items: [
        {
          id: 4,
          name: "Classic Burger",
          description: "Juicy beef patty with fresh lettuce and tomatoes",
          price: 5.99,
          category: "Main Course",
          image: "/placeholder.svg",
          quantity: 2
        }
      ],
      totalAmount: 11.98,
      timestamp: new Date().toISOString()
    },
    {
      id: 5,
      queueNumber: 49,
      status: 'pending',
      items: [
        {
          id: 5,
          name: "Classic Burger",
          description: "Juicy beef patty with fresh lettuce and tomatoes",
          price: 5.99,
          category: "Main Course",
          image: "/placeholder.svg",
          quantity: 2
        }
      ],
      totalAmount: 11.98,
      timestamp: new Date().toISOString()
    },

    
    {
      id: 10,
      queueNumber: 49,
      status: 'pending',
      items: [
        {
          id: 10,
          name: "Pepsi",
          description: "Soft drink, soda",
          price: 20.99,
          category: "DRINKS",
          image: "/pepsi.jpg"
        }
      ],
      totalAmount: 11.98,
      timestamp: new Date().toISOString()
    },

    


    
  ]);

  const updateOrderStatus = (orderId: number, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const formatPrice = (price: number) => {
    return `₺${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            
            <h2 className="text-2xl font-bold ml-4">Kitchen Orders</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">Order #{order.queueNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'ready' ? 'bg-green-100 text-green-800' :
                  order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-bold">Total: {formatPrice(order.totalAmount)}</span>
                {order.status === 'pending' && (
                  <Button onClick={() => updateOrderStatus(order.id, 'preparing')}>
                    Start Preparing
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button onClick={() => updateOrderStatus(order.id, 'ready')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Ready
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;
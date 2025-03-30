import { useState } from 'react';
import { useCart } from '../store/useCart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const Cart = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty!",
        variant: "destructive"
      });
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // Format items for Firestore
      const formattedItems = items.map(item => ({
        name: item.name,
        description: item.description || "",
        price: Number(item.price),
        quantity: item.quantity,
        category: item.category || "MAIN",
        image: item.image || "/placeholder.svg"
      }));

      // Generate queue number
      const queueNumber = Math.floor(Math.random() * 900) + 100;

      // Create order data
      const orderData = {
        items: formattedItems,
        totalAmount: Number(total.toFixed(2)),
        status: "pending",
        queueNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        orderDate: new Date().toISOString()
      };

      // Save to Firestore
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, orderData);

      console.log('Order created with ID:', docRef.id);

      // Show success toast with confetti
      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Your order #${queueNumber} has been sent to the kitchen. Please wait for preparation.`,
        duration: 5000
      });

      // Clear cart and redirect
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="mb-8">Add some delicious items to your cart!</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Your Cart</h1>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">₺{item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl font-bold">₺{total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white"
            size="lg"
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <span className="mr-2">Processing Order</span>
                <span className="animate-spin">⏳</span>
              </span>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
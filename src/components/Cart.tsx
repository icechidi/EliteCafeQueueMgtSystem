import { useCart } from '../store/useCart';
import { Button } from './ui/button';

export const Cart = () => {
  const { items, total, removeItem, updateQuantity, submitOrder } = useCart();

  const handleSubmitOrder = async () => {
    await submitOrder();
  };

  return (
    <div className="p-4">
      {/* ... existing cart items display ... */}
      
      <div className="mt-4 space-y-4">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>₺{total.toFixed(2)}</span>
        </div>
        
        <Button 
          onClick={handleSubmitOrder}
          className="w-full"
          disabled={items.length === 0}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}; 
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../store/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchMenuItems } from '../services/api';
import { categories } from '../data/menuItems';
import { MenuItem } from '../types/menu';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const { items, addItem } = useCart();
  const { toast } = useToast();

  const { data: menuItems = [], isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems,
  });

  const filteredItems = menuItems.filter((item: MenuItem) => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return `₺${price.toFixed(2)}`;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading menu items...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Error loading menu items</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary p-4 text-primary-foreground">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold">ELIT CAFE</h1>
          <Link to="/cart" className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Cart ({items.length})</span>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {categories.map((category: string) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: MenuItem) => (
            <Card key={item.id} className="overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">{formatPrice(item.price)}</span>
                  <Button onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
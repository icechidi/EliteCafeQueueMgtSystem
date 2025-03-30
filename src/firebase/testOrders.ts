import { createOrder } from './orderService';
import { logSuccess, logError } from './logger';

export const testOrders = async () => {
  try {
    // Small order (1 item)
    const smallOrder = {
      items: [{
        name: "Espresso",
        description: "Single shot",
        price: 3.50,
        quantity: 1,
        category: "COFFEE",
        image: "/espresso.jpg"
      }],
      totalAmount: 3.50,
      status: "pending" as const,
      queueNumber: 101,
      orderDate: new Date().toISOString()
    };

    // Medium order (3 items)
    const mediumOrder = {
      items: [
        {
          name: "Latte",
          description: "Large",
          price: 4.50,
          quantity: 2,
          category: "COFFEE",
          image: "/latte.jpg"
        },
        {
          name: "Croissant",
          description: "Butter",
          price: 2.50,
          quantity: 1,
          category: "PASTRY",
          image: "/croissant.jpg"
        }
      ],
      totalAmount: 11.50,
      status: "pending" as const,
      queueNumber: 102,
      orderDate: new Date().toISOString()
    };

    // Large order (5+ items)
    const largeOrder = {
      items: [
        {
          name: "Cappuccino",
          description: "Regular",
          price: 4.00,
          quantity: 3,
          category: "COFFEE",
          image: "/cappuccino.jpg"
        },
        {
          name: "Sandwich",
          description: "Chicken",
          price: 6.50,
          quantity: 2,
          category: "MAIN",
          image: "/sandwich.jpg"
        },
        {
          name: "Cake",
          description: "Chocolate",
          price: 5.00,
          quantity: 1,
          category: "DESSERT",
          image: "/cake.jpg"
        }
      ],
      totalAmount: 28.50,
      status: "pending" as const,
      queueNumber: 103,
      orderDate: new Date().toISOString()
    };

    // Test all orders
    const results = await Promise.all([
      createOrder(smallOrder),
      createOrder(mediumOrder),
      createOrder(largeOrder)
    ]);

    logSuccess('Test orders created successfully', results);
    return true;
  } catch (error) {
    logError(error, 'testOrders');
    return false;
  }
}; 
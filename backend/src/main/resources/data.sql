-- Add menu items
INSERT INTO menu_item (name, description, price, category, image) VALUES
-- Coffee
('Espresso', 'Rich and bold single shot espresso', 2.50, 'COFFEE', '/images/espresso.jpg'),
('Latte', 'Smooth espresso with steamed milk', 3.50, 'COFFEE', '/images/latte.jpg'),
('Cappuccino', 'Perfect balance of espresso, steamed milk, and foam', 3.50, 'COFFEE', '/images/cappuccino.jpg'),
('Mocha', 'Espresso with chocolate and steamed milk', 4.00, 'COFFEE', '/images/mocha.jpg'),

-- Pastries
('Croissant', 'Buttery, flaky French pastry', 2.00, 'PASTRY', '/images/croissant.jpg'),
('Pain au Chocolat', 'Chocolate-filled croissant', 2.50, 'PASTRY', '/images/pain-au-chocolat.jpg'),
('Cinnamon Roll', 'Fresh-baked with cream cheese frosting', 3.00, 'PASTRY', '/images/cinnamon-roll.jpg'),

-- Main Dishes
('Chicken Sandwich', 'Grilled chicken with lettuce and mayo', 8.50, 'MAIN', '/images/chicken-sandwich.jpg'),
('Caesar Salad', 'Fresh romaine with parmesan and croutons', 7.50, 'MAIN', '/images/caesar-salad.jpg'),
('Quiche Lorraine', 'Classic French quiche with bacon and cheese', 6.50, 'MAIN', '/images/quiche.jpg'),

-- Desserts
('Chocolate Cake', 'Rich chocolate layer cake', 4.50, 'DESSERT', '/images/chocolate-cake.jpg'),
('Tiramisu', 'Classic Italian coffee-flavored dessert', 5.00, 'DESSERT', '/images/tiramisu.jpg')

ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    price = VALUES(price),
    category = VALUES(category),
    image = VALUES(image); 
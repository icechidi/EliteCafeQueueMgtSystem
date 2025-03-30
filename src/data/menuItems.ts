import { MenuItem } from "../types/menu";
import { mainCourseItems } from "./mainCourseItems";
import { dessertItems } from "./dessertItems";
import { saladItems } from "./saladItems";
import { drinkItems } from "./drinkItems";

export const menuItems: MenuItem[] = [
  ...mainCourseItems,
  ...dessertItems,
  ...saladItems,
  ...drinkItems,
  {
    id: 6,
    name: "French Fries",
    description: "Crispy golden fries with sea salt",
    price: 89.99,
    category: "MAIN",
    image: "/fries1.jpg"
  }
];

export const categories = [...new Set(menuItems.map(item => item.category))];
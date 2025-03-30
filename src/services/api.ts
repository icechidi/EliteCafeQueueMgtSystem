import { MenuItem } from '../types/menu';
import { menuItems } from '../data/menuItems';

// Simulating an API call with the local data
export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return menuItems;
};
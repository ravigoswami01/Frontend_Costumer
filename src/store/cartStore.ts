import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, MenuItem, CartItem } from '../types';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      addItem: (item: MenuItem) => {
        set((state) => {
          const existingItem = state.items.find(i => i._id === item._id);
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter(item => item._id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item._id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

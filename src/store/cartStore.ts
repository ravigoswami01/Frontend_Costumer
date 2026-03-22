import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../Api/ApiBas";
import {
  ADD_TO_CART,
  GET_CART,
  UPDATE_QTY,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../Api/API_EndPowint";

interface CartItem {
  menuItemId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  loading: boolean;
  cartCount: number;
  cartTotal: number;
  fetchCart: () => Promise<void>;
  addToCart: (item: any) => Promise<void>;
  updateQty: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeCart: () => Promise<void>;
  clearLocalCart: () => void;
}

const isLoggedIn = () => !!localStorage.getItem("authToken");

const normalizeCart = (items: any[] = []): CartItem[] => {
  return items
    .map((item) => {
      const id =
        item.menuItem?._id?.toString() ||
        item.menuItemId?.toString();

      if (!id) return null;

      return {
        menuItemId: id,
        name: item.name || item.menuItem?.name || "Item",
        description: item.description || item.menuItem?.description,
        price: item.price || item.menuItem?.price || 0,
        image: item.menuItem?.imageUrl || item.image,
        quantity: item.quantity || 0,
      };
    })
    .filter(Boolean) as CartItem[];
};

const compute = (cart: CartItem[]) => ({
  cartCount: cart.reduce((a, b) => a + b.quantity, 0),
  cartTotal: cart.reduce((a, b) => a + b.price * b.quantity, 0),
});

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      cartCount: 0,
      cartTotal: 0,

      fetchCart: async () => {
        if (!isLoggedIn()) return;
        try {
          set({ loading: true });
          const res = await apiClient.get(GET_CART);
          const cart = normalizeCart(res?.data?.cart?.items || []);
          set({ cart, ...compute(cart), loading: false });
        } catch {
          set({ loading: false });
        }
      },

      addToCart: async (item) => {
        const id = item?._id?.toString();
        if (!id) return;

        const prev = get().cart;
        const exist = prev.find((i) => i.menuItemId === id);

        const updated = exist
          ? prev.map((i) =>
              i.menuItemId === id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          : [
              ...prev,
              {
                menuItemId: id,
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.imageUrl || item.image,
                quantity: 1,
              },
            ];

        set({ cart: updated, ...compute(updated) });

        if (!isLoggedIn()) return;

        try {
          await apiClient.post(ADD_TO_CART, {
            menuItemId: id,
            quantity: 1,
          });
          await get().fetchCart();
        } catch {
          set({ cart: prev, ...compute(prev) });
        }
      },

      updateQty: async (id, quantity) => {
        if (!id) return;

        if (quantity <= 0) {
          return get().removeFromCart(id);
        }

        const prev = get().cart;

        const updated = prev.map((i) =>
          i.menuItemId === id ? { ...i, quantity } : i
        );

        set({ cart: updated, ...compute(updated) });

        if (!isLoggedIn()) return;

        try {
          await apiClient.put(UPDATE_QTY, {
            menuItemId: id,
            quantity,
          });
          await get().fetchCart();
        } catch {
          set({ cart: prev, ...compute(prev) });
        }
      },

      removeFromCart: async (id) => {
        if (!id) return;

        const prev = get().cart;
        const updated = prev.filter((i) => i.menuItemId !== id);

        set({ cart: updated, ...compute(updated) });

        if (!isLoggedIn()) return;

        try {
          await apiClient.delete(REMOVE_FROM_CART, {
            data: { menuItemId: id },
          });
          await get().fetchCart();
        } catch {
          set({ cart: prev, ...compute(prev) });
        }
      },

      clearCart: async () => {
        const prev = get().cart;
        set({ cart: [], cartCount: 0, cartTotal: 0 });

        if (!isLoggedIn()) return;

        try {
          await apiClient.delete(CLEAR_CART);
        } catch {
          set({ cart: prev, ...compute(prev) });
        }
      },

      mergeCart: async () => {
        if (!isLoggedIn()) return;

        const guestCart = get().cart;

        try {
          for (const item of guestCart) {
            await apiClient.post(ADD_TO_CART, {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
            });
          }
          await get().fetchCart();
        } catch {}
      },

      clearLocalCart: () => {
        set({ cart: [], cartCount: 0, cartTotal: 0 });
      },
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const d = compute(state.cart);
          state.cartCount = d.cartCount;
          state.cartTotal = d.cartTotal;
        }
      },
    }
  )
);
import { create } from "zustand";
import apiClient from "../Api/ApiBas";
import { GET_MENU_ITEM } from "@/Api/API_EndPowint";
import { MenuItem } from "../types";
import { AxiosResponse } from "axios";

interface MenuState {
  menuItems: MenuItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuItems: [],
  categories: [],
  loading: false,
  error: null,
  fetchMenu: async () => {
    set({ loading: true, error: null });
    try {
      const res: AxiosResponse<{items: MenuItem[], pagination: any}> = await apiClient.get(GET_MENU_ITEM);
      const items: MenuItem[] = res.data.items;
      console.log("Fetched menu items:", items);
      const uniqueCategories = [
        "All",
        ...Array.from(new Set(items.map((item) => item.category))),
      ];
      set({ menuItems: items, categories: uniqueCategories, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message ?? "Failed to load menu",
      });
    }
  },
}));
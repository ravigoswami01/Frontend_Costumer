import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../Api/ApiBas";
import { AuthState, UserRole } from "../types";
import { LOGIN, REGISTER } from "@/Api/API_EndPowint";
import { useCartStore } from "./cartStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await apiClient.post(LOGIN, { email, password });
          const data = response.data;

          if (!data?.user || !data?.token) {
            throw new Error("Invalid login response");
          }

          localStorage.setItem("authToken", data.token);
          set({ user: data.user, isAuthenticated: true });

          try {
            const { mergeCart, clearLocalCart } = useCartStore.getState();
            await mergeCart();
            clearLocalCart();
          } catch {
            // cart merge is non-critical, don't fail login
          }
        } catch (error) {
          console.error("Login Error:", error);
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await apiClient.post(REGISTER, {
            name,
            email,
            password,
            role: "customer",
          });
          const data = response.data;

          if (!data?.user || !data?.token) {
            throw new Error("Invalid register response");
          }

          localStorage.setItem("authToken", data.token);
          set({ user: data.user, isAuthenticated: true });
        } catch (error) {
          console.error("Register Error:", error);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("authToken");
        set({ user: null, isAuthenticated: false });
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        if (!user) return false;

        const roleHierarchy: Record<UserRole, number> = {
          customer: 0,
          staff: 1,
          owner: 2,
          admin: 3,
        };

        return roleHierarchy[user.role] >= roleHierarchy[role];
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
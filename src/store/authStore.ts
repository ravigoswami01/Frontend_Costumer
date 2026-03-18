import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../Api/ApiBas";
import { AuthState, UserRole } from "../types";
import { LOGIN, REGISTER } from "@/Api/API_EndPowint";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await apiClient.post(LOGIN, {
            email,
            password,
          });

          const data = response.data; 

          console.log("LOGIN RESPONSE:", data); 

          if (data?.user && data?.token) {
            set({
              user: data.user,
              isAuthenticated: true,
            });

            // ✅ Save tokens
            localStorage.setItem("authToken", data.token);

            if (data.refreshToken) {
              localStorage.setItem("refreshToken", data.refreshToken);
            }
          } else {
            set({ isAuthenticated: false });
            throw new Error("Invalid login response");
          }
        } catch (error) {
          console.error("Login Error:", error);
          set({ isAuthenticated: false });
          throw error;
        }
      },

      // 📝 REGISTER
      register: async (name: string, email: string, password: string) => {
        try {
          const response = await apiClient.post(REGISTER, {
            name,
            email,
            password,
            role: "customer",
          });

          const data = response.data;  

          console.log("REGISTER RESPONSE:", data);  

          if (data?.user && data?.token) {
            set({
              user: data.user,
              isAuthenticated: true,
            });

            localStorage.setItem("authToken", data.token);
          } else {
            throw new Error("Invalid register response");
          }
        } catch (error) {
          console.error("Register Error:", error);
          set({ isAuthenticated: false });
          throw error;
        }
      },

      // 🚪 LOGOUT
      logout: () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        set({
          user: null,
          isAuthenticated: false,
        });
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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
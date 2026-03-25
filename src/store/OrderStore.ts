import { create } from "zustand";
import ApiClient from "../Api/ApiBas";
import { AxiosError } from "axios";

import {
  GET_ORDERS,
  GET_ORDER_BY_ID,
  UPDATE_ORDER_STATUS,
  CREATE_ORDER,
  CANCEL_ORDER,
  PLACE_ORDER,
} from "../Api/API_EndPowint";

import {
  Order,
  OrderStatus,
  OrderFilters,
  Pagination,
  OrderStats,
  CreateOrderPayload,
} from "../types/orderTypes";

interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

interface StatsResponse {
  stats: { _id: OrderStatus; count: number; totalRevenue: number }[];
  todayOrders: number;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  pagination: Pagination | null;
  stats: OrderStats | null;

  loading: boolean;
  detailLoading: boolean;
  statsLoading: boolean;
  createLoading: boolean;

  error: string | null;

  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => Promise<void>;
  fetchOrderStats: () => Promise<void>;
  createOrder: (payload: CreateOrderPayload) => Promise<Order | null>;
  cancelOrder: (id: string) => Promise<void>;

  clearCurrentOrder: () => void;
  clearError: () => void;
}

const getErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<{ error: string; message: string }>;
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    "Something went wrong"
  );
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  pagination: null,
  stats: null,

  loading: false,
  detailLoading: false,
  statsLoading: false,
  createLoading: false,

  error: null,

  fetchOrders: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.orderType) params.append("orderType", filters.orderType);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));

      const { data } = await ApiClient.get<OrdersResponse>(
        `${GET_ORDERS}?${params.toString()}`
      );
      set({ orders: data.orders, pagination: data.pagination });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ detailLoading: true, error: null });
    try {
      const { data } = await ApiClient.get<Order>(`${GET_ORDER_BY_ID}/${id}`);
      set({ currentOrder: data });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ detailLoading: false });
    }
  },

  updateOrderStatus: async (id, status, note) => {
    try {
      const { data } = await ApiClient.patch<Order>(
        `${UPDATE_ORDER_STATUS}/${id}/status`,
        { status, note }
      );
      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? data : o)),
        currentOrder:
          state.currentOrder?._id === id ? data : state.currentOrder,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },

  fetchOrderStats: async () => {
    set({ statsLoading: true, error: null });
    try {
      const { data } = await ApiClient.get<StatsResponse>(
        PLACE_ORDER + "/stats"
      );
      set({ stats: { stats: data.stats, todayOrders: data.todayOrders } });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ statsLoading: false });
    }
  },

  createOrder: async (payload) => {
    set({ createLoading: true, error: null });
    try {
      // Backend sends the order directly — not wrapped in { order: ... }
      const { data } = await ApiClient.post<Order>(CREATE_ORDER, payload);

      set((state) => ({
        orders: [data, ...state.orders],
        currentOrder: data,
      }));

      return data;
    } catch (error) {
      set({ error: getErrorMessage(error) });
      return null;
    } finally {
      set({ createLoading: false });
    }
  },

  cancelOrder: async (id) => {
    try {
      await ApiClient.patch(`${CANCEL_ORDER}/${id}`);
      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === id ? { ...o, status: "cancelled" } : o
        ),
        currentOrder:
          state.currentOrder?._id === id
            ? { ...state.currentOrder, status: "cancelled" }
            : state.currentOrder,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null }),
  clearError: () => set({ error: null }),
}));
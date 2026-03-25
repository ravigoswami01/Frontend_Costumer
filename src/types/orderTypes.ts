/* ================= ENUM TYPES ================= */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "delivered"
  | "completed"
  | "cancelled";

export type OrderType = "delivery" | "dine-in";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

/* ================= CORE TYPES ================= */

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  instructions?: string;
}

/* ================= POPULATED TYPES ================= */

export interface PopulatedRestaurant {
  _id: string;
  name: string;
}

export interface PopulatedCustomer {
  _id: string;
  name: string;
  email: string;
}

/* ================= STATUS HISTORY ================= */

export interface StatusHistoryEntry {
  status: OrderStatus;
  updatedBy: {
    _id: string;
    name: string;
    role: string;
  } | null;
  timestamp: string;
  note?: string;
}

/* ================= MAIN ORDER ================= */

export interface Order {
  _id: string;
  orderNumber: string;

  restaurantId: PopulatedRestaurant;
  customerId: PopulatedCustomer;

  orderType: OrderType;

  items: OrderItem[];

  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  deliveryAddress?: DeliveryAddress;
  tableNumber?: string;

  statusHistory: StatusHistoryEntry[];

  createdAt: string;
  updatedAt: string;
}

/* ================= PAGINATION ================= */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/* ================= FILTERS ================= */

export interface OrderFilters {
  status?: OrderStatus;
  orderType?: OrderType;
  page?: number;
  limit?: number;
}

/* ================= STATS ================= */

export interface OrderStatItem {
  _id: OrderStatus;
  count: number;
  totalRevenue: number;
}

export interface OrderStats {
  stats: OrderStatItem[];
  todayOrders: number;
}

/* ================= PAYLOAD ================= */

export interface CreateOrderPayload {
  restaurantId: string;
  orderType: OrderType;

  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];

  deliveryAddress?: DeliveryAddress;
  tableNumber?: string;

  paymentMethod?: string;
}

/* ================= API RESPONSES ================= */

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface OrderResponse {
  order: Order;
}

export interface StatsResponse {
  stats: OrderStatItem[];
  todayOrders: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  instructions?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  updatedBy: { _id: string; name: string; role: string } | null;
  timestamp: string;
  note?: string;
}

export interface PopulatedRestaurant {
  _id: string;
  name: string;
}

export interface PopulatedCustomer {
  _id: string;
  name: string;
  email: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  restaurantId: PopulatedRestaurant;
  customerId: PopulatedCustomer;
  orderType: OrderType;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress?: DeliveryAddress;
  tableNumber?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  restaurantId: string;
  orderType: OrderType;
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
  tableNumber?: string;
  deliveryAddress?: DeliveryAddress;
}
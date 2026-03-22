export type UserRole = "admin" | "customer" | "staff" | "owner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

export interface Rating {
  average: number;
  count: number;
}

export interface RestaurantRef {
  _id: string;
  name: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  imagePublicId: string;
  category: string;
  rating: Rating;
  calories?: number;
  discount?: number;
  isPopular?: boolean;
  isAvailable: boolean;
  isActive: boolean;
  tags?: string[];
  restaurantId: RestaurantRef;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  menuItemId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
}

export interface CartState {
  cart: CartItem[];
  loading: boolean;
  getCartCount: () => number;
  getCartTotal: () => number;
  fetchCart: () => Promise<void>;
  addToCart: (item: MenuItem) => Promise<void>;
  updateQty: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeCart: () => Promise<void>;
  clearLocalCart: () => void;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
}

export interface Booking {
  id: string;
  userId: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface Review {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}
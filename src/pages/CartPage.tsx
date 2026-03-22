import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;
const FREE_DELIVERY_THRESHOLD = 500;

const EmptyCart = ({ onBrowse }: { onBrowse: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="min-h-screen bg-[#FAFAF8] pt-24 pb-20 flex items-center"
  >
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-28 h-28 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ShoppingBag className="w-14 h-14 text-orange-300" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
          Nothing here yet
        </h2>
        <p className="text-gray-400 mb-10 text-sm leading-relaxed">
          Your cart is empty. Head over to the menu and pick something delicious.
        </p>
        <button
          onClick={onBrowse}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-gray-800 active:scale-95 transition-all duration-150 shadow-lg shadow-gray-900/10"
        >
          Browse Menu
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

export const CartPage = () => {
  const cart           = useCartStore((s) => s.cart);
  const cartTotal      = useCartStore((s) => s.cartTotal);
  const cartCount      = useCartStore((s) => s.cartCount);
  const loading        = useCartStore((s) => s.loading);
  const fetchCart      = useCartStore((s) => s.fetchCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQty      = useCartStore((s) => s.updateQty);
  const clearCart      = useCartStore((s) => s.clearCart);

  const navigate = useNavigate();

  useEffect(() => {
  fetchCart();
}, [fetchCart]);

  const subtotal             = cartTotal;
  const tax                  = subtotal * TAX_RATE;
  const deliveryFee          = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total                = subtotal + deliveryFee + tax;
  const remainingForFree     = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  if (cart.length === 0) {
    return <EmptyCart onBrowse={() => navigate("/menu")} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-8 pb-6 border-b border-gray-200 mb-8"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-1">
                Your Order
              </p>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={clearCart}
              disabled={loading}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors duration-150 pb-1 disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {cart.map((item, index) => (
                <motion.div
                  key={item.menuItemId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 48, transition: { duration: 0.22 } }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  layout
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-7 h-7 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate mb-0.5">
                      {item.name ?? "Unnamed Item"}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-base font-bold text-gray-900">
                      ₹{((item.price ?? 0) * item.quantity).toFixed(2)}
                    </p>
                    {item.price && item.quantity > 1 && (
                      <p className="text-xs text-gray-400">
                        ₹{item.price.toFixed(2)} each
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all duration-150"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1">
                      <button
                        onClick={() => updateQty(item.menuItemId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150 text-gray-500 hover:text-gray-900 active:scale-90"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-gray-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.menuItemId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150 text-gray-500 hover:text-gray-900 active:scale-90"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate("/menu")}
              className="w-full mt-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400 font-medium hover:border-orange-300 hover:text-orange-500 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add more items
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:sticky lg:top-24 space-y-4"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 tracking-tight">
                  Order Summary
                </h2>
              </div>

              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Delivery fee</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? "text-green-500" : "text-gray-900"}`}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">GST (5%)</span>
                  <span className="font-semibold text-gray-900">
                    ₹{tax.toFixed(2)}
                  </span>
                </div>

                <div className="pt-3 mt-1 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-gray-900/10"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <div className="flex items-start gap-3 mb-3">
                <Tag className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">
                    {remainingForFree === 0
                      ? "🎉 You unlocked free delivery!"
                      : `Add ₹${remainingForFree.toFixed(2)} more for free delivery`}
                  </p>
                  <p className="text-xs text-gray-400">
                    Free delivery on orders over ₹{FREE_DELIVERY_THRESHOLD}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeDeliveryProgress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    freeDeliveryProgress === 100 ? "bg-green-400" : "bg-orange-400"
                  }`}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
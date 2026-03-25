import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "../store/OrderStore";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  UtensilsCrossed,
  Bike,
  ShoppingBag,
  Phone,
  Home,
  Building2,
  Hash,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import {
  OrderType,
  DeliveryAddress,
  CreateOrderPayload,
} from "../types/orderTypes";

const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;
const FREE_DELIVERY_THRESHOLD = 500;
const RESTAURANT_ID = "69928844ef04120a72b19c15";

const StepDot = ({
  active,
  done,
  label,
  num,
}: {
  active: boolean;
  done: boolean;
  label: string;
  num: number;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    <motion.div
      animate={{
        scale: active ? 1.1 : 1,
        backgroundColor: done ? "#22c55e" : active ? "#111827" : "#f3f4f6",
      }}
      transition={{ duration: 0.25 }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
      style={{ color: done || active ? "#fff" : "#9ca3af" }}
    >
      {done ? <CheckCircle2 className="w-4 h-4" /> : num}
    </motion.div>
    <span
      className={`text-[10px] font-semibold tracking-wide uppercase transition-colors duration-200 ${
        active ? "text-gray-900" : done ? "text-green-500" : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </div>
);

const OrderTypeCard = ({
  type,
  selected,
  onClick,
}: {
  type: OrderType;
  selected: boolean;
  onClick: () => void;
}) => {
  const meta =
    type === "dine-in"
      ? {
          icon: UtensilsCrossed,
          label: "Dine-In",
          sub: "Eat at the restaurant",
        }
      : { icon: Bike, label: "Delivery", sub: "Get it at your door" };

  const Icon = meta.icon;

  return (
    <button
      onClick={onClick}
      className={`flex-1 relative flex flex-col items-center gap-3 py-6 px-4 rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? "border-gray-900 bg-gray-900 text-white shadow-xl shadow-gray-900/20"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200 ${
          selected ? "bg-white/10" : "bg-gray-50"
        }`}
      >
        <Icon
          className={`w-6 h-6 ${selected ? "text-orange-300" : "text-gray-400"}`}
          strokeWidth={1.8}
        />
      </div>
      <div className="text-center">
        <p
          className={`font-bold text-sm ${selected ? "text-white" : "text-gray-800"}`}
        >
          {meta.label}
        </p>
        <p
          className={`text-xs mt-0.5 ${selected ? "text-white/60" : "text-gray-400"}`}
        >
          {meta.sub}
        </p>
      </div>
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </button>
  );
};

const Field = ({
  label,
  icon: Icon,
  error,
  ...props
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
      {label}
    </label>
    <input
      {...props}
      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-150 ${
        error
          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
          : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
      }`}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-xs text-red-500 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const TextareaField = ({
  label,
  icon: Icon,
  ...props
}: {
  label: string;
  icon: React.ElementType;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
      {label}
    </label>
    <textarea
      {...props}
      rows={2}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all duration-150 resize-none"
    />
  </div>
);

const ErrorBanner = ({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -8, height: 0 }}
    animate={{ opacity: 1, y: 0, height: "auto" }}
    exit={{ opacity: 0, y: -8, height: 0 }}
    className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-start gap-3"
  >
    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-red-700 flex-1">{message}</p>
    <button
      onClick={onDismiss}
      className="text-red-400 hover:text-red-600 transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

const OrderSummary = ({
  cart,
  cartCount,
  subtotal,
  deliveryFee,
  tax,
  total,
  orderType,
  onChangeType,
}: {
  cart: any[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  orderType: OrderType;
  onChangeType: () => void;
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
      <ShoppingBag className="w-4 h-4 text-orange-400" />
      <h3 className="font-bold text-sm text-gray-900">
        Order Summary · {cartCount} {cartCount === 1 ? "item" : "items"}
      </h3>
    </div>

    <div className="px-6 py-4 space-y-3 max-h-64 overflow-y-auto">
      {cart.map((item) => (
        <div key={item.menuItemId} className="flex items-center gap-3">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-gray-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {item.name}
            </p>
            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
          </div>
          <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
            ₹{((item.price ?? 0) * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}
    </div>

    <div className="px-6 py-4 border-t border-dashed border-gray-200 space-y-2.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-semibold text-gray-900">
          ₹{subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Delivery</span>
        <span
          className={`font-semibold ${deliveryFee === 0 ? "text-green-500" : "text-gray-900"}`}
        >
          {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">GST (5%)</span>
        <span className="font-semibold text-gray-900">₹{tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-xl font-bold text-gray-900">
          ₹{total.toFixed(2)}
        </span>
      </div>
    </div>

    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
      {orderType === "dine-in" ? (
        <UtensilsCrossed className="w-4 h-4 text-orange-400 flex-shrink-0" />
      ) : (
        <Bike className="w-4 h-4 text-orange-400 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-700">
          {orderType === "dine-in" ? "Dine-In Order" : "Delivery Order"}
        </p>
        <p className="text-xs text-gray-400">
          {orderType === "dine-in"
            ? "Served at your table"
            : deliveryFee === 0
              ? "Free delivery unlocked 🎉"
              : `₹${DELIVERY_FEE} delivery fee · Free above ₹${FREE_DELIVERY_THRESHOLD}`}
        </p>
      </div>
      <button
        onClick={onChangeType}
        className="text-xs text-orange-500 font-semibold hover:text-orange-600 transition-colors"
      >
        Change
      </button>
    </div>
  </div>
);

const SuccessScreen = ({ onBack }: { onBack: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4"
  >
    <div className="max-w-sm mx-auto text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"
      >
        <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">
          Order Confirmed
        </p>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
          You're all set! 🎉
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Your order has been placed successfully. We're getting it ready for
          you right now.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-gray-800 active:scale-95 transition-all duration-150 shadow-lg shadow-gray-900/10"
        >
          View My Orders
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  </motion.div>
);

export const CheckoutPage = () => {
  const cart = useCartStore((s) => s.cart);
  const cartTotal = useCartStore((s) => s.cartTotal);
  const cartCount = useCartStore((s) => s.cartCount);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();
  const { createOrder, error: storeError, clearError } = useOrderStore();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [step, setStep] = useState<1 | 2>(1);
  const [success, setSuccess] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState<
    Record<string, string>
  >({});
  const [address, setAddress] = useState<DeliveryAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof DeliveryAddress | "tableNumber", string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = cartTotal;
  const tax = subtotal * TAX_RATE;
  const deliveryFee =
    orderType === "delivery" && subtotal < FREE_DELIVERY_THRESHOLD
      ? DELIVERY_FEE
      : 0;
  const total = subtotal + deliveryFee + tax;

  // Only redirect on empty cart if not yet succeeded
  useEffect(() => {
    if (cart.length === 0 && !success) navigate("/my-orders");
  }, [cart, navigate, success]);

  const validateStep2 = useCallback(() => {
    const newErrors: typeof errors = {};

    if (orderType === "dine-in") {
      if (!tableNumber.trim())
        newErrors.tableNumber = "Table number is required";
    } else {
      if (!address.street.trim())
        newErrors.street = "Street address is required";
      if (!address.city.trim()) newErrors.city = "City is required";
      if (!address.state.trim()) newErrors.state = "State is required";
      if (!address.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
      if (!address.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^\+?\d{10,13}$/.test(address.phone.replace(/\s/g, "")))
        newErrors.phone = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [orderType, tableNumber, address]);

  const buildPayload = useCallback((): CreateOrderPayload => {
    const items = cart.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      ...(specialInstructions[item.menuItemId]
        ? { specialInstructions: specialInstructions[item.menuItemId] }
        : {}),
    }));

    if (orderType === "dine-in") {
      return { restaurantId: RESTAURANT_ID, orderType, items, tableNumber };
    }
    return {
      restaurantId: RESTAURANT_ID,
      orderType,
      items,
      deliveryAddress: address,
    };
  }, [cart, orderType, tableNumber, address, specialInstructions]);

  const handlePlaceOrder = async () => {
    if (!validateStep2()) return;

    setSubmitting(true);
    setSubmitError(null);
    clearError();

    try {
      const payload = buildPayload();
      const result = await createOrder(payload);

      if (!result) {
        setSubmitError(
          storeError || "Order creation failed. Please try again.",
        );
        return;
      }

      setSuccess(true);
      clearCart();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <SuccessScreen onBack={() => navigate("/my-orders")} />;
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
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => (step === 2 ? setStep(1) : navigate("/cart"))}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-0.5">
                Checkout
              </p>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                {step === 1 ? "Order Type" : "Details"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-14">
            <StepDot num={1} label="Type" active={step === 1} done={step > 1} />
            <div
              className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
                step > 1 ? "bg-green-400" : "bg-gray-200"
              }`}
            />
            <StepDot num={2} label="Details" active={step === 2} done={false} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="space-y-4">
            <AnimatePresence>
              {submitError && (
                <ErrorBanner
                  message={submitError}
                  onDismiss={() => setSubmitError(null)}
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-1">
                      How would you like your order?
                    </h2>
                    <p className="text-sm text-gray-400">
                      Select an order type to continue.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    {(["dine-in", "delivery"] as OrderType[]).map((t) => (
                      <OrderTypeCard
                        key={t}
                        type={t}
                        selected={orderType === t}
                        onClick={() => setOrderType(t)}
                      />
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900">
                        Special Instructions
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Any preferences per item? (Optional)
                      </p>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                      {cart.map((item) => (
                        <div key={item.menuItemId}>
                          <p className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-orange-100 text-orange-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                              {item.quantity}
                            </span>
                            {item.name}
                          </p>
                          <input
                            type="text"
                            placeholder="e.g. No onions, extra spicy…"
                            value={specialInstructions[item.menuItemId] ?? ""}
                            onChange={(e) =>
                              setSpecialInstructions((prev) => ({
                                ...prev,
                                [item.menuItemId]: e.target.value,
                              }))
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all duration-150"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-gray-900/10"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-1">
                      {orderType === "dine-in"
                        ? "Table Information"
                        : "Delivery Address"}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {orderType === "dine-in"
                        ? "Enter your table number so we can serve you."
                        : "Where should we deliver your order?"}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6 space-y-4">
                    {orderType === "dine-in" && (
                      <Field
                        label="Table Number"
                        icon={Hash}
                        placeholder="e.g. 5"
                        value={tableNumber}
                        onChange={(e) => {
                          setTableNumber(e.target.value);
                          if (errors.tableNumber)
                            setErrors((p) => ({ ...p, tableNumber: "" }));
                        }}
                        error={errors.tableNumber}
                      />
                    )}

                    {orderType === "delivery" && (
                      <>
                        <Field
                          label="Street Address"
                          icon={Home}
                          placeholder="123 Main St, Apartment 4B"
                          value={address.street}
                          onChange={(e) => {
                            setAddress((p) => ({
                              ...p,
                              street: e.target.value,
                            }));
                            if (errors.street)
                              setErrors((p) => ({ ...p, street: "" }));
                          }}
                          error={errors.street}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Field
                            label="City"
                            icon={Building2}
                            placeholder="Patna"
                            value={address.city}
                            onChange={(e) => {
                              setAddress((p) => ({
                                ...p,
                                city: e.target.value,
                              }));
                              if (errors.city)
                                setErrors((p) => ({ ...p, city: "" }));
                            }}
                            error={errors.city}
                          />
                          <Field
                            label="State"
                            icon={MapPin}
                            placeholder="Bihar"
                            value={address.state}
                            onChange={(e) => {
                              setAddress((p) => ({
                                ...p,
                                state: e.target.value,
                              }));
                              if (errors.state)
                                setErrors((p) => ({ ...p, state: "" }));
                            }}
                            error={errors.state}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Field
                            label="ZIP Code"
                            icon={Hash}
                            placeholder="800001"
                            value={address.zipCode}
                            onChange={(e) => {
                              setAddress((p) => ({
                                ...p,
                                zipCode: e.target.value,
                              }));
                              if (errors.zipCode)
                                setErrors((p) => ({ ...p, zipCode: "" }));
                            }}
                            error={errors.zipCode}
                          />
                          <Field
                            label="Phone"
                            icon={Phone}
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={address.phone}
                            onChange={(e) => {
                              setAddress((p) => ({
                                ...p,
                                phone: e.target.value,
                              }));
                              if (errors.phone)
                                setErrors((p) => ({ ...p, phone: "" }));
                            }}
                            error={errors.phone}
                          />
                        </div>
                        <TextareaField
                          label="Delivery Instructions"
                          icon={FileText}
                          placeholder="e.g. Call before delivery, leave at door…"
                          value={address.instructions}
                          onChange={(e) =>
                            setAddress((p) => ({
                              ...p,
                              instructions: e.target.value,
                            }))
                          }
                        />
                      </>
                    )}
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-gray-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Placing Order…
                      </>
                    ) : (
                      <>
                        Place Order · ₹{total.toFixed(2)}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    By placing your order, you agree to our{" "}
                    <span className="text-gray-700 underline cursor-pointer">
                      Terms of Service
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:sticky lg:top-24"
          >
            <OrderSummary
              cart={cart}
              cartCount={cartCount}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              orderType={orderType}
              onChangeType={() => setStep(1)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

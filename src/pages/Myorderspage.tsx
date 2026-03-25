import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ChevronRight,
  Filter,
  RotateCcw,
  UtensilsCrossed,
  Bike,
  Package,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/OrderStore";
import { Order, OrderStatus, OrderType } from "../types/orderTypes";

const ACTIVE_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out-for-delivery",
];

const OrderSkeleton = () => (
  <div className="bg-white rounded-3xl border p-5 animate-pulse">
    <div className="h-4 bg-stone-200 rounded w-1/3 mb-3" />
    <div className="h-3 bg-stone-200 rounded w-1/2 mb-2" />
    <div className="h-3 bg-stone-200 rounded w-1/4" />
  </div>
);

export const MyOrdersPage = () => {
  const { orders, pagination, loading, error, fetchOrders } = useOrderStore();

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<OrderType | "all">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders({
      status: statusFilter !== "all" ? statusFilter : undefined,
      orderType: typeFilter !== "all" ? typeFilter : undefined,
      page,
      limit: 10,
    });
  }, [statusFilter, typeFilter, page]);

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  const completedOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status),
  );

  return (
    <div className="min-h-screen bg-[#F9F6F1] pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        {/* HEADER */}
        <div className="pt-10 pb-8">
          <h1 className="text-3xl font-black text-stone-900">My Orders</h1>
          {pagination && (
            <p className="text-sm text-stone-400">{pagination.total} orders</p>
          )}
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "pending", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s as any);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === s ? "bg-black text-white" : "bg-white border"
              }`}
            >
              {s}
            </button>
          ))}

          <button
            onClick={() => {
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            className="ml-auto text-red-500 text-sm flex items-center gap-1"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* ERROR */}
        {error && <div className="text-red-500 text-center py-10">{error}</div>}

        {/* LOADING */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20 text-gray-400">No orders found</div>
        )}

        {/* LIST */}
        {!loading && orders.length > 0 && (
          <>
            {activeOrders.length > 0 && (
              <>
                <p className="text-sm mb-2">Active Orders</p>
                {activeOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </>
            )}

            {completedOrders.length > 0 && (
              <>
                <p className="text-sm mt-6 mb-2">Past Orders</p>
                {completedOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </>
            )}
          </>
        )}

        {/* PAGINATION */}
        {pagination && (
          <div className="flex justify-center gap-3 mt-6">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>

            <span>
              {page} / {pagination.pages}
            </span>

            <button
              disabled={page === pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/orders/${order._id}`)}
      className="bg-white border rounded-xl p-4 mb-3 cursor-pointer hover:shadow"
    >
      <div className="flex justify-between">
        <h3 className="font-bold">#{order.orderNumber}</h3>
        <span className="text-sm">{order.status}</span>
      </div>

      <p className="text-sm text-gray-500">{order.restaurantId?.name}</p>

      <p className="text-sm mt-1">₹{order.total}</p>
    </div>
  );
};

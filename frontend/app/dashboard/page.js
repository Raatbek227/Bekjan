"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { bookingService } from "@/services/booking-service";
import { orderService } from "@/services/order-service";
import { wishlistService } from "@/services/wishlist-service";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    bookings: 0,
    orders: 0,
    favorites: 0,
    loyalty: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [bookings, orders, favorites] = await Promise.all([
        bookingService.listMyBookings().catch(() => ({ data: [] })),
        orderService.listMyOrders().catch(() => ({ data: [] })),
        wishlistService.listWishlist().catch(() => ({ data: [] }))
      ]);

      const bookingList = bookings.data || [];
      const orderList = orders.data || [];
      const favoriteList = favorites.data || [];

      setStats({
        bookings: bookingList.length,
        orders: orderList.length,
        favorites: favoriteList.length,
        loyalty: 0
      });

      setRecentBookings(bookingList.slice(0, 5));
      setRecentOrders(orderList.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell title="Customer dashboard">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Bookings", value: stats.bookings },
          { label: "Orders", value: stats.orders },
          { label: "Favorites", value: stats.favorites },
          { label: "Loyalty Points", value: stats.loyalty }
        ].map((item) => (
          <div key={item.label} className="glass-panel rounded-lg p-5">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold">{loading ? "—" : item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent">Bookings</p>
              <h2 className="mt-2 text-xl font-semibold">Recent bookings</h2>
            </div>
            <Button href="/booking" variant="secondary">
              New booking
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {recentBookings.length ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="rounded-md border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{booking.service?.name || booking.bookingCode}</p>
                      <p className="text-xs text-muted">{booking.bookingCode}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : booking.status === "COMPLETED"
                            ? "bg-blue-500/10 text-blue-300"
                            : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {new Date(booking.startsAt).toLocaleDateString()} at{" "}
                    {new Date(booking.startsAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-white/10 bg-white/5 p-4 text-center text-sm text-muted">
                No bookings yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent">Orders</p>
              <h2 className="mt-2 text-xl font-semibold">Recent orders</h2>
            </div>
            <Button href="/store" variant="secondary">
              Shop now
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <div key={order.id} className="rounded-md border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-xs text-muted">{order.items?.length || 0} items</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : order.status === "SHIPPED"
                            ? "bg-blue-500/10 text-blue-300"
                            : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">${Number(order.total || 0).toFixed(2)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-white/10 bg-white/5 p-4 text-center text-sm text-muted">
                No orders yet
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}


"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { orderService } from "@/services/order-service";

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await orderService.listMyOrders();
        setOrders(data.data || []);
      } catch (err) {
        setError("Unable to load order history.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <DashboardShell title="Orders">
      <div className="glass-panel rounded-3xl border border-white/10 bg-black/30 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent">Order history</p>
            <h1 className="mt-2 text-3xl font-semibold">Your latest orders</h1>
          </div>
          <p className="text-sm text-muted">{loading ? "Loading…" : `${orders.length} orders`}</p>
        </div>

        {error ? (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-muted">
              <tr>
                <th className="pb-3 pr-6">Order</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3 pr-6">Total</th>
                <th className="pb-3 pr-6">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 pr-6">{order.orderNumber}</td>
                    <td className="pr-6">{order.status}</td>
                    <td className="pr-6">${Number(order.total || 0).toFixed(2)}</td>
                    <td className="pr-6">{order.items?.length || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { adminService } from "@/services/admin-service";
import { adminLinks } from "@/constants/admin-links";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService
      .listOrders()
      .then((data) => setOrders(data.data || []))
      .catch(() => setError("Не удалось загрузить заказы"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Admin / Orders" navLinks={adminLinks}>
      <div className="glass-panel rounded-lg p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent">Orders</p>
            <h1 className="text-3xl font-semibold">Recent orders</h1>
          </div>
          <p className="text-sm text-muted">Всего: {loading ? "..." : orders.length}</p>
        </div>

        {error ? (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-muted">
              <tr>
                <th className="pb-3 pr-6">Order</th>
                <th className="pb-3 pr-6">Customer</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3 pr-6">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    Загрузка...
                  </td>
                </tr>
              ) : orders.length ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 pr-6">{order.orderNumber}</td>
                    <td className="pr-6">{order.user?.name ?? order.user?.email ?? "Гость"}</td>
                    <td className="pr-6">{order.status}</td>
                    <td className="pr-6">${Number(order.total).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    Нет заказов для отображения
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

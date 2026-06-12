"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { adminService } from "@/services/admin-service";
import { adminLinks } from "@/constants/admin-links";

const quickLinks = adminLinks.filter(([, href]) => href !== "/admin");

function statusClass(status) {
  switch (status) {
    case "Paid":
      return "bg-emerald-500/10 text-emerald-300";
    case "Pending":
      return "bg-amber-500/10 text-amber-300";
    case "Booked":
      return "bg-sky-500/10 text-sky-300";
    default:
      return "bg-white/10 text-muted";
  }
}

function formatCurrency(value) {
  return typeof value === "number"
    ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "--";
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState({
    revenue: null,
    orders: null,
    bookings: null,
    customers: null,
    products: null,
    services: null
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyticsRequest = adminService.getAnalytics();
    const ordersRequest = adminService.listOrders();

    Promise.all([analyticsRequest, ordersRequest])
      .then(([analyticsData, ordersData]) => {
        setAnalytics(analyticsData);
        setRecentOrders((ordersData.data || []).slice(0, 5));
      })
      .catch(() => setError("Не удалось загрузить данные админки"))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Revenue", value: formatCurrency(analytics.revenue), change: "+18%" },
      { label: "Orders", value: analytics.orders ?? "--", change: "+5%" },
      { label: "Bookings", value: analytics.bookings ?? "--", change: "-2%" },
      { label: "Customers", value: analytics.customers ?? "--", change: "+12%" },
      { label: "Products", value: analytics.products ?? "--", change: "+1%" },
      { label: "Services", value: analytics.services ?? "--", change: "+8%" }
    ],
    [analytics]
  );

  return (
    <DashboardShell title="Admin CRM" navLinks={adminLinks}>
      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-panel rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold">
                  {loading ? "Загрузка..." : metric.value}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${metric.change.startsWith("-") ? "bg-red-500/10 text-red-300" : "bg-emerald-500/10 text-emerald-300"}`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="mt-8 rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="glass-panel rounded-lg p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-accent">Quick actions</p>
          <div className="mt-5 grid gap-3">
            {quickLinks.map(([label, href]) => (
              <Link key={label} href={href} className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm hover:border-white/20 hover:bg-white/10">
                {label}
              </Link>
            ))}
          </div>
        </aside>

        <div className="glass-panel rounded-lg p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent">Recent activity</p>
              <h2 className="mt-2 text-2xl font-semibold">Latest orders</h2>
            </div>
            <Link href="/admin/orders" className="text-sm text-accent hover:text-white">
              View all
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
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
                ) : recentOrders.length ? (
                  recentOrders.map((item) => (
                    <tr key={item.orderNumber || item.id}>
                      <td className="py-4 pr-6">{item.orderNumber ?? item.id}</td>
                      <td className="pr-6">{item.user?.name ?? item.user?.email ?? "Гость"}</td>
                      <td className="pr-6">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${statusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="pr-6">${Number(item.total || 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      Нет последних заказов
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

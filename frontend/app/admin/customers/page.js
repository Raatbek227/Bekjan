"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { adminService } from "@/services/admin-service";
import { adminLinks } from "@/constants/admin-links";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService
      .listCustomers()
      .then((data) => setCustomers(data.data || []))
      .catch(() => setError("Не удалось загрузить клиентов"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Admin / Customers" navLinks={adminLinks}>
      <div className="glass-panel rounded-lg p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent">Customers</p>
            <h1 className="text-3xl font-semibold">Customer directory</h1>
          </div>
          <p className="text-sm text-muted">Всего: {loading ? "..." : customers.length}</p>
        </div>

        {error ? (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-muted">
              <tr>
                <th className="pb-3 pr-6">Name</th>
                <th className="pb-3 pr-6">Email</th>
                <th className="pb-3 pr-6">Role</th>
                <th className="pb-3 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    Загрузка...
                  </td>
                </tr>
              ) : customers.length ? (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="py-4 pr-6">{customer.name}</td>
                    <td className="pr-6">{customer.email}</td>
                    <td className="pr-6">{customer.role?.name ?? "—"}</td>
                    <td className="pr-6">{customer.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    Нет клиентов для отображения
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

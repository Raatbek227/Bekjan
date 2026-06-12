"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { adminService } from "@/services/admin-service";
import { adminLinks } from "@/constants/admin-links";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService
      .listServices()
      .then((data) => setServices(data.data || []))
      .catch(() => setError("Не удалось загрузить услуги"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Admin / Services" navLinks={adminLinks}>
      <div className="glass-panel rounded-lg p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent">Services</p>
            <h1 className="text-3xl font-semibold">Service catalog</h1>
          </div>
          <p className="text-sm text-muted">Всего: {loading ? "..." : services.length}</p>
        </div>

        {error ? (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-muted">
              <tr>
                <th className="pb-3 pr-6">Name</th>
                <th className="pb-3 pr-6">Category</th>
                <th className="pb-3 pr-6">Price</th>
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
              ) : services.length ? (
                services.map((service) => (
                  <tr key={service.id}>
                    <td className="py-4 pr-6">{service.name}</td>
                    <td className="pr-6">{service.category?.name ?? "—"}</td>
                    <td className="pr-6">${Number(service.priceFrom).toFixed(2)}</td>
                    <td className="pr-6">{service.isActive ? "Active" : "Inactive"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    Нет услуг для отображения
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

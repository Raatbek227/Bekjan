"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin-service";
import { adminLinks } from "@/constants/admin-links";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService
      .listProducts()
      .then((data) => setProducts(data.data || []))
      .catch(() => setError("Не удалось загрузить продукты"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Admin / Products" navLinks={adminLinks}>
      <div className="glass-panel rounded-lg p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent">Products</p>
            <h1 className="text-3xl font-semibold">Product catalog</h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="text-sm text-muted">Всего: {loading ? "..." : products.length}</p>
            <Button href="/admin/products/new" variant="primary">Create product</Button>
          </div>
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
                <th className="pb-3 pr-6">Stock</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3 pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">
                    Загрузка...
                  </td>
                </tr>
              ) : products.length ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-4 pr-6">{product.name}</td>
                    <td className="pr-6">{product.category?.name ?? "—"}</td>
                    <td className="pr-6">${Number(product.price).toFixed(2)}</td>
                    <td className="pr-6">{product.stock}</td>
                    <td className="pr-6">{product.isActive ? "Active" : "Inactive"}</td>
                    <td className="pr-6">
                      <Button href={`/admin/products/edit?id=${product.id}`} variant="secondary">Edit</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">
                    Нет продуктов для отображения
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

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { adminService } from "@/services/admin-service";
import { adminLinks } from "@/constants/admin-links";

const emptyForm = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  price: "",
  salePrice: "",
  stock: "0",
  categoryId: "",
  isFeatured: false,
  isActive: false
};

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService
      .listProductCategories()
      .then((data) => setCategories(data.data || []))
      .catch(() => {})
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }

    adminService
      .getProduct(id)
      .then((product) => {
        setForm({
          name: product.name || "",
          slug: product.slug || "",
          sku: product.sku || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          salePrice: product.salePrice?.toString() || "",
          stock: product.stock?.toString() || "0",
          categoryId: product.category?.id || "",
          isFeatured: Boolean(product.isFeatured),
          isActive: Boolean(product.isActive)
        });
      })
      .catch(() => setError("Не удалось загрузить продукт"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await adminService.updateProduct(id, {
        name: form.name,
        slug: form.slug,
        sku: form.sku || undefined,
        description: form.description || undefined,
        specs: {},
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock: Number(form.stock),
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        categoryId: form.categoryId
      });

      setMessage("Продукт сохранён");
    } catch (err) {
      setError("Не удалось сохранить продукт");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title="Admin / Product" navLinks={adminLinks}>
      <div className="glass-panel rounded-lg p-5">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader eyebrow="Admin" title="Редактирование продукта" />
          <Button href="/admin/products" variant="secondary">
            Back to list
          </Button>
        </div>

        {loading ? (
          <div className="rounded-md bg-white/5 p-6 text-center text-sm text-muted">Загрузка продукта...</div>
        ) : (
          <form className="grid gap-6" onSubmit={handleSubmit}>
            {error ? (
              <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
            ) : null}
            {message ? (
              <div className="rounded-md bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="block space-y-2 text-sm text-white/80">
                <span>Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>

              <label className="block space-y-2 text-sm text-white/80">
                <span>Slug</span>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="block space-y-2 text-sm text-white/80">
                <span>SKU</span>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>

              <label className="block space-y-2 text-sm text-white/80">
                <span>Category</span>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <label className="block space-y-2 text-sm text-white/80">
                <span>Price</span>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>

              <label className="block space-y-2 text-sm text-white/80">
                <span>Sale Price</span>
                <input
                  type="number"
                  step="0.01"
                  name="salePrice"
                  value={form.salePrice}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>

              <label className="block space-y-2 text-sm text-white/80">
                <span>Stock</span>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
              </label>
            </div>

            <label className="block space-y-2 text-sm text-white/80">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent"
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="inline-flex items-center gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/10 bg-black/20 text-accent focus:ring-accent"
                />
                Featured product
              </label>

              <label className="inline-flex items-center gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/10 bg-black/20 text-accent focus:ring-accent"
                />
                Active status
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => router.push('/admin/products')}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save product"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}

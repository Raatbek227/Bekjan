"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProductFilter } from "@/components/sections/product-filter";
import { catalogService } from "@/services/catalog-service";
import { featuredProducts } from "@/constants/products";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 1000,
    sort: "newest"
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        limit: 20,
        page: 1,
        search: filters.search || undefined,
        category: filters.category || undefined,
        sort: filters.sort === "newest" ? undefined : filters.sort
      };

      const response = await catalogService.listProducts(params);
      let items = response.data || [];

      // Client-side price filtering
      items = items.filter(
        (item) => Number(item.price || 0) >= filters.minPrice && Number(item.price || 0) <= filters.maxPrice
      );

      setProducts(items.length > 0 ? items : featuredProducts);
    } catch (err) {
      setError("Unable to load products");
      setProducts(featuredProducts);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow="Online store"
        title="Paint, auto chemistry, coatings, tools, and protective products"
        description="Search, filter, and explore our premium automotive products with advanced discovery tools."
      />
      
      <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
        <ProductFilter onFilterChange={setFilters} />
        
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted">
              {loading ? "Loading..." : `${products.length} product${products.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-full flex h-48 items-center justify-center text-muted">
                Loading products...
              </div>
            ) : products.length ? (
              products.map((product) => <ProductCard key={product.id || product.slug} product={product} />)
            ) : (
              <div className="col-span-full flex h-48 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted">
                No products found matching your filters
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


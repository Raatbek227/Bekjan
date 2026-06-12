"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogService } from "@/services/catalog-service";

export function ProductFilter({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const response = await catalogService.listProductCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  }

  const applyFilters = useCallback(() => {
    onFilterChange({
      search: searchQuery,
      category: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sort: sortBy
    });
  }, [searchQuery, selectedCategory, priceRange, sortBy, onFilterChange]);

  useEffect(() => {
    const timer = setTimeout(applyFilters, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, priceRange, sortBy, applyFilters]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 1000]);
    setSortBy("newest");
  };

  return (
    <aside className="space-y-5">
      {/* Search */}
      <div className="glass-panel rounded-lg p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Search</p>
        <div className="mt-4 flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-muted hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="glass-panel rounded-lg p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-accent">Categories</p>
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ""}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded"
              />
              All categories
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={selectedCategory === cat.slug}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded"
                />
                {cat.name}
                {cat._count?.products && (
                  <span className="text-xs text-muted">({cat._count.products})</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="glass-panel rounded-lg p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Price</p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-muted">Min: ${priceRange[0]}</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Max: ${priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="glass-panel rounded-lg p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Sort</p>
        <div className="mt-4 space-y-2">
          {[
            ["newest", "Newest"],
            ["price-asc", "Price: Low to High"],
            ["price-desc", "Price: High to Low"],
            ["name", "Name: A-Z"]
          ].map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="sort"
                value={value}
                checked={sortBy === value}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="secondary" className="w-full" onClick={handleClearFilters}>
        Clear all filters
      </Button>
    </aside>
  );
}

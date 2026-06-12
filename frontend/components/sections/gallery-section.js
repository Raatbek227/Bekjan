"use client";

import { useEffect, useMemo, useState } from "react";
import { galleryService } from "@/services/gallery-service";

export function GallerySection() {
  const [items, setItems] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      setLoading(true);
      const response = await galleryService.listGallery();
      setItems(response.data || []);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(
    () => ["all", ...new Set(items.map((item) => item.category).filter(Boolean))],
    [items]
  );

  const types = useMemo(
    () => ["all", ...new Set(items.map((item) => item.type).filter(Boolean))],
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const categoryMatch = filterCategory === "all" || item.category === filterCategory;
      const typeMatch = filterType === "all" || item.type === filterType;
      return categoryMatch && typeMatch;
    });
  }, [items, filterCategory, filterType]);

  function openLightbox(item) {
    setActiveItem(item);
  }

  function closeLightbox() {
    setActiveItem(null);
  }

  function navigateLightbox(direction) {
    if (!activeItem) return;
    const currentIndex = filtered.findIndex((item) => item.id === activeItem.id);
    const nextIndex = (currentIndex + direction + filtered.length) % filtered.length;
    setActiveItem(filtered[nextIndex]);
  }

  if (loading) {
    return <div className="text-center text-muted">Loading gallery...</div>;
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filterCategory === cat
                  ? "bg-accent text-black"
                  : "border border-white/10 bg-white/5 text-muted hover:border-accent"
              }`}
            >
              {cat === "all" ? "All categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filterType === type
                  ? "bg-emerald-500 text-black"
                  : "border border-white/10 bg-white/5 text-muted hover:border-emerald-500"
              }`}
            >
              {type === "all" ? "All types" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? (
          filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openLightbox(item)}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-accent/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                <img
                  src={item.beforeUrl || item.mediaUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 py-3 text-white">
                  <p className="text-sm font-semibold line-clamp-1">{item.title || "Project"}</p>
                  <p className="mt-1 text-xs text-slate-300">
                    {item.category ? item.category.toUpperCase() : "Gallery"} • {item.type || "Photo"}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-muted">
            No gallery items available
          </div>
        )}
      </div>

      {activeItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="relative w-full max-w-5xl rounded-3xl bg-zinc-900 p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
            >
              Close
            </button>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-black">
                  <img
                    src={activeItem.mediaUrl}
                    alt={activeItem.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-300">
                  {activeItem.category && <span>{activeItem.category}</span>}
                  {activeItem.type && <span>{activeItem.type}</span>}
                  <span>{activeItem.description ? "Before / After" : "Photo"}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white">{activeItem.title}</h2>
                  {activeItem.description ? <p className="mt-3 text-sm leading-7 text-muted">{activeItem.description}</p> : null}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigateLightbox(-1)}
                  className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-white transition hover:border-accent/60 hover:bg-white/10"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => navigateLightbox(1)}
                  className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-white transition hover:border-emerald-500/60 hover:bg-white/10"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

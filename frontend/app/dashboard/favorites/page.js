"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { useAuthStore } from "@/store/auth-store";
import { wishlistService } from "@/services/wishlist-service";
import { Button } from "@/components/ui/button";

export default function DashboardFavoritesPage() {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const data = await wishlistService.listWishlist();
        setItems(data.data || []);
      } catch (err) {
        setError("Unable to load favorites.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  async function handleRemove(productId) {
    setRemoving(productId);
    try {
      await wishlistService.removeWishlistItem(productId);
      setItems((current) => current.filter((item) => item.productId !== productId));
    } catch (err) {
      setError("Unable to remove favorite.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <DashboardShell title="Favorites">
      {!user ? (
        <div className="glass-panel rounded-lg p-8 text-center">
          <p className="text-lg font-semibold">Favorites are available after login.</p>
          <p className="mt-3 text-sm text-muted">Save products to your favorites and access them later from your dashboard.</p>
          <Button href="/auth/login" className="mt-6">
            Login to continue
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-accent">Wishlist</p>
                <h2 className="mt-2 text-3xl font-semibold">Your favorites</h2>
              </div>
              <p className="text-sm text-muted">{items.length} items saved</p>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
          ) : null}

          {loading ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-muted">Loading favorites…</div>
          ) : items.length ? (
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="glass-panel flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-3xl bg-white/5">
                      <img
                        src={item.product?.images?.[0]?.url || "/placeholder.jpg"}
                        alt={item.product?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/store/${item.product?.slug}`} className="text-xl font-semibold hover:text-accent">
                        {item.product?.name}
                      </Link>
                      <p className="mt-2 text-sm text-muted">{item.product?.category?.name || item.product?.category || "Product"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <span className="text-lg font-semibold text-white">
                      ${Number(item.product?.price || item.product?.salePrice || 0).toFixed(2)}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => handleRemove(item.productId)}
                      disabled={removing === item.productId}
                    >
                      {removing === item.productId ? "Removing…" : "Remove"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-muted">
              You haven’t saved any favorites yet.
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/utils/currency";

export function CartView() {
  const { items, summary, loading, error, syncCart, removeRemoteItem, clearRemoteCart } = useCartStore();

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {loading ? <div className="glass-panel rounded-lg p-6 text-muted">Loading cart...</div> : null}
        {error ? <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</div> : null}
        {!loading && items.length === 0 ? (
          <div className="glass-panel rounded-lg p-8 text-muted">
            <ShoppingBag className="mb-4 text-accent" />
            Your cart is empty.
          </div>
        ) : null}
        {items.map((item) => (
          <article key={item.id || item.slug} className="glass-panel grid gap-4 rounded-lg p-5 md:grid-cols-[96px_1fr_auto] md:items-center">
            <div className="flex aspect-square items-center justify-center rounded-md bg-white/5 text-xs text-muted">
              {item.product?.category?.name || item.category}
            </div>
            <div>
              <Link href={`/store/${item.product?.slug || item.slug}`} className="font-semibold hover:text-accent">
                {item.product?.name || item.name}
              </Link>
              <p className="mt-2 text-sm text-muted">Qty: {item.quantity}</p>
            </div>
            <div className="flex items-center gap-3 md:justify-end">
              <span className="font-semibold">{formatCurrency(Number(item.product?.price || item.price || 0) * item.quantity)}</span>
              {item.id ? (
                <Button variant="ghost" ariaLabel="Remove item" onClick={() => removeRemoteItem(item.id)}>
                  <Trash2 size={16} />
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <aside className="glass-panel h-max rounded-lg p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Order summary</p>
        <div className="mt-6 space-y-4 text-sm text-muted">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{summary.itemCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>
        </div>
        <Button href="/checkout" className="mt-6 w-full">
          Checkout
        </Button>
        {items.length ? (
          <Button className="mt-3 w-full" variant="secondary" onClick={clearRemoteCart}>
            Clear cart
          </Button>
        ) : null}
      </aside>
    </div>
  );
}

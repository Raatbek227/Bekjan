"use client";

import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { WishlistAction } from "@/components/ui/wishlist-action";

export function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const category = product.category?.name || product.category;
  const price = Number(product.price || product.salePrice || 0).toFixed(2);

  return (
    <article className="glass-panel rounded-lg p-4">
      <div className="flex aspect-square items-center justify-center rounded-md bg-white/5 text-center text-sm text-muted">
        {category}
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-1 text-sm text-ember">
          <Star size={15} fill="currentColor" />
          {product.rating ?? "4.8"}
        </div>
        <Link href={`/store/${product.slug}`} className="mt-2 block font-semibold transition hover:text-accent">
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-muted">{product.description || "Premium automotive product."}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-lg font-semibold">${price}</span>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" ariaLabel={`Add ${product.name} to cart`} onClick={() => addItem(product)}>
              <ShoppingCart size={16} />
            </Button>
            <WishlistAction productId={product.id} />
          </div>
        </div>
      </div>
    </article>
  );
}

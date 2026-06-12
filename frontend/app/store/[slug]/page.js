import { notFound } from "next/navigation";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistAction } from "@/components/ui/wishlist-action";
import { catalogService } from "@/services/catalog-service";
import { featuredProducts } from "@/constants/products";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  try {
    return await catalogService.getProduct(slug);
  } catch {
    return featuredProducts.find((item) => item.slug === slug) || null;
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);

  return {
    title: product?.name || "Product"
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) {
    notFound();
  }

  const category = product.category?.name || product.category || "Product";
  const mainImage = product.images?.[0]?.url;
  const gallery = product.images?.slice(1) || [];
  const specs = typeof product.specs === "object" && product.specs ? product.specs : null;

  return (
    <section className="container-shell grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="glass-panel rounded-lg p-5">
        {mainImage ? (
          <img src={mainImage} alt={product.name} className="w-full rounded-lg object-cover" />
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-md bg-white/5 text-center text-muted">
            {category}
          </div>
        )}
        {gallery.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {gallery.map((image) => (
              <img key={image.id || image.url} src={image.url} alt={image.alt || product.name} className="h-40 w-full rounded-lg object-cover" />
            ))}
          </div>
        ) : null}
      </div>
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-accent">{category}</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-6xl">{product.name}</h1>
        <div className="mt-5 flex items-center gap-2 text-ember">
          <Star size={18} fill="currentColor" />
          <span>{product.rating ?? "4.8"}</span>
          <span className="text-muted">customer rating</span>
        </div>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{product.description || "Premium product for premium automotive care."}</p>
        <p className="mt-8 text-4xl font-semibold">${Number(product.price || product.salePrice || 0).toFixed(2)}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button>
            <ShoppingCart size={18} /> Add to cart
          </Button>
          <WishlistAction productId={product.id} />
        </div>
        {specs ? (
          <div className="mt-10 space-y-3 rounded-md border border-white/10 bg-white/5 p-5 text-sm text-muted">
            <h2 className="text-lg font-semibold text-white">Specifications</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="space-y-1 rounded-md bg-black/20 p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">{key}</p>
                  <p>{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {["Professional grade", "Stock tracking ready", "Related products ready"].map((item) => (
            <div key={item} className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-muted">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

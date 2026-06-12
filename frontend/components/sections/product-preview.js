import { featuredProducts } from "@/constants/products";
import { ProductCard } from "@/components/ui/product-card";

export function ProductPreview() {
  return (
    <section className="border-y border-white/10 bg-white/[0.025] py-16">
      <div className="container-shell">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">E-commerce</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Professional products for serious car care</h2>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

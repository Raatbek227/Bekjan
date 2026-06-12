import { serviceCategories } from "@/constants/services";
import { Button } from "@/components/ui/button";

export function ServicePreview() {
  return (
    <section className="container-shell py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Service catalog</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Built for premium automotive workflows</h2>
        </div>
        <Button href="/services" variant="secondary">View services</Button>
      </div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {serviceCategories.slice(0, 3).map((category) => (
          <article key={category.slug} className="glass-panel rounded-lg p-6">
            <h3 className="text-xl font-semibold">{category.name}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{category.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

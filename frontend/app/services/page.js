'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { catalogService } from "@/services/catalog-service";
import { serviceCategories } from "@/constants/services";

export default function ServicesPage() {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await catalogService.listServices();
        if (!mounted) return;
        setServices(response?.data ?? []);
      } catch (err) {
        if (!mounted) return;
        setServices([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const itemsSource = Array.isArray(services) ? services : [];
  const grouped = itemsSource.length
    ? itemsSource.reduce((acc, item) => {
        const category = item.category?.name || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {})
    : serviceCategories.reduce((acc, category) => {
        acc[category.name] = category.items;
        return acc;
      }, {});

  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow="Premium services"
        title="Detailing, coatings, paint protection, tinting, and car painting"
        description="The service catalog is connected to the API and ready for gallery, pricing, booking, and recommendations."
      />

      <div className="mt-10 space-y-8">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          Object.entries(grouped).map(([categoryName, items]) => (
            <article key={categoryName} className="glass-panel rounded-lg p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-accent">{categoryName}</p>
                  <p className="mt-1 text-lg text-muted">{items.length} service{items.length === 1 ? "" : "s"}</p>
                </div>
                <div className="rounded-full bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.28em] text-white/70">
                  {categoryName}
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <div key={item.slug || item.name} className="rounded-xl border border-white/10 bg-black/30 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted">{item.duration || `${item.durationMin} min`}</span>
                    </div>
                    <p className="mt-3 text-sm text-muted">{item.description || "Professional support for every premium automotive care workflow."}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-white/80">
                      <span>{item.priceFrom ? `$${Number(item.priceFrom).toFixed(2)}` : "Starting price"}</span>
                      <span>{item.benefits?.length ? `${item.benefits.length} benefits` : "Premium package"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

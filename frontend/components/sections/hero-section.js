import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(249,115,22,0.2),transparent_34%),linear-gradient(120deg,#080808_0%,#151515_52%,#050505_100%)]" />
      <div className="container-shell relative grid min-h-[calc(100vh-80px)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-accent">Detailing. Paint. Protection. Store.</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.03] md:text-7xl">
            Premium automotive care, booked and managed in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            A luxury car care platform for detailing, ceramic coating, paint protection film, car paint, auto chemistry, and CRM-grade operations.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/booking">
              Book service <CalendarCheck size={18} />
            </Button>
            <Button href="/store" variant="secondary">
              Shop products <ArrowRight size={18} />
            </Button>
          </div>
        </div>
        <div className="glass-panel rounded-lg p-5 shadow-glow">
          <div className="flex aspect-[4/5] flex-col justify-between rounded-md border border-white/10 bg-black/50 p-6">
            <Sparkles className="text-accent" size={34} />
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-muted">Live operations</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["98%", "Satisfaction"],
                  ["24/7", "Booking"],
                  ["12", "Service lines"],
                  ["CRM", "Admin panel"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold">{value}</p>
                    <p className="mt-1 text-sm text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

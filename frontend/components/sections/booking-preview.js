import { Button } from "@/components/ui/button";

export function BookingPreview() {
  return (
    <section className="container-shell py-16">
      <div className="glass-panel grid gap-8 rounded-lg p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Booking system</p>
          <h2 className="mt-3 text-3xl font-semibold">Vehicle, service, date, time, customer, payment, confirmation.</h2>
          <p className="mt-4 max-w-2xl text-muted">
            The booking module is structured for availability slots, working hours, staff assignment, and admin calendar control.
          </p>
        </div>
        <Button href="/booking">Start booking</Button>
      </div>
    </section>
  );
}

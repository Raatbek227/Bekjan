"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { bookingService } from "@/services/booking-service";

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await bookingService.listMyBookings();
        setBookings(data.data || []);
      } catch (err) {
        setError("Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <DashboardShell title="Bookings">
      <div className="glass-panel rounded-3xl border border-white/10 bg-black/30 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent">Bookings</p>
            <h1 className="mt-2 text-3xl font-semibold">Upcoming appointments</h1>
          </div>
          <p className="text-sm text-muted">{loading ? "Loading…" : `${bookings.length} bookings`}</p>
        </div>

        {error ? (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        ) : null}

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-muted">Loading booking details...</div>
          ) : bookings.length ? (
            bookings.map((booking) => (
              <div key={booking.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{booking.service?.name || booking.bookingCode}</p>
                    <p className="text-sm text-muted">{booking.bookingCode || booking.id}</p>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-muted">{booking.status}</span>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {new Date(booking.startsAt).toLocaleDateString()} at {new Date(booking.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-muted">No bookings found.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

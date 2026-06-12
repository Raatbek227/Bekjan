import { DashboardShell } from "@/layouts/dashboard-shell";

export default function DashboardSettingsPage() {
  return (
    <DashboardShell title="Settings">
      <div className="glass-panel rounded-3xl border border-white/10 bg-black/30 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Account settings</p>
        <div className="mt-6 space-y-4 text-sm text-muted">
          <p>Manage account preferences, notifications, and profile settings from this panel.</p>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="font-semibold text-white">Profile settings</p>
            <p className="mt-3">This section is ready for future account management features.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="font-semibold text-white">Notification preferences</p>
            <p className="mt-3">Enable alerts for bookings, orders, and promotions.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

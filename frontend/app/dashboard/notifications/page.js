import { DashboardShell } from "@/layouts/dashboard-shell";

const notifications = [
  { id: "1", message: "Your last booking is confirmed.", time: "2 hours ago", type: "success" },
  { id: "2", message: "Your order #1024 has been shipped.", time: "1 day ago", type: "info" },
  { id: "3", message: "New ceramic coatings are available.", time: "3 days ago", type: "info" }
];

export default function DashboardNotificationsPage() {
  return (
    <DashboardShell title="Notifications">
      <div className="glass-panel rounded-3xl border border-white/10 bg-black/30 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Latest alerts</p>
        <div className="mt-6 space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4 text-sm text-muted">
                <p>{notification.message}</p>
                <span>{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

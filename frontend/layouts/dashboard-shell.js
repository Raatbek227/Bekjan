import Link from "next/link";

const defaultLinks = [
  ["Profile", "/dashboard"],
  ["Orders", "/dashboard/orders"],
  ["Bookings", "/dashboard/bookings"],
  ["Favorites", "/dashboard/favorites"],
  ["Notifications", "/dashboard/notifications"],
  ["Settings", "/dashboard/settings"]
];

export function DashboardShell({ title, children, navLinks }) {
  const links = navLinks ?? defaultLinks;

  return (
    <section className="container-shell grid gap-8 py-12 lg:grid-cols-[240px_1fr]">
      <aside className="glass-panel rounded-lg p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Navigation</p>
        <nav className="mt-5 grid gap-2 text-sm text-muted">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-md px-3 py-2 hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

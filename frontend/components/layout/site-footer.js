import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-shell flex flex-col gap-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>Premium Car Care Center. Luxury detailing, paint, protection, and store platform.</p>
        <div className="flex gap-5">
          <Link href="/admin">Admin</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

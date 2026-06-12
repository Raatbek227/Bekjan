"use client";

import Link from "next/link";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/store", label: "Store" },
  { href: "/booking", label: "Booking" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/85 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold uppercase tracking-[0.22em]">
          Premium Car Care
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/cart" variant="ghost" ariaLabel="Open cart">
            <ShoppingCart size={18} />
          </Button>
          <Button href="/auth/login" variant="ghost" ariaLabel="Open account">
            <User size={18} />
          </Button>
          <Button className="lg:hidden" variant="ghost" ariaLabel="Open menu">
            <Menu size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}

import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: {
    default: "Premium Car Care Center",
    template: "%s | Premium Car Care Center"
  },
  description:
    "Luxury automotive detailing, car paint, paint protection, online booking, and professional car care store.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Premium Car Care Center",
    description: "Detailing, paint, coatings, store, and booking platform.",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}

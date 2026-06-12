import { HeroSection } from "@/components/sections/hero-section";
import { ServicePreview } from "@/components/sections/service-preview";
import { ProductPreview } from "@/components/sections/product-preview";
import { BookingPreview } from "@/components/sections/booking-preview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicePreview />
      <ProductPreview />
      <BookingPreview />
    </>
  );
}

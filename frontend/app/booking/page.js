import { BookingWizard } from "@/components/sections/booking-wizard";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Booking"
};

export default function BookingPage() {
  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow="Online booking"
        title="Reserve a premium car care visit"
        description="Multi-step booking flow prepared for vehicles, services, dates, available slots, customer data, payment, and confirmation."
      />
      <BookingWizard />
    </section>
  );
}

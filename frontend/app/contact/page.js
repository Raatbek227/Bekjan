import { PageHeader } from "@/components/ui/page-header";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow="Contact"
        title="Branches, social channels, maps, and customer requests"
        description="Get in touch with our team for consultations, bookings, or general inquiries about our premium services."
      />
      <ContactSection />
    </section>
  );
}

import { PageHeader } from "@/components/ui/page-header";
import { GallerySection } from "@/components/sections/gallery-section";

export const metadata = {
  title: "Gallery"
};

export default function GalleryPage() {
  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow="Gallery"
        title="Before and after, video gallery, and customer projects"
        description="Explore our premium transformations and professional automotive care expertise in action."
      />
      <GallerySection />
    </section>
  );
}

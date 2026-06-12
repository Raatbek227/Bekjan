import { PageHeader } from "@/components/ui/page-header";
import { BlogSection } from "@/components/sections/blog-section";

export const metadata = {
  title: "Blog"
};

export default function BlogPage() {
  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow="Car care journal"
        title="SEO-ready blog for detailing, coating, paint protection, and auto chemistry"
        description="Explore expert insights, care guides, product reviews, and industry trends from our premium automotive care specialists."
      />
      <BlogSection />
    </section>
  );
}


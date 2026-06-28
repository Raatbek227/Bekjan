"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, MessageCircle, Share2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { BlogComments } from "@/components/sections/blog-comments";
import { blogService } from "@/services/blog-service";

function BlogPostContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    blogService
      .getBlog(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="container-shell py-16 text-muted">Loading blog post...</div>;
  }

  if (!post) {
    return <div className="container-shell py-16 text-muted">Blog post not found.</div>;
  }

  const bodySections = String(post.content || "").split("\n\n");
  const publishedAt = new Date(post.publishedAt || post.createdAt).toLocaleDateString();

  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow={post.category?.name || "Blog"}
        title={post.title}
        description={post.excerpt || "Premium automotive care insights and expert detailing advice."}
      />

      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} className="mt-10 w-full rounded-lg object-cover shadow-2xl" />
      ) : null}

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.75fr_0.25fr]">
        <article className="space-y-8 rounded-lg border border-white/10 bg-black/30 p-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <span>{publishedAt}</span>
            <span>-</span>
            <span>{post.comments?.length || 0} comments</span>
            <span>-</span>
            <span>{post.likes ?? 0} likes</span>
          </div>

          {bodySections.map((section, index) => (
            <p key={index} className="text-lg leading-8 text-muted">
              {section}
            </p>
          ))}
        </article>

        <aside className="space-y-6">
          <div className="rounded-lg border border-white/10 bg-black/30 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-accent">Quick facts</p>
            <div className="mt-6 space-y-4 text-sm text-muted">
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-accent" />
                <span>Published on {publishedAt}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-accent" />
                <span>{post.comments?.length || 0} visible comments</span>
              </div>
              <div className="flex items-center gap-3">
                <Share2 size={18} className="text-accent" />
                <span>{post.shares ?? 0} shares</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <BlogComments slug={post.slug} />
      </div>
    </section>
  );
}

export default function BlogPostPage() {
  return (
    <Suspense fallback={<div className="container-shell py-16 text-muted">Loading blog post...</div>}>
      <BlogPostContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { blogService } from "@/services/blog-service";

export function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    try {
      setLoading(true);
      const response = await blogService.listBlogs({ limit: 12 });
      setPosts(response.data || []);
    } catch (err) {
      setError("Unable to load blog posts");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="container-shell py-16">
        <div className="text-center text-muted">Loading blog posts...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container-shell py-16">
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-center text-red-200">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="container-shell py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length ? (
          posts.map((post) => (
            <article key={post.id} className="glass-panel rounded-lg overflow-hidden flex flex-col">
              {post.coverImage && (
                <div className="aspect-video w-full overflow-hidden bg-white/5">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="uppercase tracking-[0.24em]">{post.category?.name || "Blog"}</span>
                  <span>•</span>
                  <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="mt-3 text-lg font-semibold hover:text-accent transition">
                  {post.title}
                </Link>
                <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt || post.content?.substring(0, 120)}</p>
                <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4 text-sm text-muted">
                  <button className="flex items-center gap-1 hover:text-accent transition">
                    <ThumbsUp size={16} />
                    {post.likes || 0}
                  </button>
                  <button className="flex items-center gap-1 hover:text-accent transition">
                    <MessageCircle size={16} />
                    Comments
                  </button>
                  <button className="flex items-center gap-1 hover:text-accent transition">
                    <Share2 size={16} />
                    {post.shares || 0}
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full flex h-48 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted">
            No blog posts available yet
          </div>
        )}
      </div>
    </section>
  );
}

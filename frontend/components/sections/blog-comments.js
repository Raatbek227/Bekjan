"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { blogService } from "@/services/blog-service";

export function BlogComments({ slug }) {
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadComments();
  }, [slug]);

  async function loadComments() {
    setLoading(true);
    setError(null);

    try {
      const response = await blogService.listComments(slug);
      setComments(response.data || []);
    } catch (err) {
      setError("Unable to load comments.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!commentValue.trim()) {
      setError("Please enter a comment.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      await blogService.createComment(slug, { content: commentValue.trim() });
      setCommentValue("");
      setSuccess(true);
      await loadComments();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("Unable to submit comment.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-black/30 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-accent">Comments</p>
          <h2 className="mt-2 text-2xl font-semibold">Readers&apos; feedback</h2>
        </div>
        <p className="text-sm text-muted">{comments.length} total</p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <textarea
          className="min-h-[140px] rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
          placeholder="Share your experience, ask a question, or leave a review..."
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-300">Comment submitted successfully.</p> : null}
        <Button type="submit" disabled={sending}>
          {sending ? "Posting..." : "Post comment"}
        </Button>
      </form>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted">Loading comments...</p>
        ) : comments.length ? (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3 text-sm text-muted">
                <span>{comment.user?.name || "Guest"}</span>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No comments yet. Be the first to leave feedback.</p>
        )}
      </div>
    </section>
  );
}

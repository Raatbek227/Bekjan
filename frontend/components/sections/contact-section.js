"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/contacts", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
      <form className="glass-panel grid gap-4 rounded-lg p-6 md:grid-cols-2" onSubmit={handleSubmit}>
        <input
          className="rounded-md border border-white/10 bg-black/40 px-4 py-3"
          placeholder="Full name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-black/40 px-4 py-3"
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-black/40 px-4 py-3"
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <div />
        <textarea
          className="min-h-32 rounded-md border border-white/10 bg-black/40 px-4 py-3 md:col-span-2"
          placeholder="Your message..."
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        {error && (
          <div className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200 md:col-span-2">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200 md:col-span-2">
            Message sent successfully! We'll get back to you soon.
          </div>
        )}

        <Button className="md:w-max" disabled={submitting} type="submit">
          {submitting ? "Sending..." : "Send message"}
        </Button>
      </form>

      <aside className="space-y-4">
        <div className="glass-panel rounded-lg p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-accent">Contact Info</p>
          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <Phone className="mt-1 flex-shrink-0 text-accent" size={20} />
              <div>
                <p className="text-sm font-semibold">Phone</p>
                <p className="text-sm text-muted">+1 (800) CAR-CARE</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-1 flex-shrink-0 text-accent" size={20} />
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p className="text-sm text-muted">support@premiumcare.com</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-1 flex-shrink-0 text-accent" size={20} />
              <div>
                <p className="text-sm font-semibold">Address</p>
                <p className="text-sm text-muted">123 Premium Blvd, Auto City, CA 90210</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-accent">Social</p>
          <div className="mt-5 flex gap-3">
            {[
              { icon: "W", label: "WhatsApp", href: "https://wa.me/18008227273" },
              { icon: "T", label: "Telegram", href: "https://t.me/premiumcare" },
              { icon: "I", label: "Instagram", href: "https://instagram.com/premiumcare" }
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 hover:border-accent hover:bg-accent/10 transition"
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

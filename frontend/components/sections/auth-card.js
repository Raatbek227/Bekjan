"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional()
});

export function AuthCard({ mode }) {
  const isRegister = mode === "register";
  const schema = isRegister ? registerSchema : loginSchema;
  const { login, register, loading, error } = useAuthStore();
  const [success, setSuccess] = useState(null);
  const {
    register: bind,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: ""
    }
  });

  async function onSubmit(values) {
    setSuccess(null);
    try {
      if (isRegister) {
        const result = await register(values);
        setSuccess(
          result.dev?.verificationToken
            ? `Account created. Dev verification token: ${result.dev.verificationToken}`
            : "Account created. Check your email to verify your account."
        );
        return;
      }

      await login(values);
      setSuccess("Signed in successfully.");
    } catch (error) {
      setSuccess(null);
    }
  }

  return (
    <section className="container-shell flex min-h-[calc(100vh-160px)] items-center justify-center py-16">
      <div className="glass-panel w-full max-w-md rounded-lg p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">{mode}</p>
        <h1 className="mt-4 text-3xl font-semibold">
          {isRegister ? "Create your account" : "Access your account"}
        </h1>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {isRegister ? (
            <>
              <input
                className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3"
                placeholder="Name"
                {...bind("name")}
              />
              {errors.name ? <p className="text-sm text-red-300">{errors.name.message}</p> : null}
              <input
                className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3"
                placeholder="Phone"
                {...bind("phone")}
              />
            </>
          ) : null}
          <input
            className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3"
            placeholder="Email"
            {...bind("email")}
          />
          {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
          <input
            className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3"
            placeholder="Password"
            type="password"
            {...bind("password")}
          />
          {errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
          {error ? <p className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
          {success ? <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</p> : null}
          <Button className="w-full" disabled={loading}>
            {loading ? "Please wait" : "Continue"}
          </Button>
        </form>
        <p className="mt-5 text-sm text-muted">
          {isRegister ? "Already have an account?" : "New customer?"}{" "}
          <Link href={isRegister ? "/auth/login" : "/auth/register"} className="text-accent">
            {isRegister ? "Sign in" : "Create account"}
          </Link>
        </p>
      </div>
    </section>
  );
}

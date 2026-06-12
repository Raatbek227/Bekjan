import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(5).max(32).optional(),
    password: z.string().min(8)
  }),
  query: z.any(),
  params: z.any()
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }),
  query: z.any(),
  params: z.any()
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional()
  }).default({}),
  query: z.any(),
  params: z.any()
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(32)
  }),
  query: z.any(),
  params: z.any()
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  }),
  query: z.any(),
  params: z.any()
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(32),
    password: z.string().min(8)
  }),
  query: z.any(),
  params: z.any()
});

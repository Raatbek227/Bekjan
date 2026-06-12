import { z } from "zod";

const ownerBody = {
  sessionId: z.string().min(8).optional()
};

export const listCartSchema = z.object({
  body: z.any(),
  query: z.object({
    sessionId: z.string().min(8).optional()
  }),
  params: z.any()
});

export const addCartItemSchema = z.object({
  body: z.object({
    ...ownerBody,
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99).default(1)
  }),
  query: z.any(),
  params: z.any()
});

export const updateCartItemSchema = z.object({
  body: z.object({
    ...ownerBody,
    quantity: z.number().int().min(1).max(99)
  }),
  query: z.any(),
  params: z.object({
    itemId: z.string().min(1)
  })
});

export const removeCartItemSchema = z.object({
  body: z.object(ownerBody).default({}),
  query: z.any(),
  params: z.object({
    itemId: z.string().min(1)
  })
});

export const clearCartSchema = z.object({
  body: z.object(ownerBody).default({}),
  query: z.any(),
  params: z.any()
});

export const wishlistProductSchema = z.object({
  body: z.object({
    productId: z.string().min(1)
  }),
  query: z.any(),
  params: z.any()
});

export const removeWishlistProductSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    productId: z.string().min(1)
  })
});

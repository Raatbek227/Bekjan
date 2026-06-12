import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  position: z.number().int().min(0).optional()
});

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(160),
    slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    sku: z.string().max(80).optional(),
    description: z.string().max(5000).optional(),
    specs: z.record(z.any()).optional(),
    price: z.number().positive(),
    salePrice: z.number().positive().optional(),
    stock: z.number().int().min(0).default(0),
    isFeatured: z.boolean().default(false),
    categoryId: z.string().min(1),
    images: z.array(imageSchema).optional()
  }),
  query: z.any(),
  params: z.any()
});

export const updateProductSchema = z.object({
  body: productSchema.shape.body.partial().extend({
    isActive: z.boolean().optional()
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const productCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    slug: z.string().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().max(1000).optional()
  }),
  query: z.any(),
  params: z.any()
});

export const updateProductCategorySchema = z.object({
  body: productCategorySchema.shape.body.partial(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

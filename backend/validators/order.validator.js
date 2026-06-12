import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z
        .object({
          productId: z.string().min(1).optional(),
          productSlug: z.string().min(1).optional(),
          quantity: z.number().int().min(1)
        })
        .refine((value) => value.productId || value.productSlug, {
          message: "productId or productSlug is required",
          path: ["productId"]
        })
    ).min(1),
    billingInfo: z.object({
      name: z.string().min(2),
      phone: z.string().min(5),
      email: z.string().email().optional(),
      address: z.string().min(3).optional(),
      city: z.string().optional()
    }),
    deliveryInfo: z.record(z.any()).optional(),
    paymentMethod: z.enum(["STRIPE", "CASH"]).default("CASH"),
    couponCode: z.string().min(2).max(40).optional(),
    deliveryTotal: z.number().min(0).default(0)
  }),
  query: z.any(),
  params: z.any()
});

export const getOrderSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    orderNumber: z.string().min(6)
  })
});

import { z } from "zod";

export const createBookingSchema = z.object({
  body: z
    .object({
      userId: z.string().optional(),
      serviceId: z.string().min(1),
      slotId: z.string().optional(),
      staffId: z.string().optional(),
      vehicleType: z.enum(["Sedan", "Coupe", "SUV", "Crossover", "Pickup"]),
      vehicleBrand: z.string().optional(),
      vehicleModel: z.string().optional(),
      vehicleYear: z.number().int().min(1950).max(2100).optional(),
      startsAt: z.string().datetime().optional(),
      endsAt: z.string().datetime().optional(),
      customerInfo: z.object({
        name: z.string().min(2),
        phone: z.string().min(5),
        email: z.string().email().optional()
      }),
      notes: z.string().max(1000).optional()
    })
    .refine((value) => value.slotId || value.startsAt, {
      message: "Either slotId or startsAt is required",
      path: ["startsAt"]
    }),
  query: z.any(),
  params: z.any()
});

export const availabilitySchema = z.object({
  body: z.any(),
  query: z.object({
    serviceId: z.string().min(1),
    staffId: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  }),
  params: z.any()
});

export const listBookingsSchema = z.object({
  body: z.any(),
  query: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    serviceId: z.string().optional(),
    staffId: z.string().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional()
  }),
  params: z.any()
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const bookingSlotSchema = z.object({
  body: z.object({
    serviceId: z.string().optional(),
    staffId: z.string().optional(),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    capacity: z.number().int().min(1).max(20).default(1),
    isBlocked: z.boolean().default(false),
    notes: z.string().max(1000).optional()
  }),
  query: z.any(),
  params: z.any()
});

export const updateBookingSlotSchema = z.object({
  body: bookingSlotSchema.shape.body.partial(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const staffSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    roleTitle: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    serviceIds: z.array(z.string()).optional()
  }),
  query: z.any(),
  params: z.any()
});

export const workingHourSchema = z.object({
  body: z.object({
    staffId: z.string().optional(),
    dayOfWeek: z.number().int().min(0).max(6),
    opensAt: z.string().regex(/^\d{2}:\d{2}$/),
    closesAt: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean().default(false)
  }),
  query: z.any(),
  params: z.any()
});

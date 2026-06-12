import { z } from "zod";

export const recommendationSchema = z.object({
  body: z.object({
    vehicleBrand: z.string().min(1),
    vehicleModel: z.string().min(1),
    vehicleYear: z.number().int().min(1950).max(2100)
  }),
  query: z.any(),
  params: z.any()
});

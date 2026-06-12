import { Router } from "express";
import { createBooking, getAvailability, listMyBookings } from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { availabilitySchema, createBookingSchema } from "../validators/booking.validator.js";

export const bookingRouter = Router();

bookingRouter.get("/availability", validate(availabilitySchema), getAvailability);
bookingRouter.get("/me", requireAuth, listMyBookings);
bookingRouter.post("/", validate(createBookingSchema), createBooking);

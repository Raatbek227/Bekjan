import { asyncHandler } from "../utils/async-handler.js";
import { bookingService } from "../services/booking.service.js";

export const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.listByUser(req.user.sub);
  res.json(bookings);
});

export const listBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.listAll(req.validated.query);
  res.json(bookings);
});

export const getAvailability = asyncHandler(async (req, res) => {
  const availability = await bookingService.availability(req.validated.query);
  res.json(availability);
});

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.create(req.validated.body);
  res.status(201).json(booking);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateStatus(req.params.id, req.validated.body.status);
  res.json(booking);
});

export const listBookingSlots = asyncHandler(async (req, res) => {
  const slots = await bookingService.listSlots(req.query);
  res.json(slots);
});

export const createBookingSlot = asyncHandler(async (req, res) => {
  const slot = await bookingService.createSlot(req.validated.body);
  res.status(201).json(slot);
});

export const updateBookingSlot = asyncHandler(async (req, res) => {
  const slot = await bookingService.updateSlot(req.params.id, req.validated.body);
  res.json(slot);
});

export const listStaff = asyncHandler(async (req, res) => {
  const staff = await bookingService.listStaff();
  res.json(staff);
});

export const createStaff = asyncHandler(async (req, res) => {
  const staff = await bookingService.createStaff(req.validated.body);
  res.status(201).json(staff);
});

export const listWorkingHours = asyncHandler(async (req, res) => {
  const hours = await bookingService.listWorkingHours(req.query.staffId);
  res.json(hours);
});

export const upsertWorkingHour = asyncHandler(async (req, res) => {
  const hour = await bookingService.upsertWorkingHour(req.validated.body);
  res.json(hour);
});

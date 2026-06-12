import { bookingRepository } from "../repositories/booking.repository.js";
import { ApiError } from "../utils/api-error.js";

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function dayRange(dateString) {
  const start = new Date(`${dateString}T00:00:00.000Z`);
  const end = new Date(`${dateString}T23:59:59.999Z`);
  return { start, end };
}

export const bookingService = {
  async listByUser(userId) {
    const data = await bookingRepository.listByUser(userId);
    return { data };
  },

  async listAll(query) {
    const data = await bookingRepository.listAll(query);
    return { data };
  },

  async availability(query) {
    const { start, end } = dayRange(query.date);
    const slots = await bookingRepository.listSlots({
      serviceId: query.serviceId,
      staffId: query.staffId,
      from: start.toISOString(),
      to: end.toISOString()
    });

    return {
      data: slots.map((slot) => ({
        id: slot.id,
        serviceId: slot.serviceId,
        staffId: slot.staffId,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        capacity: slot.capacity,
        bookedCount: slot.bookedCount,
        available: !slot.isBlocked && slot.bookedCount < slot.capacity,
        staff: slot.staff,
        service: slot.service
      }))
    };
  },

  async create(payload) {
    const service = await bookingRepository.findService(payload.serviceId);
    if (!service) {
      throw new ApiError(404, "Service not found");
    }

    let slot = null;
    if (payload.slotId) {
      slot = await bookingRepository.findSlot(payload.slotId);
      if (!slot || slot.isBlocked || slot.bookedCount >= slot.capacity) {
        throw new ApiError(409, "Selected slot is not available");
      }

      if (slot.serviceId && slot.serviceId !== payload.serviceId) {
        throw new ApiError(409, "Selected slot does not match requested service");
      }
    }

    const startsAt = slot?.startsAt || new Date(payload.startsAt);
    const endsAt = slot?.endsAt || (payload.endsAt ? new Date(payload.endsAt) : addMinutes(startsAt, service.durationMin));

    const booking = await bookingRepository.create({
      bookingCode: `BKG-${Date.now()}`,
      userId: payload.userId || null,
      serviceId: payload.serviceId,
      vehicleType: payload.vehicleType,
      vehicleBrand: payload.vehicleBrand || null,
      vehicleModel: payload.vehicleModel || null,
      vehicleYear: payload.vehicleYear || null,
      startsAt,
      endsAt,
      slotId: slot?.id || payload.slotId || null,
      staffId: slot?.staffId || payload.staffId || null,
      customerInfo: payload.customerInfo,
      notes: payload.notes || null
    });

    if (slot) {
      await bookingRepository.incrementSlotBookedCount(slot.id);
    }

    return booking;
  },

  async updateStatus(id, status) {
    return bookingRepository.updateStatus(id, status);
  },

  async listSlots(query) {
    const data = await bookingRepository.listSlots(query);
    return { data };
  },

  async createSlot(payload) {
    if (new Date(payload.endsAt) <= new Date(payload.startsAt)) {
      throw new ApiError(422, "Slot end time must be after start time");
    }

    return bookingRepository.createSlot({
      serviceId: payload.serviceId || null,
      staffId: payload.staffId || null,
      startsAt: new Date(payload.startsAt),
      endsAt: new Date(payload.endsAt),
      capacity: payload.capacity || 1,
      isBlocked: payload.isBlocked || false,
      notes: payload.notes || null
    });
  },

  async updateSlot(id, payload) {
    return bookingRepository.updateSlot(id, {
      ...payload,
      startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
      endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined
    });
  },

  async listStaff() {
    const data = await bookingRepository.listStaff();
    return { data };
  },

  async createStaff(payload) {
    return bookingRepository.createStaff(payload);
  },

  async upsertWorkingHour(payload) {
    return bookingRepository.upsertWorkingHour(payload);
  },

  async listWorkingHours(staffId) {
    const data = await bookingRepository.listWorkingHours(staffId);
    return { data };
  }
};

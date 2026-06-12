import { api } from "@/services/api";

export const bookingService = {
  async getAvailability(params) {
    const { data } = await api.get("/bookings/availability", { params });
    return data;
  },

  async createBooking(payload) {
    const { data } = await api.post("/bookings", payload);
    return data;
  },

  async listMyBookings() {
    const { data } = await api.get("/bookings/me");
    return data;
  }
};

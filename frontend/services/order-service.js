import { api } from "@/services/api";

export const orderService = {
  async createOrder(payload) {
    const { data } = await api.post("/orders", payload);
    return data;
  },

  async getOrder(orderNumber) {
    const { data } = await api.get(`/orders/${orderNumber}`);
    return data;
  },

  async listMyOrders() {
    const { data } = await api.get("/orders/me");
    return data;
  }
};

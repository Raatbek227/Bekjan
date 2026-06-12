import { api } from "@/services/api";

export const cartService = {
  async listCart(sessionId) {
    const { data } = await api.get("/cart", { params: { sessionId } });
    return data;
  },

  async addItem(payload) {
    const { data } = await api.post("/cart/items", payload);
    return data;
  },

  async updateItem(itemId, payload) {
    const { data } = await api.patch(`/cart/items/${itemId}`, payload);
    return data;
  },

  async removeItem(itemId, payload) {
    const { data } = await api.delete(`/cart/items/${itemId}`, { data: payload });
    return data;
  },

  async clearCart(payload) {
    const { data } = await api.delete("/cart", { data: payload });
    return data;
  }
};

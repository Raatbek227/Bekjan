import { api } from "@/services/api";

export const wishlistService = {
  async listWishlist() {
    const { data } = await api.get("/cart/wishlist");
    return data;
  },

  async addWishlistItem(productId) {
    const { data } = await api.post("/cart/wishlist", { productId });
    return data;
  },

  async removeWishlistItem(productId) {
    const { data } = await api.delete(`/cart/wishlist/${productId}`);
    return data;
  }
};

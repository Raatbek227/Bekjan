import { wishlistRepository } from "../repositories/wishlist.repository.js";

export const wishlistService = {
  async list(userId) {
    const data = await wishlistRepository.list(userId);
    return { data };
  },

  async add(userId, productId) {
    return wishlistRepository.add(userId, productId);
  },

  async remove(userId, productId) {
    return wishlistRepository.remove(userId, productId);
  }
};

import { prisma } from "../db/prisma.js";

export const wishlistRepository = {
  list(userId) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true, category: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  add(userId, productId) {
    return prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {},
      create: {
        userId,
        productId
      },
      include: { product: { include: { images: true, category: true } } }
    });
  },

  remove(userId, productId) {
    return prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
  }
};

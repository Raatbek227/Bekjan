import { prisma } from "../db/prisma.js";

function ownerWhere(owner) {
  if (owner.userId) {
    return { userId: owner.userId };
  }

  return { sessionId: owner.sessionId };
}

export const cartRepository = {
  list(owner) {
    return prisma.cartItem.findMany({
      where: ownerWhere(owner),
      include: {
        product: {
          include: { images: true, category: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  findItem(owner, productId) {
    return prisma.cartItem.findFirst({
      where: {
        ...ownerWhere(owner),
        productId
      }
    });
  },

  findItemById(owner, id) {
    return prisma.cartItem.findFirst({
      where: {
        ...ownerWhere(owner),
        id
      }
    });
  },

  createItem(owner, productId, quantity) {
    return prisma.cartItem.create({
      data: {
        ...ownerWhere(owner),
        productId,
        quantity
      },
      include: { product: { include: { images: true, category: true } } }
    });
  },

  updateItem(id, quantity) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: { include: { images: true, category: true } } }
    });
  },

  removeItem(id) {
    return prisma.cartItem.delete({
      where: { id }
    });
  },

  clear(owner) {
    return prisma.cartItem.deleteMany({
      where: ownerWhere(owner)
    });
  }
};

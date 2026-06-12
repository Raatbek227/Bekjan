import { prisma } from "../db/prisma.js";

export const orderRepository = {
  listByUser(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        payment: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  create(data) {
    return prisma.order.create({
      data,
      include: {
        items: { include: { product: true } },
        payment: true
      }
    });
  },

  getByOrderNumber(orderNumber) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: { include: { images: true, category: true } } } },
        payment: true,
        coupon: true
      }
    });
  },

  createCheckout(data, stockUpdates = []) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data,
        include: {
          items: { include: { product: true } },
          payment: true,
          coupon: true
        }
      });

      for (const update of stockUpdates) {
        await tx.product.update({
          where: { id: update.productId },
          data: {
            stock: { decrement: update.quantity }
          }
        });
      }

      return order;
    });
  },

  updatePaymentProvider(orderId, providerPaymentId, metadata = {}) {
    return prisma.payment.update({
      where: { orderId },
      data: {
        providerPaymentId,
        metadata
      }
    });
  },

  updateStatus(orderId, status) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }
};

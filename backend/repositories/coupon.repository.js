import { prisma } from "../db/prisma.js";

export const couponRepository = {
  findActiveByCode(code) {
    return prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true
      }
    });
  },

  incrementUsage(id) {
    return prisma.coupon.update({
      where: { id },
      data: { usedCount: { increment: 1 } }
    });
  }
};

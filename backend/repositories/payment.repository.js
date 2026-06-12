import { prisma } from "../db/prisma.js";

export const paymentRepository = {
  findByProviderId(providerPaymentId) {
    return prisma.payment.findFirst({
      where: { providerPaymentId }
    });
  },

  updateStatus(paymentId, status, metadata = {}) {
    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        metadata: { ...metadata }
      }
    });
  }
};

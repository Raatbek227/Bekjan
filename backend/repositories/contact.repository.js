import { prisma } from "../db/prisma.js";

export const contactRepository = {
  create(payload) {
    return prisma.contact.create({
      data: {
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        message: payload.message
      }
    });
  }
};

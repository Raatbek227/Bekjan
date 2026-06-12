import { prisma } from "../db/prisma.js";

export const userRepository = {
  ensureRole(name) {
    return prisma.role.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `${name} role`
      }
    });
  },

  findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true }
    });
  },

  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
  },

  create(data) {
    return prisma.user.create({
      data,
      include: { role: true }
    });
  },

  updateVerificationToken(userId, verificationToken) {
    return prisma.user.update({
      where: { id: userId },
      data: { verificationToken }
    });
  },

  findByVerificationToken(verificationToken) {
    return prisma.user.findFirst({
      where: { verificationToken },
      include: { role: true }
    });
  },

  verifyEmail(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        verificationToken: null
      },
      include: { role: true }
    });
  },

  updateResetPasswordToken(userId, resetPasswordToken, resetPasswordExpiry) {
    return prisma.user.update({
      where: { id: userId },
      data: { resetPasswordToken, resetPasswordExpiry }
    });
  },

  findByResetPasswordToken(resetPasswordToken) {
    return prisma.user.findFirst({
      where: { resetPasswordToken },
      include: { role: true }
    });
  },

  updatePassword(userId, passwordHash) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiry: null
      },
      include: { role: true }
    });
  }
};

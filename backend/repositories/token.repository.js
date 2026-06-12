import { prisma } from "../db/prisma.js";

export const tokenRepository = {
  createRefreshToken(data) {
    return prisma.refreshToken.create({ data });
  },

  findRefreshTokenByJti(jti) {
    return prisma.refreshToken.findUnique({
      where: { jti },
      include: { user: { include: { role: true } } }
    });
  },

  revokeRefreshToken(id, replacedByTokenId = null) {
    return prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt: new Date(),
        replacedByTokenId
      }
    });
  },

  revokeAllForUser(userId) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    });
  }
};

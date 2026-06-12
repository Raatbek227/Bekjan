import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { createJti, durationToDate, generateToken, hashToken } from "../utils/token-crypto.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { userRepository } from "../repositories/user.repository.js";

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt,
    loyaltyTier: user.loyaltyTier,
    loyaltyPoints: user.loyaltyPoints,
    role: user.role?.name || "USER"
  };
}

function createAccessToken(user) {
  return signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role?.name || "USER"
  });
}

async function createRefreshSession(user, context = {}) {
  const role = user.role?.name || "USER";
  const jti = createJti();
  const refreshToken = signRefreshToken({
    sub: user.id,
    email: user.email,
    role,
    jti
  });

  const stored = await tokenRepository.createRefreshToken({
    jti,
    tokenHash: hashToken(refreshToken),
    userId: user.id,
    expiresAt: durationToDate(env.jwtRefreshExpiresIn),
    userAgent: context.userAgent || null,
    ipAddress: context.ipAddress || null
  });

  return {
    refreshToken,
    refreshTokenRecord: stored
  };
}

export const authService = {
  async register(payload) {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new ApiError(409, "Email is already registered");
    }

    const role = await userRepository.ensureRole("USER");
    const passwordHash = await bcrypt.hash(payload.password, 12);
    const verificationToken = generateToken();
    const user = await userRepository.create({
      email: payload.email,
      name: payload.name,
      passwordHash,
      phone: payload.phone || null,
      verificationToken: hashToken(verificationToken),
      roleId: role.id
    });

    return {
      user: toPublicUser(user),
      dev: {
        verificationToken
      }
    };
  },

  async login(payload, context = {}) {
    const user = await userRepository.findByEmail(payload.email);
    if (!user || !user.passwordHash) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (user.status === "SUSPENDED") {
      throw new ApiError(403, "Account is suspended");
    }

    const { refreshToken } = await createRefreshSession(user, context);

    return {
      accessToken: createAccessToken(user),
      refreshToken,
      user: toPublicUser(user)
    };
  },

  async refresh(refreshToken, context = {}) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token required");
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const stored = await tokenRepository.findRefreshTokenByJti(payload.jti);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new ApiError(401, "Refresh token expired or revoked");
    }

    if (stored.tokenHash !== hashToken(refreshToken)) {
      await tokenRepository.revokeAllForUser(stored.userId);
      throw new ApiError(401, "Refresh token reuse detected");
    }

    const { refreshToken: nextRefreshToken, refreshTokenRecord } = await createRefreshSession(stored.user, context);
    await tokenRepository.revokeRefreshToken(stored.id, refreshTokenRecord.id);

    return {
      accessToken: createAccessToken(stored.user),
      refreshToken: nextRefreshToken,
      user: toPublicUser(stored.user)
    };
  },

  async logout(refreshToken) {
    if (!refreshToken) {
      return { ok: true };
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const stored = await tokenRepository.findRefreshTokenByJti(payload.jti);
      if (stored && !stored.revokedAt) {
        await tokenRepository.revokeRefreshToken(stored.id);
      }
    } catch (error) {
      return { ok: true };
    }

    return { ok: true };
  },

  async verifyEmail(token) {
    const tokenHash = hashToken(token);
    const user = await userRepository.findByVerificationToken(tokenHash);
    if (!user) {
      throw new ApiError(400, "Invalid verification token");
    }

    const verified = await userRepository.verifyEmail(user.id);
    return { user: toPublicUser(verified) };
  },

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { ok: true };
    }

    const resetToken = generateToken();
    await userRepository.updateResetPasswordToken(
      user.id,
      hashToken(resetToken),
      new Date(Date.now() + 60 * 60 * 1000)
    );

    return {
      ok: true,
      dev: {
        resetToken
      }
    };
  },

  async resetPassword(payload) {
    const user = await userRepository.findByResetPasswordToken(hashToken(payload.token));
    if (!user || !user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const updated = await userRepository.updatePassword(user.id, passwordHash);
    await tokenRepository.revokeAllForUser(user.id);

    return { user: toPublicUser(updated) };
  }
};

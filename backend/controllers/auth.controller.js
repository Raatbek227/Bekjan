import { asyncHandler } from "../utils/async-handler.js";
import { authService } from "../services/auth.service.js";
import { clearRefreshCookie, getRefreshToken, setRefreshCookie } from "../utils/auth-cookies.js";

function getContext(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  };
}

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.validated.body);
  res.status(201).json(user);
});

export const login = asyncHandler(async (req, res) => {
  const session = await authService.login(req.validated.body, getContext(req));
  setRefreshCookie(res, session.refreshToken);
  res.json(session);
});

export const refresh = asyncHandler(async (req, res) => {
  const session = await authService.refresh(getRefreshToken(req), getContext(req));
  setRefreshCookie(res, session.refreshToken);
  res.json(session);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(getRefreshToken(req));
  clearRefreshCookie(res);
  res.json({ ok: true });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.validated.body.token);
  res.json(result);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.validated.body.email);
  res.json(result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.validated.body);
  res.json(result);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

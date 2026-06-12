import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword,
  verifyEmail
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema
} from "../validators/auth.validator.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", validate(refreshSchema), refresh);
authRouter.post("/logout", validate(refreshSchema), logout);
authRouter.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
authRouter.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
authRouter.post("/reset-password", validate(resetPasswordSchema), resetPassword);
authRouter.get("/me", requireAuth, me);

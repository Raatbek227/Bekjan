import { Router } from "express";
import { createOrder, getOrder, listMyOrders } from "../controllers/order.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema, getOrderSchema } from "../validators/order.validator.js";

export const orderRouter = Router();

orderRouter.get("/me", requireAuth, listMyOrders);
orderRouter.get("/:orderNumber", validate(getOrderSchema), getOrder);
orderRouter.post("/", optionalAuth, validate(createOrderSchema), createOrder);

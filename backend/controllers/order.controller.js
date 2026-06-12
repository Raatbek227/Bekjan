import { asyncHandler } from "../utils/async-handler.js";
import { orderService } from "../services/order.service.js";

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listByUser(req.user.sub);
  res.json(orders);
});

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.create({
    ...req.validated.body,
    userId: req.user?.sub || null
  });
  res.status(201).json(order);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getByOrderNumber(req.params.orderNumber);
  res.json(order);
});

import { asyncHandler } from "../utils/async-handler.js";
import { paymentService } from "../services/payment.service.js";

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const event = await paymentService.handleStripeWebhook(req.body, signature);
  res.json({ received: true, event: event.type });
});

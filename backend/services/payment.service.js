import { stripe } from "../config/stripe.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";
import { paymentRepository } from "../repositories/payment.repository.js";
import { orderRepository } from "../repositories/order.repository.js";

export const paymentService = {
  isStripeConfigured() {
    return Boolean(stripe);
  },

  async createStripePaymentIntent(order) {
    if (!stripe) {
      throw new ApiError(503, "Stripe is not configured");
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.total) * 100),
      currency: "usd",
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    return {
      providerPaymentId: intent.id,
      clientSecret: intent.client_secret
    };
  },

  async handleStripeWebhook(rawBody, signature) {
    if (!stripe) {
      throw new ApiError(503, "Stripe is not configured");
    }
    if (!env.stripeWebhookSecret) {
      throw new ApiError(503, "Stripe webhook secret is not configured");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
    } catch (error) {
      throw new ApiError(400, `Webhook signature verification failed: ${error.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object;
        const payment = await paymentRepository.findByProviderId(intent.id);
        if (payment) {
          await paymentRepository.updateStatus(payment.id, "PAID", {
            stripeEvent: event.type,
            receivedAt: new Date().toISOString()
          });
          await orderRepository.updateStatus(payment.orderId, "PAID");
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        const payment = await paymentRepository.findByProviderId(intent.id);
        if (payment) {
          await paymentRepository.updateStatus(payment.id, "FAILED", {
            stripeEvent: event.type,
            failureMessage: intent.last_payment_error?.message,
            receivedAt: new Date().toISOString()
          });
          await orderRepository.updateStatus(payment.orderId, "PENDING");
        }
        break;
      }
      default:
        break;
    }

    return event;
  }
};

import { orderRepository } from "../repositories/order.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { couponRepository } from "../repositories/coupon.repository.js";
import { paymentService } from "./payment.service.js";
import { ApiError } from "../utils/api-error.js";

function normalizeItems(items) {
  const grouped = new Map();

  for (const item of items) {
    const key = item.productId ? `id:${item.productId}` : `slug:${item.productSlug}`;
    grouped.set(key, (grouped.get(key) || 0) + item.quantity);
  }

  return Array.from(grouped.entries()).map(([key, quantity]) => {
    const [type, value] = key.split(":");
    return type === "id" ? { productId: value, quantity } : { productSlug: value, quantity };
  });
}

function calculateDiscount(coupon, subtotal) {
  if (!coupon) {
    return 0;
  }

  if (coupon.startsAt && coupon.startsAt > new Date()) {
    throw new ApiError(422, "Coupon is not active yet");
  }

  if (coupon.endsAt && coupon.endsAt < new Date()) {
    throw new ApiError(422, "Coupon has expired");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(422, "Coupon usage limit reached");
  }

  const value = Number(coupon.discountValue);
  if (coupon.discountType === "PERCENT") {
    return Math.min(subtotal, subtotal * (value / 100));
  }

  return Math.min(subtotal, value);
}

export const orderService = {
  async listByUser(userId) {
    const data = await orderRepository.listByUser(userId);
    return { data };
  },

  async getByOrderNumber(orderNumber) {
    const order = await orderRepository.getByOrderNumber(orderNumber);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return order;
  },

  async create(payload) {
    const items = normalizeItems(payload.items);
    const products = await productRepository.findManyActiveByRefs({
      ids: items.filter((item) => item.productId).map((item) => item.productId),
      slugs: items.filter((item) => item.productSlug).map((item) => item.productSlug)
    });
    const productById = new Map(products.map((product) => [product.id, product]));
    const productBySlug = new Map(products.map((product) => [product.slug, product]));

    if (products.length !== items.length) {
      throw new ApiError(422, "One or more products are unavailable");
    }

    const orderItems = items.map((item) => {
      const product = item.productId ? productById.get(item.productId) : productBySlug.get(item.productSlug);
      if (product.stock < item.quantity) {
        throw new ApiError(409, `${product.name} does not have enough stock`);
      }

      return {
        productId: product.id,
        quantity: item.quantity,
        price: Number(product.salePrice || product.price)
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const coupon = payload.couponCode ? await couponRepository.findActiveByCode(payload.couponCode) : null;
    if (payload.couponCode && !coupon) {
      throw new ApiError(422, "Coupon is invalid");
    }

    const discountTotal = calculateDiscount(coupon, subtotal);
    const deliveryTotal = payload.deliveryTotal || 0;
    const total = subtotal - discountTotal + deliveryTotal;

    if (payload.paymentMethod === "STRIPE" && !paymentService.isStripeConfigured()) {
      throw new ApiError(503, "Stripe is not configured");
    }

    const order = await orderRepository.createCheckout(
      {
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
        userId: payload.userId || null,
        subtotal,
        discountTotal,
        deliveryTotal,
        total,
        billingInfo: payload.billingInfo,
        deliveryInfo: payload.deliveryInfo || null,
        couponId: coupon?.id || null,
        items: {
          create: orderItems
        },
        payment: {
          create: {
            method: payload.paymentMethod || "CASH",
            status: "PENDING",
            amount: total
          }
        }
      },
      orderItems.map((item) => ({ productId: item.productId, quantity: item.quantity }))
    );

    if (coupon) {
      await couponRepository.incrementUsage(coupon.id);
    }

    if (payload.paymentMethod === "STRIPE") {
      const intent = await paymentService.createStripePaymentIntent(order);
      await orderRepository.updatePaymentProvider(order.id, intent.providerPaymentId, {
        clientSecret: intent.clientSecret
      });

      return {
        order,
        payment: {
          clientSecret: intent.clientSecret,
          providerPaymentId: intent.providerPaymentId
        }
      };
    }

    return {
      order,
      payment: null
    };
  }
};

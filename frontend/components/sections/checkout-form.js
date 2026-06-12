"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { orderService } from "@/services/order-service";
import { formatCurrency } from "@/utils/currency";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const checkoutSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional(),
  address: z.string().min(3),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["CASH", "STRIPE"])
});

function getProductRef(item) {
  return {
    productId: item.product?.id || item.productId || null,
    productSlug: item.product?.slug || item.slug || null
  };
}

function CheckoutInner() {
  const { items, summary, clearCart } = useCartStore();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      address: "",
      couponCode: "",
      paymentMethod: "CASH"
    }
  });

  const checkoutItems = useMemo(
    () =>
      items
        .map((item) => ({
          ...getProductRef(item),
          quantity: item.quantity
        }))
        .filter((item) => item.productId || item.productSlug),
    [items]
  );

  async function onSubmit(values) {
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      if (checkoutItems.length === 0) {
        throw new Error("Cart has no checkout-ready items");
      }

      if (values.paymentMethod === "STRIPE") {
        if (!stripe || !elements) {
          throw new Error("Stripe is not loaded yet");
        }
      }

      const response = await orderService.createOrder({
        items: checkoutItems,
        billingInfo: {
          name: values.name,
          phone: values.phone,
          email: values.email || undefined,
          city: values.city || undefined,
          address: values.address
        },
        deliveryInfo: {
          city: values.city,
          address: values.address
        },
        paymentMethod: values.paymentMethod,
        couponCode: values.couponCode || undefined,
        deliveryTotal: 0
      });

      if (values.paymentMethod === "STRIPE") {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("Card element is not available");
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(response.payment.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: values.name,
              email: values.email || undefined
            }
          }
        });

        if (stripeError) {
          throw new Error(stripeError.message || "Stripe payment failed");
        }

        if (paymentIntent.status !== "succeeded") {
          throw new Error("Payment was not completed");
        }
      }

      setResult(response);
      clearCart();
    } catch (submitError) {
      setError(submitError.response?.data?.message || submitError.message || "Unable to create order");
    } finally {
      setSubmitting(false);
    }
  }

  const paymentMethod = watch("paymentMethod");

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
      <form className="glass-panel grid gap-4 rounded-lg p-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <input className="rounded-md border border-white/10 bg-black/40 px-4 py-3" placeholder="Full name" {...register("name")} />
        <input className="rounded-md border border-white/10 bg-black/40 px-4 py-3" placeholder="Phone" {...register("phone")} />
        <input className="rounded-md border border-white/10 bg-black/40 px-4 py-3" placeholder="Email" {...register("email")} />
        <input className="rounded-md border border-white/10 bg-black/40 px-4 py-3" placeholder="City" {...register("city")} />
        <input className="rounded-md border border-white/10 bg-black/40 px-4 py-3 md:col-span-2" placeholder="Address" {...register("address")} />
        <input className="rounded-md border border-white/10 bg-black/40 px-4 py-3 md:col-span-2" placeholder="Coupon code" {...register("couponCode")} />

        {paymentMethod === "STRIPE" ? (
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-white">Card details</label>
            <div className="mt-2 rounded-md border border-white/10 bg-black/40 p-4">
              <CardElement options={{ style: { base: { color: "#fff", fontSize: "16px", "::placeholder": { color: "#a1a1aa" } }, invalid: { color: "#f87171" } } }} />
            </div>
          </div>
        ) : null}

        {Object.values(errors).length ? (
          <p className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200 md:col-span-2">
            Please check the highlighted checkout fields.
          </p>
        ) : null}
        {error ? (
          <p className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200 md:col-span-2">{error}</p>
        ) : null}
        {result ? (
          <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200 md:col-span-2">
            Order created: {result.order.orderNumber}
          </p>
        ) : null}
      </form>
      <aside className="glass-panel h-max rounded-lg p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Payment</p>
        <div className="mt-6 grid gap-3">
          {["CASH", "STRIPE"].map((method) => (
            <label
              key={method}
              className={`rounded-md border px-4 py-3 text-left font-semibold ${
                paymentMethod === method ? "border-accent bg-accent text-black" : "border-white/10 bg-white/5"
              }`}
            >
              <input className="sr-only" type="radio" value={method} {...register("paymentMethod")} />
              {method === "CASH" ? "Cash payment" : "Stripe card"}
            </label>
          ))}
        </div>
        <div className="mt-6 space-y-3 text-sm text-muted">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{summary.itemCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>
        </div>
        <Button className="mt-6 w-full" disabled={submitting || (paymentMethod === "STRIPE" && !stripe)} type="submit">
          {submitting ? "Processing order..." : "Place order"}
        </Button>
      </aside>
    </div>
  );
}

export function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}

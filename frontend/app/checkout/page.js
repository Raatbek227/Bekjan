import { PageHeader } from "@/components/ui/page-header";
import { CheckoutForm } from "@/components/sections/checkout-form";

export const metadata = {
  title: "Checkout"
};

export default function CheckoutPage() {
  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow="Checkout"
        title="Billing, delivery, payment, review, and confirmation"
        description="Checkout is ready to connect cart items, coupons, Stripe, cash payments, and order creation."
      />
      <CheckoutForm />
    </section>
  );
}

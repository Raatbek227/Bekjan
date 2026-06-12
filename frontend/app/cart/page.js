import { PageHeader } from "@/components/ui/page-header";
import { CartView } from "@/components/sections/cart-view";

export const metadata = {
  title: "Cart"
};

export default function CartPage() {
  return (
    <section className="container-shell py-16">
      <PageHeader
        eyebrow="Shopping cart"
        title="Review products, coupons, saved items, and checkout"
        description="Cart state is prepared for add, remove, quantity updates, coupons, save for later, and checkout handoff."
      />
      <CartView />
    </section>
  );
}

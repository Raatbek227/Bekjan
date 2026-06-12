import { create } from "zustand";
import { cartService } from "@/services/cart-service";

function getSessionId() {
  if (typeof window === "undefined") {
    return null;
  }

  const existing = window.localStorage.getItem("cartSessionId");
  if (existing) {
    return existing;
  }

  const next = window.crypto?.randomUUID?.() || `cart-${Date.now()}`;
  window.localStorage.setItem("cartSessionId", next);
  return next;
}

export const useCartStore = create((set) => ({
  items: [],
  summary: {
    itemCount: 0,
    subtotal: 0
  },
  loading: false,
  error: null,
  sessionId: null,

  syncCart: async () => {
    const sessionId = getSessionId();
    set({ loading: true, sessionId, error: null });
    try {
      const cart = await cartService.listCart(sessionId);
      set({ items: cart.data, summary: cart.summary, loading: false });
      return cart;
    } catch (error) {
      set({ loading: false, error: "Unable to load cart" });
      return null;
    }
  },

  addRemoteItem: async (productId, quantity = 1) => {
    const sessionId = getSessionId();
    set({ loading: true, sessionId, error: null });
    try {
      const cart = await cartService.addItem({ sessionId, productId, quantity });
      set({ items: cart.data, summary: cart.summary, loading: false });
      return cart;
    } catch (error) {
      set({ loading: false, error: "Unable to add item" });
      throw error;
    }
  },

  updateRemoteItem: async (itemId, quantity) => {
    const sessionId = getSessionId();
    const cart = await cartService.updateItem(itemId, { sessionId, quantity });
    set({ items: cart.data, summary: cart.summary });
    return cart;
  },

  removeRemoteItem: async (itemId) => {
    const sessionId = getSessionId();
    const cart = await cartService.removeItem(itemId, { sessionId });
    set({ items: cart.data, summary: cart.summary });
    return cart;
  },

  clearRemoteCart: async () => {
    const sessionId = getSessionId();
    const cart = await cartService.clearCart({ sessionId });
    set({ items: cart.data, summary: cart.summary });
    return cart;
  },

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.slug === product.slug);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item
          ),
          summary: {
            itemCount: state.summary.itemCount + 1,
            subtotal: state.summary.subtotal + product.price
          }
        };
      }

      return {
        items: [...state.items, { ...product, quantity: 1 }],
        summary: {
          itemCount: state.summary.itemCount + 1,
          subtotal: state.summary.subtotal + product.price
        }
      };
    }),
  removeItem: (slug) =>
    set((state) => {
      const removed = state.items.find((item) => item.slug === slug);
      return {
        items: state.items.filter((item) => item.slug !== slug),
        summary: {
          itemCount: Math.max(0, state.summary.itemCount - (removed?.quantity || 0)),
          subtotal: Math.max(0, state.summary.subtotal - (removed ? removed.price * removed.quantity : 0))
        }
      };
    }),
  clearCart: () => set({ items: [], summary: { itemCount: 0, subtotal: 0 } })
}));

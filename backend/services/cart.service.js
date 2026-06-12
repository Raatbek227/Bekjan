import { ApiError } from "../utils/api-error.js";
import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";

function getOwner(payload) {
  if (payload.userId) {
    return { userId: payload.userId };
  }

  if (payload.sessionId) {
    return { sessionId: payload.sessionId };
  }

  throw new ApiError(422, "userId or sessionId is required");
}

function serializeCart(items) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  return {
    data: items,
    summary: {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal
    }
  };
}

export const cartService = {
  async list(payload) {
    const items = await cartRepository.list(getOwner(payload));
    return serializeCart(items);
  },

  async add(payload) {
    const owner = getOwner(payload);
    const product = await productRepository.findActiveById(payload.productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.stock < payload.quantity) {
      throw new ApiError(409, "Requested quantity is not available");
    }

    const existing = await cartRepository.findItem(owner, payload.productId);
    if (existing) {
      await cartRepository.updateItem(existing.id, existing.quantity + payload.quantity);
    } else {
      await cartRepository.createItem(owner, payload.productId, payload.quantity);
    }

    const items = await cartRepository.list(owner);
    return serializeCart(items);
  },

  async update(payload) {
    const owner = getOwner(payload);
    const existing = await cartRepository.findItemById(owner, payload.itemId);
    if (!existing) {
      throw new ApiError(404, "Cart item not found");
    }

    await cartRepository.updateItem(payload.itemId, payload.quantity);
    const items = await cartRepository.list(owner);
    return serializeCart(items);
  },

  async remove(payload) {
    const owner = getOwner(payload);
    const existing = await cartRepository.findItemById(owner, payload.itemId);
    if (!existing) {
      throw new ApiError(404, "Cart item not found");
    }

    await cartRepository.removeItem(payload.itemId);
    const items = await cartRepository.list(owner);
    return serializeCart(items);
  },

  async clear(payload) {
    const owner = getOwner(payload);
    await cartRepository.clear(owner);
    return serializeCart([]);
  }
};

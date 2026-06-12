import { Router } from "express";
import {
  addCartItem,
  addWishlistItem,
  clearCart,
  listCart,
  listWishlist,
  removeCartItem,
  removeWishlistItem,
  updateCartItem
} from "../controllers/cart.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  addCartItemSchema,
  clearCartSchema,
  listCartSchema,
  removeCartItemSchema,
  removeWishlistProductSchema,
  updateCartItemSchema,
  wishlistProductSchema
} from "../validators/cart.validator.js";

export const cartRouter = Router();

cartRouter.get("/", optionalAuth, validate(listCartSchema), listCart);
cartRouter.post("/items", optionalAuth, validate(addCartItemSchema), addCartItem);
cartRouter.patch("/items/:itemId", optionalAuth, validate(updateCartItemSchema), updateCartItem);
cartRouter.delete("/items/:itemId", optionalAuth, validate(removeCartItemSchema), removeCartItem);
cartRouter.delete("/", optionalAuth, validate(clearCartSchema), clearCart);

cartRouter.get("/wishlist", requireAuth, listWishlist);
cartRouter.post("/wishlist", requireAuth, validate(wishlistProductSchema), addWishlistItem);
cartRouter.delete("/wishlist/:productId", requireAuth, validate(removeWishlistProductSchema), removeWishlistItem);

import { cartService } from "../services/cart.service.js";
import { wishlistService } from "../services/wishlist.service.js";
import { asyncHandler } from "../utils/async-handler.js";

function ownerFromRequest(req) {
  return {
    userId: req.user?.sub,
    sessionId: req.validated?.body?.sessionId || req.validated?.query?.sessionId
  };
}

export const listCart = asyncHandler(async (req, res) => {
  const cart = await cartService.list(ownerFromRequest(req));
  res.json(cart);
});

export const addCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.add({
    ...ownerFromRequest(req),
    productId: req.validated.body.productId,
    quantity: req.validated.body.quantity
  });
  res.status(201).json(cart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.update({
    ...ownerFromRequest(req),
    itemId: req.params.itemId,
    quantity: req.validated.body.quantity
  });
  res.json(cart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.remove({
    ...ownerFromRequest(req),
    itemId: req.params.itemId
  });
  res.json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clear(ownerFromRequest(req));
  res.json(cart);
});

export const listWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.list(req.user.sub);
  res.json(wishlist);
});

export const addWishlistItem = asyncHandler(async (req, res) => {
  const item = await wishlistService.add(req.user.sub, req.validated.body.productId);
  res.status(201).json(item);
});

export const removeWishlistItem = asyncHandler(async (req, res) => {
  const item = await wishlistService.remove(req.user.sub, req.params.productId);
  res.json(item);
});

# API Modules

## Public

- `GET /health` - backend health check.
- `GET /api/products` - product listing with pagination-ready query handling.
- `GET /api/products/categories` - product category listing.
- `GET /api/products/:slug` - product details.
- `GET /api/services` - service catalog.
- `POST /api/services/recommend` - AI-style service recommendation endpoint.
- `GET /api/blogs` - blog listing.

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

Implemented security shape: access JWT, hashed refresh tokens, refresh rotation, logout revocation, hashed verification tokens, hashed password reset tokens.

Planned next endpoint: Google OAuth callback.

## Customer

- `GET /api/bookings/availability`
- `GET /api/bookings/me`
- `POST /api/bookings`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `DELETE /api/cart`
- `GET /api/cart/wishlist`
- `POST /api/cart/wishlist`
- `DELETE /api/cart/wishlist/:productId`
- `GET /api/orders/me`
- `POST /api/orders`

## Admin

- `GET /api/admin/analytics`
- `GET /api/admin/bookings`
- `PATCH /api/admin/bookings/:id/status`
- `GET /api/admin/booking-slots`
- `POST /api/admin/booking-slots`
- `PATCH /api/admin/booking-slots/:id`
- `GET /api/admin/staff`
- `POST /api/admin/staff`
- `GET /api/admin/working-hours`
- `PUT /api/admin/working-hours`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/product-categories`
- `POST /api/admin/product-categories`
- `PATCH /api/admin/product-categories/:id`

Planned next endpoints: users, reviews, blog, gallery, coupons, payments, settings, SEO, logs.

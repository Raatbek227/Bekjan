# Architecture

## Frontend

The frontend uses Next.js App Router and is organized around route groups for public pages, authentication, user dashboard, checkout, booking, and admin CRM. Business calls go through `services/api.js`, state lives in Zustand stores, and shared visual primitives live in `components/ui`.

## Backend

The backend follows a layered Express architecture:

- `routes` define HTTP surface.
- `controllers` handle request/response concerns.
- `services` contain business workflows.
- `repositories` isolate Prisma data access.
- `validators` define Zod schemas.
- `middleware` handles auth, roles, errors, rate limits, security, and validation.

## Core Domains

- Authentication and roles
- Products, categories, cart, wishlist, orders, payments
- Services and bookings
- Blog, comments, gallery, reviews
- Notifications, loyalty, settings, activity logs
- Admin CRM analytics and management

## Deployment

- Frontend: Vercel
- Backend: VPS or container host
- Database: PostgreSQL
- Media: Cloudinary
- Payments: Stripe plus cash option

# PREMIUM CAR CARE CENTER

Production-oriented full-stack platform for automotive detailing, car paint, auto chemicals, booking, e-commerce, dashboards, and admin CRM.

## Apps

- `frontend` - Next.js 15 App Router, React, Tailwind CSS, Zustand, forms, dashboard UI.
- `backend` - Express API, Prisma ORM, JWT auth architecture, booking/store/admin modules.

## First Run

```bash
npm install
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
npm run db:generate
npm run db:migrate --workspace backend
npm exec --workspace backend prisma db seed
npm run dev:frontend
npm run dev:backend
```

Default seeded admin:

- Email: `admin@premiumcarcare.local`
- Password: `Admin12345`

Use a real PostgreSQL `DATABASE_URL` in `backend/.env` before running migrations and seed.

Auth module currently includes:

- Register and login
- Access JWT
- Hashed refresh tokens with rotation
- Logout token revocation
- Email verification token flow
- Forgot/reset password token flow

Booking module currently includes:

- Staff members
- Staff-to-service assignments
- Working hours
- Booking slots
- Availability lookup
- Customer booking creation
- Admin booking status updates

Commerce module currently includes:

- Product catalog and product detail pages
- Public product/category APIs
- Admin product/category CRUD APIs
- Cart API for authenticated users or anonymous sessions
- Wishlist API for authenticated users
- Frontend cart state and checkout foundation

## Structure

```text
frontend/
  app/
  components/
  layouts/
  hooks/
  lib/
  services/
  store/
  middleware/
  utils/
  constants/
  styles/
  providers/
  public/

backend/
  controllers/
  routes/
  middleware/
  services/
  repositories/
  validators/
  prisma/
  utils/
  uploads/
  config/
  sockets/
```

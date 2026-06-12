import { asyncHandler } from "../utils/async-handler.js";
import { prisma } from "../db/prisma.js";

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [orderStats, bookings, customers, products, services] = await Promise.all([
    prisma.order.aggregate({
      _count: true,
      _sum: { total: true },
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"] } }
    }),
    prisma.booking.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } })
  ]);

  res.json({
    revenue: Number(orderStats._sum.total ?? 0),
    orders: orderStats._count,
    bookings,
    customers,
    products,
    services
  });
});

export const listAdminOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      payment: true,
      coupon: true,
      items: { include: { product: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  res.json({ data: orders });
});

export const listAdminCustomers = asyncHandler(async (req, res) => {
  const customers = await prisma.user.findMany({
    where: { status: "ACTIVE" },
    include: { role: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  res.json({ data: customers });
});

import { prisma } from "../db/prisma.js";

export const bookingRepository = {
  listByUser(userId) {
    return prisma.booking.findMany({
      where: { userId },
      include: { service: true, payment: true, staff: true, slot: true },
      orderBy: { startsAt: "desc" }
    });
  },

  listAll(query = {}) {
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.serviceId ? { serviceId: query.serviceId } : {}),
      ...(query.staffId ? { staffId: query.staffId } : {}),
      ...(query.from || query.to
        ? {
            startsAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {})
            }
          }
        : {})
    };

    return prisma.booking.findMany({
      where,
      include: { user: true, service: true, payment: true, staff: true, slot: true },
      orderBy: { startsAt: "asc" }
    });
  },

  create(data) {
    return prisma.booking.create({
      data,
      include: { service: true, payment: true, staff: true, slot: true }
    });
  },

  updateStatus(id, status) {
    return prisma.booking.update({
      where: { id },
      data: { status },
      include: { service: true, payment: true, staff: true, slot: true }
    });
  },

  findService(id) {
    return prisma.service.findUnique({
      where: { id }
    });
  },

  findSlot(id) {
    return prisma.bookingSlot.findUnique({
      where: { id },
      include: { service: true, staff: true }
    });
  },

  incrementSlotBookedCount(id) {
    return prisma.bookingSlot.update({
      where: { id },
      data: { bookedCount: { increment: 1 } }
    });
  },

  listSlots(query = {}) {
    return prisma.bookingSlot.findMany({
      where: {
        ...(query.serviceId ? { serviceId: query.serviceId } : {}),
        ...(query.staffId ? { staffId: query.staffId } : {}),
        ...(query.from || query.to
          ? {
              startsAt: {
                ...(query.from ? { gte: new Date(query.from) } : {}),
                ...(query.to ? { lte: new Date(query.to) } : {})
              }
            }
          : {})
      },
      include: { service: true, staff: true },
      orderBy: { startsAt: "asc" }
    });
  },

  createSlot(data) {
    return prisma.bookingSlot.create({
      data,
      include: { service: true, staff: true }
    });
  },

  updateSlot(id, data) {
    return prisma.bookingSlot.update({
      where: { id },
      data,
      include: { service: true, staff: true }
    });
  },

  listStaff() {
    return prisma.staffMember.findMany({
      include: {
        serviceAssignments: { include: { service: true } },
        workingHours: true
      },
      orderBy: { name: "asc" }
    });
  },

  createStaff(data) {
    return prisma.staffMember.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        roleTitle: data.roleTitle || null,
        avatarUrl: data.avatarUrl || null,
        serviceAssignments: data.serviceIds?.length
          ? {
              create: data.serviceIds.map((serviceId) => ({ serviceId }))
            }
          : undefined
      },
      include: {
        serviceAssignments: { include: { service: true } },
        workingHours: true
      }
    });
  },

  upsertWorkingHour(data) {
    return prisma.workingHour.upsert({
      where: {
        staffId_dayOfWeek: {
          staffId: data.staffId || null,
          dayOfWeek: data.dayOfWeek
        }
      },
      update: {
        opensAt: data.opensAt,
        closesAt: data.closesAt,
        isClosed: data.isClosed || false
      },
      create: {
        staffId: data.staffId || null,
        dayOfWeek: data.dayOfWeek,
        opensAt: data.opensAt,
        closesAt: data.closesAt,
        isClosed: data.isClosed || false
      }
    });
  },

  listWorkingHours(staffId) {
    return prisma.workingHour.findMany({
      where: { staffId: staffId || null },
      orderBy: { dayOfWeek: "asc" }
    });
  }
};

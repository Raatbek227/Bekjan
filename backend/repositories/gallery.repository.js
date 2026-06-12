import { prisma } from "../db/prisma.js";

export const galleryRepository = {
  list(query = {}) {
    const filter = {
      ...(query.type ? { type: query.type } : {}),
      ...(query.category ? { category: query.category } : {})
    };

    return prisma.gallery.findMany({
      where: filter,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: Number(query.limit) || 20,
      skip: Number(query.offset) || 0
    });
  }
  ,
  create(data) {
    return prisma.gallery.create({ data });
  },
  update(id, data) {
    return prisma.gallery.update({ where: { id }, data });
  },
  remove(id) {
    return prisma.gallery.delete({ where: { id } });
  }
};

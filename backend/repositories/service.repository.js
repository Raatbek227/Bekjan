import { prisma } from "../db/prisma.js";

export const serviceRepository = {
  async list() {
    const data = await prisma.service.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ category: { name: "asc" } }, { priceFrom: "asc" }]
    });

    return { data };
  },

  findById(id) {
    return prisma.service.findUnique({
      where: { id },
      include: { category: true }
    });
  },

  create(data) {
    return prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        benefits: data.benefits || [],
        durationMin: data.durationMin,
        priceFrom: data.priceFrom,
        gallery: data.gallery || null,
        isActive: data.isActive ?? true,
        categoryId: data.categoryId
      },
      include: { category: true }
    });
  },

  update(id, data) {
    return prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        benefits: data.benefits,
        durationMin: data.durationMin,
        priceFrom: data.priceFrom,
        gallery: data.gallery,
        isActive: data.isActive,
        categoryId: data.categoryId
      },
      include: { category: true }
    });
  },

  deactivate(id) {
    return prisma.service.update({
      where: { id },
      data: { isActive: false }
    });
  }
};

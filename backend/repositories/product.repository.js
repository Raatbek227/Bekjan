import { prisma } from "../db/prisma.js";

export const productRepository = {
  async list(query = {}) {
    const take = Math.min(Number(query.limit || 20), 100);
    const skip = Number(query.page || 1) > 1 ? (Number(query.page) - 1) * take : 0;
    const where = {
      isActive: true,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
              { sku: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(query.category ? { category: { slug: query.category } } : {})
    };

    const orderBy =
      query.sort === "price-asc"
        ? { price: "asc" }
        : query.sort === "price-desc"
          ? { price: "desc" }
          : query.sort === "name"
            ? { name: "asc" }
            : { createdAt: "desc" };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take,
        skip,
        include: { category: true, images: true },
        orderBy
      }),
      prisma.product.count({ where })
    ]);

    return { data, meta: { total, take, skip } };
  },

  listCategories() {
    return prisma.productCategory.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: "asc" }
    });
  },

  findBySlug(slug) {
    return prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: true,
        reviews: true
      }
    });
  },

  findActiveById(id) {
    return prisma.product.findFirst({
      where: { id, isActive: true },
      include: { images: true, category: true }
    });
  },

  findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true }
    });
  },

  findManyActiveByIds(ids) {
    return prisma.product.findMany({
      where: {
        id: { in: ids },
        isActive: true
      },
      include: { images: true, category: true }
    });
  },

  findManyActiveByRefs({ ids = [], slugs = [] }) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          ids.length ? { id: { in: ids } } : undefined,
          slugs.length ? { slug: { in: slugs } } : undefined
        ].filter(Boolean)
      },
      include: { images: true, category: true }
    });
  },

  create(data) {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku || null,
        description: data.description || null,
        specs: data.specs || undefined,
        price: data.price,
        salePrice: data.salePrice || null,
        stock: data.stock || 0,
        isFeatured: data.isFeatured || false,
        categoryId: data.categoryId,
        images: data.images?.length
          ? {
              create: data.images.map((image, index) => ({
                url: image.url,
                alt: image.alt || data.name,
                position: image.position ?? index
              }))
            }
          : undefined
      },
      include: { category: true, images: true }
    });
  },

  update(id, data) {
    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        specs: data.specs,
        price: data.price,
        salePrice: data.salePrice,
        stock: data.stock,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        categoryId: data.categoryId
      },
      include: { category: true, images: true }
    });
  },

  deactivate(id) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
  },

  createCategory(data) {
    return prisma.productCategory.create({ data });
  },

  updateCategory(id, data) {
    return prisma.productCategory.update({
      where: { id },
      data
    });
  }
};

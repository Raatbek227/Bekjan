import { prisma } from "../db/prisma.js";

export const blogRepository = {
  list(query = {}) {
    const search = query.search?.trim();
    const where = {
      isPublished: true,
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    return prisma.blog.findMany({
      where,
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: Number(query.limit) || 12,
      skip: Number(query.offset) || 0
    });
  },

  findBySlug(slug) {
    return prisma.blog.findUnique({
      where: { slug },
      include: {
        category: true,
        comments: {
          where: { isVisible: true },
          orderBy: { createdAt: "desc" },
          include: { user: { select: { id: true, name: true } } }
        }
      }
    });
  },

  listCategories() {
    return prisma.blogCategory.findMany({
      orderBy: { name: "asc" }
    });
  },

  listComments(blogSlug) {
    return prisma.comment.findMany({
      where: { blog: { slug: blogSlug }, isVisible: true },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" }
    });
  },

  createComment(blogSlug, payload) {
    return prisma.comment.create({
      data: {
        content: payload.content,
        userId: payload.userId || null,
        blog: { connect: { slug: blogSlug } }
      }
    });
  },

  likeBlog(blogSlug) {
    return prisma.blog.update({
      where: { slug: blogSlug },
      data: { likes: { increment: 1 } }
    });
  }
};

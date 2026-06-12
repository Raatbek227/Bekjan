import { blogRepository } from "../repositories/blog.repository.js";

export const blogService = {
  list(query) {
    return blogRepository.list(query);
  },

  getBySlug(slug) {
    return blogRepository.findBySlug(slug);
  },

  listCategories() {
    return blogRepository.listCategories();
  },

  listComments(blogSlug) {
    return blogRepository.listComments(blogSlug);
  },

  createComment(blogSlug, payload) {
    return blogRepository.createComment(blogSlug, payload);
  },

  likeBlog(blogSlug) {
    return blogRepository.likeBlog(blogSlug);
  }
};

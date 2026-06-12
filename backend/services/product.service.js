import { productRepository } from "../repositories/product.repository.js";

export const productService = {
  list(query) {
    return productRepository.list(query);
  },

  async listCategories() {
    const data = await productRepository.listCategories();
    return { data };
  },

  getBySlug(slug) {
    return productRepository.findBySlug(slug);
  },

  getById(id) {
    return productRepository.findById(id);
  },

  create(payload) {
    return productRepository.create(payload);
  },

  update(id, payload) {
    return productRepository.update(id, payload);
  },

  deactivate(id) {
    return productRepository.deactivate(id);
  },

  createCategory(payload) {
    return productRepository.createCategory(payload);
  },

  updateCategory(id, payload) {
    return productRepository.updateCategory(id, payload);
  }
};

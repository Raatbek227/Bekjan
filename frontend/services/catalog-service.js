import { api } from "@/services/api";

export const catalogService = {
  async listProducts(params = {}) {
    const { data } = await api.get("/products", { params });
    return data;
  },

  async listProductCategories() {
    const { data } = await api.get("/products/categories");
    return data;
  },

  async getProduct(slug) {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  },

  async listServices() {
    const { data } = await api.get("/services");
    return data;
  },

  async recommendServices(payload) {
    const { data } = await api.post("/services/recommend", payload);
    return data;
  }
};

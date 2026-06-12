import { api } from "./api";

export const adminService = {
  async getAnalytics() {
    const { data } = await api.get("/admin/analytics");
    return data;
  },

  async listProducts(params = {}) {
    const { data } = await api.get("/admin/products", { params });
    return data;
  },

  async getProduct(id) {
    const { data } = await api.get(`/admin/products/${id}`);
    return data;
  },

  async createProduct(payload) {
    const { data } = await api.post("/admin/products", payload);
    return data;
  },

  async updateProduct(id, payload) {
    const { data } = await api.patch(`/admin/products/${id}`, payload);
    return data;
  },

  async deactivateProduct(id) {
    const { data } = await api.delete(`/admin/products/${id}`);
    return data;
  },

  async listProductCategories() {
    const { data } = await api.get("/admin/product-categories");
    return data;
  },

  async listServices() {
    const { data } = await api.get("/admin/services");
    return data;
  },

  async createService(payload) {
    const { data } = await api.post("/admin/services", payload);
    return data;
  },

  async updateService(id, payload) {
    const { data } = await api.patch(`/admin/services/${id}`, payload);
    return data;
  },

  async deactivateService(id) {
    const { data } = await api.delete(`/admin/services/${id}`);
    return data;
  },

  async listBookings(params = {}) {
    const { data } = await api.get("/admin/bookings", { params });
    return data;
  },

  async listOrders(params = {}) {
    const { data } = await api.get("/admin/orders", { params });
    return data;
  },

  async listCustomers(params = {}) {
    const { data } = await api.get("/admin/customers", { params });
    return data;
  }
  ,
  async listGallery(params = {}) {
    const { data } = await api.get("/gallery", { params });
    return data;
  },
  async listGalleryAdmin(params = {}) {
    const { data } = await api.get("/admin/gallery", { params });
    return data;
  },
  async createGallery(payload) {
    const { data } = await api.post("/admin/gallery", payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  async updateGallery(id, payload) {
    const { data } = await api.put(`/admin/gallery/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  async deleteGallery(id) {
    const { data } = await api.delete(`/admin/gallery/${id}`);
    return data;
  }
};

import { api } from "@/services/api";

export const blogService = {
  async listBlogs(params = {}) {
    const { data } = await api.get("/blogs", { params });
    return data;
  },

  async getBlog(slug) {
    const { data } = await api.get(`/blogs/${slug}`);
    return data;
  },

  async listBlogCategories() {
    const { data } = await api.get("/blogs/categories");
    return data;
  },

  async likeBlog(blogId) {
    const { data } = await api.post(`/blogs/${blogId}/like`);
    return data;
  },

  async createComment(blogId, payload) {
    const { data } = await api.post(`/blogs/${blogId}/comments`, payload);
    return data;
  },

  async listComments(blogId) {
    const { data } = await api.get(`/blogs/${blogId}/comments`);
    return data;
  }
};

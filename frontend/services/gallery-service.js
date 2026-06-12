import { api } from "@/services/api";

export const galleryService = {
  async listGallery(params = {}) {
    const { data } = await api.get("/gallery", { params });
    return data;
  }
};

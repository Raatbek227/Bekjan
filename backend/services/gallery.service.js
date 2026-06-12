import { galleryRepository } from "../repositories/gallery.repository.js";

export const galleryService = {
  list(query) {
    return galleryRepository.list(query);
  }
};

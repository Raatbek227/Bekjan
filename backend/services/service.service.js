import { serviceRepository } from "../repositories/service.repository.js";

export const serviceService = {
  list() {
    return serviceRepository.list();
  },

  getById(id) {
    return serviceRepository.findById(id);
  },

  create(payload) {
    return serviceRepository.create(payload);
  },

  update(id, payload) {
    return serviceRepository.update(id, payload);
  },

  deactivate(id) {
    return serviceRepository.deactivate(id);
  },

  async recommend(vehicle) {
    return {
      vehicle,
      detailingPackage: "Full Detailing",
      ceramicPackage: "Professional Ceramic Coating",
      paintProtectionPackage: "Front Package PPF"
    };
  }
};

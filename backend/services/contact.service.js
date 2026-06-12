import { contactRepository } from "../repositories/contact.repository.js";

export const contactService = {
  create(payload) {
    return contactRepository.create(payload);
  }
};

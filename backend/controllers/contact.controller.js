import { asyncHandler } from "../utils/async-handler.js";
import { contactService } from "../services/contact.service.js";

export const submitContact = asyncHandler(async (req, res) => {
  const message = await contactService.create(req.body);
  res.status(201).json(message);
});

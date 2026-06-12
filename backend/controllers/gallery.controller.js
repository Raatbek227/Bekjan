import { asyncHandler } from "../utils/async-handler.js";
import { galleryService } from "../services/gallery.service.js";

export const listGallery = asyncHandler(async (req, res) => {
  const items = await galleryService.list(req.query);
  res.json({ data: items });
});

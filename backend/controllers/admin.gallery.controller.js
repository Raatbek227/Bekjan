import { asyncHandler } from "../utils/async-handler.js";
import { galleryService } from "../services/gallery.service.js";
import { galleryRepository } from "../repositories/gallery.repository.js";
import { cloudinary } from "../config/cloudinary.js";

function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "gallery" }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    stream.end(buffer);
  });
}

export const createGallery = asyncHandler(async (req, res) => {
  const { title, type, category, description, isFeatured } = req.body;

  let mediaUrl = null;
  let beforeUrl = req.body.beforeUrl || null;
  let afterUrl = req.body.afterUrl || null;

  if (req.file && req.file.buffer) {
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    mediaUrl = result.secure_url;
  }

  const created = await galleryRepository.create({
    title,
    type,
    category,
    description,
    isFeatured: Boolean(isFeatured),
    mediaUrl: mediaUrl || req.body.mediaUrl || "",
    beforeUrl,
    afterUrl
  });

  res.json({ data: created });
});

export const updateGallery = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title, type, category, description, isFeatured } = req.body;

  const payload = { title, type, category, description, isFeatured: Boolean(isFeatured) };

  if (req.file && req.file.buffer) {
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    payload.mediaUrl = result.secure_url;
  }

  const updated = await galleryRepository.update(id, payload);
  res.json({ data: updated });
});

export const deleteGallery = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deleted = await galleryRepository.remove(id);
  res.json({ data: deleted });
});

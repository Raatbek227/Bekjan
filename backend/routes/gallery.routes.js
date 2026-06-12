import { Router } from "express";
import { listGallery } from "../controllers/gallery.controller.js";

export const galleryRouter = Router();

galleryRouter.get("/", listGallery);

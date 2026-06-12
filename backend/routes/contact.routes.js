import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";

export const contactRouter = Router();

contactRouter.post("/", submitContact);

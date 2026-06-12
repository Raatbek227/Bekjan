import { Router } from "express";
import { listProductCategories, listProducts, getProduct } from "../controllers/product.controller.js";

export const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.get("/categories", listProductCategories);
productRouter.get("/:slug", getProduct);

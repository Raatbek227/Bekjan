import { asyncHandler } from "../utils/async-handler.js";
import { productService } from "../services/product.service.js";
import { ApiError } from "../utils/api-error.js";

export const listProducts = asyncHandler(async (req, res) => {
  const products = await productService.list(req.query);
  res.json(products);
});

export const listProductCategories = asyncHandler(async (req, res) => {
  const categories = await productService.listCategories();
  res.json(categories);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getBySlug(req.params.slug);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json(product);
});

export const getAdminProduct = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.create(req.validated.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.validated.body);
  res.json(product);
});

export const deactivateProduct = asyncHandler(async (req, res) => {
  const product = await productService.deactivate(req.params.id);
  res.json(product);
});

export const createProductCategory = asyncHandler(async (req, res) => {
  const category = await productService.createCategory(req.validated.body);
  res.status(201).json(category);
});

export const updateProductCategory = asyncHandler(async (req, res) => {
  const category = await productService.updateCategory(req.params.id, req.validated.body);
  res.json(category);
});

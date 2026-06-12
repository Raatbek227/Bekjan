import { asyncHandler } from "../utils/async-handler.js";
import { serviceService } from "../services/service.service.js";
import { ApiError } from "../utils/api-error.js";

export const listServices = asyncHandler(async (req, res) => {
  const services = await serviceService.list();
  res.json(services);
});

export const getService = asyncHandler(async (req, res) => {
  const service = await serviceService.getById(req.params.id);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  res.json(service);
});

export const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.create(req.validated.body);
  res.status(201).json(service);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.update(req.params.id, req.validated.body);
  res.json(service);
});

export const deactivateService = asyncHandler(async (req, res) => {
  const service = await serviceService.deactivate(req.params.id);
  res.json(service);
});

export const getServiceRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await serviceService.recommend(req.validated.body);
  res.json(recommendation);
});

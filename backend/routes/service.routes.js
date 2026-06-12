import { Router } from "express";
import { listServices, getServiceRecommendation } from "../controllers/service.controller.js";
import { validate } from "../middleware/validate.js";
import { recommendationSchema } from "../validators/service.validator.js";

export const serviceRouter = Router();

serviceRouter.get("/", listServices);
serviceRouter.post("/recommend", validate(recommendationSchema), getServiceRecommendation);

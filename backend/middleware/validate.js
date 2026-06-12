import { ApiError } from "../utils/api-error.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      return next(new ApiError(422, "Validation failed", result.error.flatten()));
    }

    req.validated = result.data;
    return next();
  };
}

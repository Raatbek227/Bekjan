function sanitizeValue(value) {
  if (typeof value === "string") {
    return value.replace(/[<>]/g, "");
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeValue(entry)]));
  }

  return value;
}

export function sanitizeRequestBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  next();
}

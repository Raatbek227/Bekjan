import { Router } from "express";
import multer from "multer";
import { getAdminAnalytics, listAdminOrders, listAdminCustomers } from "../controllers/admin.controller.js";
import {
  createBookingSlot,
  createStaff,
  listBookings,
  listBookingSlots,
  listStaff,
  listWorkingHours,
  updateBookingSlot,
  updateBookingStatus,
  upsertWorkingHour
} from "../controllers/booking.controller.js";
import {
  createProduct,
  createProductCategory,
  deactivateProduct,
  getAdminProduct,
  listProductCategories,
  listProducts,
  updateProduct,
  updateProductCategory
} from "../controllers/product.controller.js";
import { listServices } from "../controllers/service.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  bookingSlotSchema,
  listBookingsSchema,
  staffSchema,
  updateBookingSlotSchema,
  updateBookingStatusSchema,
  workingHourSchema
} from "../validators/booking.validator.js";
import {
  productCategorySchema,
  productSchema,
  updateProductCategorySchema,
  updateProductSchema
} from "../validators/product.validator.js";
import {
  createGallery,
  updateGallery,
  deleteGallery
} from "../controllers/admin.gallery.controller.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const adminRouter = Router();

// Require elevated roles for admin area
adminRouter.use(requireAuth, requireRoles("MANAGER", "ADMIN", "SUPER_ADMIN"));

adminRouter.get("/analytics", getAdminAnalytics);
adminRouter.get("/products", listProducts);
adminRouter.get("/products/:id", getAdminProduct);
adminRouter.post("/products", validate(productSchema), createProduct);
adminRouter.patch("/products/:id", validate(updateProductSchema), updateProduct);
adminRouter.delete("/products/:id", deactivateProduct);
adminRouter.get("/product-categories", listProductCategories);
adminRouter.post("/product-categories", validate(productCategorySchema), createProductCategory);
adminRouter.patch("/product-categories/:id", validate(updateProductCategorySchema), updateProductCategory);
adminRouter.get("/services", listServices);
adminRouter.get("/orders", listAdminOrders);
adminRouter.get("/customers", listAdminCustomers);
adminRouter.get("/bookings", validate(listBookingsSchema), listBookings);
adminRouter.patch("/bookings/:id/status", validate(updateBookingStatusSchema), updateBookingStatus);
adminRouter.get("/booking-slots", listBookingSlots);
adminRouter.post("/booking-slots", validate(bookingSlotSchema), createBookingSlot);
adminRouter.patch("/booking-slots/:id", validate(updateBookingSlotSchema), updateBookingSlot);
adminRouter.get("/staff", listStaff);
adminRouter.post("/staff", validate(staffSchema), createStaff);
adminRouter.get("/working-hours", listWorkingHours);
adminRouter.put("/working-hours", validate(workingHourSchema), upsertWorkingHour);

// Gallery admin endpoints (requires admin role)
adminRouter.post("/gallery", upload.single("media"), createGallery);
adminRouter.put("/gallery/:id", upload.single("media"), updateGallery);
adminRouter.delete("/gallery/:id", deleteGallery);

export default adminRouter;

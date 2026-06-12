import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { productRouter } from "./product.routes.js";
import { serviceRouter } from "./service.routes.js";
import { bookingRouter } from "./booking.routes.js";
import { cartRouter } from "./cart.routes.js";
import { orderRouter } from "./order.routes.js";
import { blogRouter } from "./blog.routes.js";
import { contactRouter } from "./contact.routes.js";
import { galleryRouter } from "./gallery.routes.js";
import adminRouter from "./admin.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/services", serviceRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/blogs", blogRouter);
apiRouter.use("/contacts", contactRouter);
apiRouter.use("/gallery", galleryRouter);
apiRouter.use("/admin", adminRouter);

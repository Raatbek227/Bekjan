import { Router } from "express";
import {
  listBlogs,
  getBlog,
  listBlogCategories,
  listBlogComments,
  createBlogComment,
  likeBlog
} from "../controllers/blog.controller.js";

export const blogRouter = Router();

blogRouter.get("/", listBlogs);
blogRouter.get("/categories", listBlogCategories);
blogRouter.get("/:slug/comments", listBlogComments);
blogRouter.post("/:slug/comments", createBlogComment);
blogRouter.post("/:slug/like", likeBlog);
blogRouter.get("/:slug", getBlog);

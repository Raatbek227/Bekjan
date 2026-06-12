import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { blogService } from "../services/blog.service.js";

export const listBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogService.list(req.query);
  res.json({ data: blogs });
});

export const getBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.getBySlug(req.params.slug);
  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  res.json(blog);
});

export const listBlogCategories = asyncHandler(async (req, res) => {
  const categories = await blogService.listCategories();
  res.json(categories);
});

export const listBlogComments = asyncHandler(async (req, res) => {
  const comments = await blogService.listComments(req.params.slug);
  res.json(comments);
});

export const createBlogComment = asyncHandler(async (req, res) => {
  const comment = await blogService.createComment(req.params.slug, {
    ...req.body,
    userId: req.user?.id || null
  });

  res.status(201).json(comment);
});

export const likeBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.likeBlog(req.params.slug);
  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  res.json(blog);
});

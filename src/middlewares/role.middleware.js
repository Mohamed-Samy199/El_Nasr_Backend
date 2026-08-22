import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") return next(ApiError.forbidden("Admins only"));
  next();
};

export const isEditor = (req, res, next) => {
  if (!["admin", "editor"].includes(req.user?.role)) {
    return next(ApiError.forbidden("Access denied"));
  }
  next();
};
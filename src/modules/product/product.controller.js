import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as productService from "./product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, { product }, "Product created successfully"));
});

export const getProducts = asyncHandler(async (req, res) => {
  const { page, size, category, status } = req.query;
  const result = await productService.getProducts({ page, size, category, status });
  res.status(200).json(new ApiResponse(200, result, "Products fetched successfully"));
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, { product }, "Product fetched successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { product }, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});

export const attachImages = asyncHandler(async (req, res) => {
  const product = await productService.attachImages(req.params.id, req.body.images);
  res.status(200).json(new ApiResponse(200, { product }, "Images attached successfully"));
});
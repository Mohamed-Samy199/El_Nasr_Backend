import asyncHandler  from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as uploadService from "./upload.service.js";

export const uploadImages = asyncHandler(async (req, res) => {
  const images = await uploadService.uploadImages(req.files);
  res.status(200).json(new ApiResponse(200, { images }, "Images uploaded successfully"));
});

export const deleteImage = asyncHandler(async (req, res) => {
  await uploadService.deleteImage(req.params.public_id);
  res.status(200).json(new ApiResponse(200, null, "Image deleted successfully"));
});
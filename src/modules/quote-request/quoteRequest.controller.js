import asyncHandler  from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as quoteRequestService from "./quoteRequest.service.js";

export const createQuoteRequest = asyncHandler(async (req, res) => {
  const quoteRequest = await quoteRequestService.createQuoteRequest(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, { quoteRequest }, "Quote request submitted successfully"));
});

export const getQuoteRequests = asyncHandler(async (req, res) => {
  const { page, size, status } = req.query;
  const result = await quoteRequestService.getQuoteRequests({ page, size, status });
  res.status(200).json(new ApiResponse(200, result, "Quote requests fetched successfully"));
});

export const getQuoteRequestById = asyncHandler(async (req, res) => {
  const quoteRequest = await quoteRequestService.getQuoteRequestById(req.params.id);
  res.status(200).json(new ApiResponse(200, { quoteRequest }, "Quote request fetched successfully"));
});

export const updateQuoteRequest = asyncHandler(async (req, res) => {
  const quoteRequest = await quoteRequestService.updateQuoteRequest(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { quoteRequest }, "Quote request updated successfully"));
});

export const deleteQuoteRequest = asyncHandler(async (req, res) => {
  await quoteRequestService.deleteQuoteRequest(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Quote request deleted successfully"));
});
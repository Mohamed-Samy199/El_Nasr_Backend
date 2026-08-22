import asyncHandler  from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as dashboardService from "./dashboard.service.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  res.status(200).json(new ApiResponse(200, { stats }, "Dashboard stats fetched successfully"));
});
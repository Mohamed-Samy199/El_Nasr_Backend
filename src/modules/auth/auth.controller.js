import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { registerUser, loginUser } from "./auth.service.js";
import { BEARER_KEY } from "../../config/env.config.js";

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);
  user.password = undefined;
  res.status(201).json(new ApiResponse(201, { user, token: `${BEARER_KEY} ${token}` }, "Account created successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  user.password = undefined;
  res.status(200).json(new ApiResponse(200, { user, token: `${BEARER_KEY} ${token}` }, "Logged in successfully"));
});

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, "Profile fetched successfully"));
});
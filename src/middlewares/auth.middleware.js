import User from "../models/User.model.js";
import { findById } from "../db/database.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyJwt } from "../utils/generateToken.js";
import { BEARER_KEY } from "../config/env.config.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith(BEARER_KEY)) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);

    const user = await findById({ model: User, id: decoded.id });
    if (!user) throw ApiError.unauthorized("User no longer exists");
    if (!user.isActive) throw ApiError.forbidden("Account is disabled");

    req.user = user;
    next();
  } catch (err) {
    next(err.statusCode ? err : ApiError.unauthorized("Invalid or expired token"));
  }
};
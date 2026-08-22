import User from "../../models/User.model.js";
import { findOne, create } from "../../db/database.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateToken } from "../../utils/generateToken.js";

export const registerUser = async ({ name, email, password, role }) => {
  const existing = await findOne({ model: User, filter: { email } });
  if (existing) throw ApiError.conflict("Email is already registered");

  const usersCount = await User.countDocuments();
  const finalRole = usersCount === 0 ? "admin" : role || "editor";

  const user = await create({ model: User, data: { name, email, password, role: finalRole } });
  const token = generateToken({ id: user._id, role: user.role });
  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await findOne({ model: User, filter: { email }, select: "+password" });
  if (!user) throw ApiError.unauthorized("Invalid email or password");
  if (!user.isActive) throw ApiError.forbidden("Account is disabled");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  const token = generateToken({ id: user._id, role: user.role });
  return { user, token };
};
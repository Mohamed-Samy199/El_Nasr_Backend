import User from "../models/User.model.js";
import { verifyToken } from "./auth.middleware.js";
import { isAdmin } from "./role.middleware.js";

// لو الداتابيز فاضية من اليوزرز: التسجيل مفتوح (أول أدمن بيتسجل بنفسه)
// لو فيه يوزر واحد على الأقل: التسجيل بقى محتاج توكن أدمن (يمنع أي حد يسجل نفسه)
export const bootstrapOrAdmin = async (req, res, next) => {
  const usersCount = await User.countDocuments();
  if (usersCount === 0) return next();
  return verifyToken(req, res, () => isAdmin(req, res, next));
};
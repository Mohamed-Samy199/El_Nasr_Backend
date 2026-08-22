// import jwt from "jsonwebtoken";
// import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.config.js";

// export const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
// };



import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.config.js";

export const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyJwt = (token) => jwt.verify(token, JWT_SECRET);
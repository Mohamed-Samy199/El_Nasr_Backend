import { Router } from "express";
import { register, login, getProfile } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { bootstrapOrAdmin } from "../../middlewares/bootstrapOrAdmin.middleware.js";

const router = Router();

router.post("/register", bootstrapOrAdmin, validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", verifyToken, getProfile);

export default router;
import { Router } from "express";
import * as controller from "./quoteRequest.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createQuoteRequestSchema, updateQuoteRequestSchema } from "./quoteRequest.validation.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isEditor } from "../../middlewares/role.middleware.js";
import { quoteRequestLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

// عام - فورم الموقع (بيحمي نفسه بـ rate limiter مخصص ضد السبام)
router.post("/", quoteRequestLimiter, validate(createQuoteRequestSchema), controller.createQuoteRequest);

// محمي - لوحة التحكم
router.get("/", verifyToken, isEditor, controller.getQuoteRequests);
router.get("/:id", verifyToken, isEditor, controller.getQuoteRequestById);
router.patch("/:id", verifyToken, isEditor, validate(updateQuoteRequestSchema), controller.updateQuoteRequest);
router.delete("/:id", verifyToken, isEditor, controller.deleteQuoteRequest);

export default router;
import { Router } from "express";
import * as controller from "./dashboard.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isEditor } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/stats", verifyToken, isEditor, controller.getStats);

export default router;
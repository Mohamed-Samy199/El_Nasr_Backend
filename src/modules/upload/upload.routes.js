import { Router } from "express";
import * as controller from "./upload.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isEditor } from "../../middlewares/role.middleware.js";

const router = Router();

router.post("/", verifyToken, isEditor, upload.array("images", 5), controller.uploadImages);
router.delete("/:public_id", verifyToken, isEditor, controller.deleteImage);

export default router;
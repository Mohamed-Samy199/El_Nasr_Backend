import { Router } from "express";
import * as controller from "./product.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "./product.validation.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isEditor } from "../../middlewares/role.middleware.js";

const router = Router();

// عام - الموقع نفسه
router.get("/", controller.getProducts);
router.get("/:slug", controller.getProductBySlug);

// محمي - لوحة التحكم
router.post("/", verifyToken, isEditor, validate(createProductSchema), controller.createProduct);
router.put("/:id", verifyToken, isEditor, validate(updateProductSchema), controller.updateProduct);
router.delete("/:id", verifyToken, isEditor, controller.deleteProduct);
router.patch("/:id/images", verifyToken, isEditor, controller.attachImages);

export default router;
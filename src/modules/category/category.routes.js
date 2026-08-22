import { Router } from "express";
import * as controller from "./category.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "./category.validation.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isEditor } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", controller.getAllCategories); // عام - للموقع نفسه

router.post("/", verifyToken, isEditor, validate(createCategorySchema), controller.createCategory);
router.put("/:id", verifyToken, isEditor, validate(updateCategorySchema), controller.updateCategory);
router.delete("/:id", verifyToken, isEditor, controller.deleteCategory);

export default router;
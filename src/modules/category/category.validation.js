import Joi from "joi";

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  public_id: Joi.string().required(),
});

export const createCategorySchema = Joi.object({
  name_en: Joi.string().min(2).max(60).required(),
  name_ar: Joi.string().min(2).max(60).required(),
  description_en: Joi.string().max(500).allow(""),
  description_ar: Joi.string().max(500).allow(""),
  image: imageSchema.optional(), // اختياري — لو الأدمن مرفعش صورة
});

export const updateCategorySchema = Joi.object({
  name_en: Joi.string().min(2).max(60),
  name_ar: Joi.string().min(2).max(60),
  description_en: Joi.string().max(500).allow(""),
  description_ar: Joi.string().max(500).allow(""),
  image: imageSchema.optional(),
  isActive: Joi.boolean(),
});
import Joi from "joi";

export const createCategorySchema = Joi.object({
  name_en: Joi.string().min(2).max(60).required(),
  name_ar: Joi.string().min(2).max(60).required(),
  description_en: Joi.string().max(500).allow(""),
  description_ar: Joi.string().max(500).allow(""),
});

export const updateCategorySchema = Joi.object({
  name_en: Joi.string().min(2).max(60),
  name_ar: Joi.string().min(2).max(60),
  description_en: Joi.string().max(500).allow(""),
  description_ar: Joi.string().max(500).allow(""),
  isActive: Joi.boolean(),
});
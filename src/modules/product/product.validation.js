import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export const createProductSchema = Joi.object({
  name_en: Joi.string().min(2).max(100).required(),
  name_ar: Joi.string().min(2).max(100).required(),
  category: objectId.required(),
  description_en: Joi.string().max(1000).allow(""),
  description_ar: Joi.string().max(1000).allow(""),
  origin_en: Joi.string().max(100).allow(""),
  origin_ar: Joi.string().max(100).allow(""),
  season_en: Joi.string().max(100).allow(""),
  season_ar: Joi.string().max(100).allow(""),
  grade_en: Joi.string().max(100).allow(""),
  grade_ar: Joi.string().max(100).allow(""),
  packaging_en: Joi.string().max(200).allow(""),
  packaging_ar: Joi.string().max(200).allow(""),
  minOrderQty: Joi.string().max(50).allow(""),
  status: Joi.string().valid("draft", "in_review", "published"),
});

export const updateProductSchema = createProductSchema.fork(
  ["name_en", "name_ar", "category"],
  (schema) => schema.optional()
);
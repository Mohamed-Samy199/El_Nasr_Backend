import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export const createQuoteRequestSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  companyName: Joi.string().max(100).allow(""),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).max(20).required(),
  country: Joi.string().min(2).max(60).required(),
  product: objectId.required(),
  quantity: Joi.string().min(1).max(50).required(),
  packagingPreference: Joi.string().max(100).allow(""),
  message: Joi.string().max(1000).allow(""),
});

export const updateQuoteRequestSchema = Joi.object({
  status: Joi.string().valid("new", "in_progress", "closed"),
  handledBy: objectId,
  internalNote: Joi.string().max(500).allow(""),
});
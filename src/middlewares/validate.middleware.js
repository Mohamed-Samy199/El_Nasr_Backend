import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    // بيشيل أي حقل زيادة مش معرّف في الـ Joi schema بدل ما يرفض الطلب كله —
    // ده اللي كان بيسبب الـ 400 لما الفرونت كان بيبعت الـ document كامل
    // (زي _id, slug, images, createdBy, __v) مع أي تحديث
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return next(ApiError.badRequest("Validation failed", errors));
  }

  // نستبدل الـ body بالنسخة النضيفة بعد الفلترة — أي كود بعدها هيشتغل
  // على البيانات الصح بس
  req.body = value;
  next();
};

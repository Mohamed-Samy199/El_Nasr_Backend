import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true }, // عشان نقدر نمسحها من Cloudinary بعدين
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name_en: { type: String, required: true, trim: true },
    name_ar: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },

    description_en: { type: String, trim: true },
    description_ar: { type: String, trim: true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    origin_en: { type: String, trim: true },       // المنشأ
    origin_ar: { type: String, trim: true },

    season_en: { type: String, trim: true },        // الموسم
    season_ar: { type: String, trim: true },

    grade_en: { type: String, trim: true },         // الدرجة
    grade_ar: { type: String, trim: true },

    packaging_en: { type: String, trim: true },      // التعبئة
    packaging_ar: { type: String, trim: true },

    minOrderQty: { type: String, trim: true },        // الحد الأدنى للطلب (نص عشان "20 طن" مش رقم بس)

    images: { type: [imageSchema], default: [] },

    status: {
      type: String,
      enum: ["draft", "in_review", "published"],
      default: "draft",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: "__v" }
);

productSchema.index({ category: 1, status: 1 });
productSchema.index({ name_en: "text", name_ar: "text" }); // بحث نصي

const Product = mongoose.model("Product", productSchema);
export default Product;